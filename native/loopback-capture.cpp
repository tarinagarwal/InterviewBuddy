// WASAPI Loopback Audio Capture
// Captures system audio output and writes WAV to specified file
// Usage: loopback-capture.exe <output.wav>
// Stops when stdin receives any input or on SIGINT

#include <windows.h>
#include <mmdeviceapi.h>
#include <audioclient.h>
#include <io.h>
#include <fcntl.h>
#include <stdio.h>
#include <signal.h>

#pragma comment(lib, "ole32.lib")

// WAV file header
#pragma pack(push, 1)
struct WavHeader {
    char riff[4] = {'R','I','F','F'};
    DWORD fileSize = 0;
    char wave[4] = {'W','A','V','E'};
    char fmt[4] = {'f','m','t',' '};
    DWORD fmtSize = 16;
    WORD audioFormat = 1; // PCM
    WORD numChannels = 0;
    DWORD sampleRate = 0;
    DWORD byteRate = 0;
    WORD blockAlign = 0;
    WORD bitsPerSample = 0;
    char data[4] = {'d','a','t','a'};
    DWORD dataSize = 0;
};
#pragma pack(pop)

volatile bool g_running = true;

void signalHandler(int) {
    g_running = false;
}

// Check if stdin has data available (non-blocking)
bool stdinHasData() {
    HANDLE hStdin = GetStdHandle(STD_INPUT_HANDLE);
    DWORD available = 0;
    if (PeekNamedPipe(hStdin, NULL, 0, NULL, &available, NULL)) {
        return available > 0;
    }
    return false;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: loopback-capture.exe <output.wav>\n");
        return 1;
    }

    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);

    const char* outputPath = argv[1];

    // Initialize COM
    HRESULT hr = CoInitializeEx(NULL, COINIT_MULTITHREADED);
    if (FAILED(hr)) {
        fprintf(stderr, "COM init failed: 0x%08lx\n", hr);
        return 1;
    }

    // Get default audio render endpoint
    IMMDeviceEnumerator* enumerator = NULL;
    hr = CoCreateInstance(
        __uuidof(MMDeviceEnumerator), NULL, CLSCTX_ALL,
        __uuidof(IMMDeviceEnumerator), (void**)&enumerator
    );
    if (FAILED(hr)) {
        fprintf(stderr, "Failed to create device enumerator: 0x%08lx\n", hr);
        CoUninitialize();
        return 1;
    }

    IMMDevice* device = NULL;
    hr = enumerator->GetDefaultAudioEndpoint(eRender, eConsole, &device);
    if (FAILED(hr)) {
        fprintf(stderr, "No audio render device found: 0x%08lx\n", hr);
        enumerator->Release();
        CoUninitialize();
        return 1;
    }

    // Activate audio client
    IAudioClient* audioClient = NULL;
    hr = device->Activate(__uuidof(IAudioClient), CLSCTX_ALL, NULL, (void**)&audioClient);
    if (FAILED(hr)) {
        fprintf(stderr, "Failed to activate audio client: 0x%08lx\n", hr);
        device->Release();
        enumerator->Release();
        CoUninitialize();
        return 1;
    }

    // Get mix format
    WAVEFORMATEX* pwfx = NULL;
    hr = audioClient->GetMixFormat(&pwfx);
    if (FAILED(hr)) {
        fprintf(stderr, "Failed to get mix format: 0x%08lx\n", hr);
        audioClient->Release();
        device->Release();
        enumerator->Release();
        CoUninitialize();
        return 1;
    }

    // Force 16-bit PCM for compatibility with Whisper
    WAVEFORMATEX wavFormat = {};
    wavFormat.wFormatTag = WAVE_FORMAT_PCM;
    wavFormat.nChannels = pwfx->nChannels;
    wavFormat.nSamplesPerSec = pwfx->nSamplesPerSec;
    wavFormat.wBitsPerSample = 16;
    wavFormat.nBlockAlign = wavFormat.nChannels * wavFormat.wBitsPerSample / 8;
    wavFormat.nAvgBytesPerSec = wavFormat.nSamplesPerSec * wavFormat.nBlockAlign;

    // Initialize loopback capture (use device's native format)
    hr = audioClient->Initialize(
        AUDCLNT_SHAREMODE_SHARED,
        AUDCLNT_STREAMFLAGS_LOOPBACK,
        10000000, // 1 second buffer
        0,
        pwfx,
        NULL
    );
    if (FAILED(hr)) {
        fprintf(stderr, "Failed to initialize loopback: 0x%08lx\n", hr);
        CoTaskMemFree(pwfx);
        audioClient->Release();
        device->Release();
        enumerator->Release();
        CoUninitialize();
        return 1;
    }

    // Get capture client
    IAudioCaptureClient* captureClient = NULL;
    hr = audioClient->GetService(__uuidof(IAudioCaptureClient), (void**)&captureClient);
    if (FAILED(hr)) {
        fprintf(stderr, "Failed to get capture client: 0x%08lx\n", hr);
        CoTaskMemFree(pwfx);
        audioClient->Release();
        device->Release();
        enumerator->Release();
        CoUninitialize();
        return 1;
    }

    // Open output file
    FILE* outFile = fopen(outputPath, "wb");
    if (!outFile) {
        fprintf(stderr, "Failed to open output file: %s\n", outputPath);
        captureClient->Release();
        CoTaskMemFree(pwfx);
        audioClient->Release();
        device->Release();
        enumerator->Release();
        CoUninitialize();
        return 1;
    }

    // Write WAV header (placeholder sizes, will fix later)
    WavHeader header;
    header.numChannels = wavFormat.nChannels;
    header.sampleRate = wavFormat.nSamplesPerSec;
    header.bitsPerSample = wavFormat.wBitsPerSample;
    header.blockAlign = wavFormat.nBlockAlign;
    header.byteRate = wavFormat.nAvgBytesPerSec;
    fwrite(&header, sizeof(header), 1, outFile);

    // Signal ready
    fprintf(stderr, "READY\n");
    fflush(stderr);

    // Start capture
    audioClient->Start();

    DWORD totalDataBytes = 0;
    bool isFloat = (pwfx->wFormatTag == WAVE_FORMAT_IEEE_FLOAT) ||
                   (pwfx->wFormatTag == WAVE_FORMAT_EXTENSIBLE && pwfx->wBitsPerSample == 32);
    int srcBytesPerSample = pwfx->wBitsPerSample / 8;
    int srcChannels = pwfx->nChannels;

    while (g_running) {
        // Check if Node.js sent stop signal via stdin
        if (stdinHasData()) {
            g_running = false;
            break;
        }

        Sleep(10); // ~100 Hz poll rate

        UINT32 packetLength = 0;
        captureClient->GetNextPacketSize(&packetLength);

        while (packetLength > 0) {
            BYTE* data = NULL;
            UINT32 numFrames = 0;
            DWORD flags = 0;

            hr = captureClient->GetBuffer(&data, &numFrames, &flags, NULL, NULL);
            if (FAILED(hr)) break;

            if (flags & AUDCLNT_BUFFERFLAGS_SILENT) {
                // Write silence (zeros)
                DWORD silenceBytes = numFrames * wavFormat.nBlockAlign;
                BYTE* silence = (BYTE*)calloc(silenceBytes, 1);
                fwrite(silence, 1, silenceBytes, outFile);
                free(silence);
                totalDataBytes += silenceBytes;
            } else {
                // Convert float32 to int16 if necessary
                if (isFloat) {
                    for (UINT32 i = 0; i < numFrames; i++) {
                        for (int ch = 0; ch < (int)wavFormat.nChannels && ch < srcChannels; ch++) {
                            float sample = *((float*)(data + i * srcChannels * srcBytesPerSample + ch * srcBytesPerSample));
                            // Clamp to [-1, 1]
                            if (sample > 1.0f) sample = 1.0f;
                            if (sample < -1.0f) sample = -1.0f;
                            short pcmSample = (short)(sample * 32767.0f);
                            fwrite(&pcmSample, sizeof(short), 1, outFile);
                            totalDataBytes += sizeof(short);
                        }
                    }
                } else {
                    // Already PCM, write directly
                    DWORD bytes = numFrames * pwfx->nBlockAlign;
                    fwrite(data, 1, bytes, outFile);
                    totalDataBytes += bytes;
                }
            }

            captureClient->ReleaseBuffer(numFrames);
            captureClient->GetNextPacketSize(&packetLength);
        }
    }

    // Stop capture
    audioClient->Stop();

    // Fix WAV header with actual sizes
    header.dataSize = totalDataBytes;
    header.fileSize = sizeof(WavHeader) - 8 + totalDataBytes;
    fseek(outFile, 0, SEEK_SET);
    fwrite(&header, sizeof(header), 1, outFile);
    fclose(outFile);

    fprintf(stderr, "DONE %lu bytes captured\n", totalDataBytes);

    // Cleanup
    captureClient->Release();
    CoTaskMemFree(pwfx);
    audioClient->Release();
    device->Release();
    enumerator->Release();
    CoUninitialize();

    return 0;
}
