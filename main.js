const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const OpenAI = require('openai');
const fs = require('fs');

// Load environment variables from .env file manually (more reliable in Electron)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

let mainWindow;
let openai;
let conversationHistory = []; // Store last 5 Q&A pairs for context
let shortcutsEnabled = true; // Track if shortcuts are enabled

// Initialize OpenAI - reads from environment variable
function initOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('Warning: OPENAI_API_KEY not set. Please add it to .env file.');
    return null;
  }
  console.log('OpenAI API key loaded successfully');
  return new OpenAI({ apiKey });
}

// Register all shortcuts
function registerShortcuts() {
  // M - Toggle recording (only works if shortcuts are enabled)
  globalShortcut.register('M', () => {
    if (shortcutsEnabled) {
      mainWindow.webContents.send('toggle-recording');
    }
  });

  // Numpad * - Toggle shortcuts on/off (always works)
  globalShortcut.register('nummult', () => {
    shortcutsEnabled = !shortcutsEnabled;
    mainWindow.webContents.send('shortcuts-toggled', shortcutsEnabled);
    console.log('Shortcuts', shortcutsEnabled ? 'ENABLED' : 'DISABLED');
  });

  // Numpad - - Make window invisible (stealth mode)
  globalShortcut.register('numsub', () => {
    globalShortcut.unregisterAll();
    mainWindow.setOpacity(0); // Invisible but still running
    mainWindow.setIgnoreMouseEvents(true); // Click-through
    
    // Register Insert key to restore window
    globalShortcut.register('Insert', () => {
      globalShortcut.unregister('Insert');
      mainWindow.setOpacity(1); // Visible again
      mainWindow.setIgnoreMouseEvents(false); // Accept clicks
      registerShortcuts();
      shortcutsEnabled = true;
      mainWindow.webContents.send('shortcuts-toggled', true);
      console.log('Window restored. All shortcuts enabled.');
    });
    
    console.log('Window hidden (stealth). Press Insert to restore.');
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true, // Hidden from taskbar completely
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  
  // Register shortcuts
  registerShortcuts();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize OpenAI after app is ready
app.whenReady().then(() => {
  openai = initOpenAI();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC Handlers for OpenAI API calls

// Transcribe audio using Whisper
ipcMain.handle('transcribe-audio', async (event, audioBuffer) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.');
  }

  try {
    // Create a temporary file for the audio
    const tempPath = path.join(app.getPath('temp'), `recording-${Date.now()}.webm`);
    fs.writeFileSync(tempPath, Buffer.from(audioBuffer));

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-1',
      response_format: 'text'
    });

    // Clean up temp file
    fs.unlinkSync(tempPath);

    return transcription;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
});

// Get AI solution using GPT-4
ipcMain.handle('get-solution', async (event, transcription) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.');
  }

  try {
    // Build messages array with system prompt + conversation history + new question
    const messages = [
      {
        role: 'system',
        content: `You are an interview answer assistant. The user is in an interview and needs quick, direct answers.

RULES:
- Give SHORT, DIRECT answers that an interviewer wants to hear
- No fluff, no lengthy explanations
- Answer like a confident candidate would
- If it's a technical question, give the precise answer
- If it's a behavioral question, give a concise STAR response
- Maximum 2-3 sentences unless the question requires more
- Sound natural and professional
- You have context of previous questions in this interview, use it if relevant`
      },
      // Include last 5 Q&A pairs for context
      ...conversationHistory.slice(-10), // 5 pairs = 10 messages (user + assistant)
      {
        role: 'user',
        content: `Interview question: "${transcription}"\n\nGive me a direct answer.`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const answer = completion.choices[0].message.content;

    // Add this Q&A to history (keep last 5 pairs = 10 messages)
    conversationHistory.push(
      { role: 'user', content: `Question: "${transcription}"` },
      { role: 'assistant', content: answer }
    );
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    return answer;
  } catch (error) {
    console.error('GPT error:', error);
    throw error;
  }
});

// Handle window controls
ipcMain.on('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.on('close-window', () => {
  mainWindow?.close();
});
