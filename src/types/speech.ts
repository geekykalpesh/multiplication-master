import { Language } from './database';

export type VoiceState =
  | 'idle'
  | 'initializing'
  | 'speaking_prompt'
  | 'listening'
  | 'processing_audio'
  | 'evaluating_answer'
  | 'speaking_feedback'
  | 'paused'
  | 'error';

export type RecognitionResultStatus = 'correct' | 'incorrect' | 'unclear';

export interface SpokenAnswerRecognition {
  rawTranscript: string;
  recognizedNumber: number | null;
  confidence: number;
  status: RecognitionResultStatus;
  detectedLanguage: Language;
}

export interface SpeechModelMetadata {
  id: string;
  name: string;
  language: Language;
  version: string;
  sizeBytes: number;
  formattedSize: string;
  checksumSha256: string;
  downloadUrl: string; // trusted official offline Vosk model package
  description: string;
}

export type DownloadStatus =
  | 'not_downloaded'
  | 'downloading'
  | 'verifying'
  | 'installed'
  | 'error';

export interface ModelDownloadState {
  modelId: string;
  status: DownloadStatus;
  bytesWritten: number;
  totalBytes: number;
  progressPercent: number;
  errorMessage?: string;
}
