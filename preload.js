const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods for renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Recording hotkey listener
  onToggleRecording: (callback) => {
    ipcRenderer.on('toggle-recording', callback);
  },

  // Transcribe audio via Whisper API
  transcribeAudio: (audioBuffer) => {
    return ipcRenderer.invoke('transcribe-audio', audioBuffer);
  },

  // Get AI solution via GPT-4
  getSolution: (transcription) => {
    return ipcRenderer.invoke('get-solution', transcription);
  },

  // Window controls
  minimizeWindow: () => {
    ipcRenderer.send('minimize-window');
  },

  closeWindow: () => {
    ipcRenderer.send('close-window');
  }
});
