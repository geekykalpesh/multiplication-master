import { SpeechModelMetadata } from '../types/speech';

export const OFFLINE_SPEECH_MODELS: Record<string, SpeechModelMetadata> = {
  'vosk-model-small-en-us': {
    id: 'vosk-model-small-en-us',
    name: 'English Offline Speech Model (Small)',
    language: 'en',
    version: '0.15',
    sizeBytes: 41943040, // ~40 MB
    formattedSize: '40.2 MB',
    checksumSha256: '9f268b8b0e7371900ce7b140cfc6c499c7595b281fbb4ef06b74e622998a4da4',
    downloadUrl: 'https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip',
    description: 'Lightweight, high-accuracy offline English model optimized for mobile numerical recall.',
  },
  'vosk-model-small-hi': {
    id: 'vosk-model-small-hi',
    name: 'Hindi Offline Speech Model (Small)',
    language: 'hi',
    version: '0.22',
    sizeBytes: 44040192, // ~42 MB
    formattedSize: '42.1 MB',
    checksumSha256: '8e8156637fc5ad2566be0421cf1be930ae2572b835948f654b9f2ebdf63d5964',
    downloadUrl: 'https://alphacephei.com/vosk/models/vosk-model-small-hi-0.22.zip',
    description: 'Comprehensive offline Hindi speech model tuned for Indian numbers and counting vocabulary.',
  },
};
