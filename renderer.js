// ===== State Management =====
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let timerInterval = null;

// ===== DOM Elements =====
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const timerSection = document.getElementById('timer-section');
const timerDisplay = document.getElementById('timer');
const transcriptionCard = document.getElementById('transcription-card');
const transcriptionContent = document.getElementById('transcription-content');
const solutionCard = document.getElementById('solution-card');
const solutionContent = document.getElementById('solution-content');
const loadingOverlay = document.getElementById('loading-overlay');
const loaderText = document.getElementById('loader-text');

// Window controls
document.getElementById('minimize-btn').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

// ===== Recording Functions =====
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      } 
    });
    
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      
      // Process the recording
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      await processRecording(audioBlob);
    };
    
    // Start recording
    mediaRecorder.start(1000); // Collect data every second
    isRecording = true;
    recordingStartTime = Date.now();
    
    // Update UI
    updateUIForRecording(true);
    startTimer();
    
  } catch (error) {
    console.error('Error starting recording:', error);
    showError('Could not access microphone. Please check permissions.');
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    stopTimer();
    updateUIForRecording(false);
  }
}

// ===== Timer Functions =====
function startTimer() {
  timerSection.classList.add('visible');
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  if (!recordingStartTime) return;
  
  const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// ===== UI Update Functions =====
function updateUIForRecording(recording) {
  if (recording) {
    statusIndicator.classList.add('recording');
    statusIndicator.classList.remove('processing', 'success');
    statusText.innerHTML = 'Recording... Press <kbd>M</kbd> to stop';
  } else {
    statusIndicator.classList.remove('recording');
    statusIndicator.classList.add('processing');
    statusText.textContent = 'Processing audio...';
  }
}

function showLoading(show, text = 'Processing...') {
  loaderText.textContent = text;
  if (show) {
    loadingOverlay.classList.add('visible');
  } else {
    loadingOverlay.classList.remove('visible');
  }
}

function showError(message) {
  statusIndicator.classList.remove('recording', 'processing', 'success');
  statusText.innerHTML = `❌ ${message}`;
  setTimeout(() => {
    resetUI();
  }, 3000);
}

function resetUI() {
  statusIndicator.classList.remove('recording', 'processing', 'success');
  statusText.innerHTML = 'Press <kbd>M</kbd> to start recording';
  timerSection.classList.remove('visible');
  timerDisplay.textContent = '00:00';
}

function showResults(transcription, solution) {
  // Show transcription
  transcriptionContent.innerHTML = `<p>${escapeHtml(transcription)}</p>`;
  transcriptionContent.classList.add('has-content');
  transcriptionCard.classList.add('visible');
  
  // Show solution with markdown-like formatting
  solutionContent.innerHTML = formatSolution(solution);
  solutionContent.classList.add('has-content');
  solutionCard.classList.add('visible');
  
  // Update status
  statusIndicator.classList.remove('processing');
  statusIndicator.classList.add('success');
  statusText.innerHTML = '✓ Done! Press <kbd>M</kbd> to record again';
}

// ===== Processing Functions =====
async function processRecording(audioBlob) {
  showLoading(true, 'Transcribing audio...');
  
  try {
    // Convert blob to array buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    // Transcribe audio
    const transcription = await window.electronAPI.transcribeAudio(arrayBuffer);
    
    if (!transcription || transcription.trim() === '') {
      throw new Error('No speech detected in the recording');
    }
    
    showLoading(true, 'Getting AI solution...');
    
    // Get AI solution
    const solution = await window.electronAPI.getSolution(transcription);
    
    showLoading(false);
    showResults(transcription, solution);
    
  } catch (error) {
    console.error('Processing error:', error);
    showLoading(false);
    showError(error.message || 'Error processing audio');
  }
}

// ===== Utility Functions =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatSolution(text) {
  // Simple markdown-like formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^# (.*$)/gim, '<h2>$1</h2>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n/g, '<br>')
    .replace(/<br><li>/g, '<li>')
    .replace(/<\/li><br>/g, '</li>');
}

// ===== Event Listeners =====
// Listen for hotkey toggle from main process
window.electronAPI.onToggleRecording(() => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

// Initialize cards as hidden
transcriptionCard.classList.remove('visible');
solutionCard.classList.remove('visible');

console.log('Meet Helper initialized. Press M to start recording.');
