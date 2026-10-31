import { Platform } from 'react-native';
import { Language } from '../../types/database';
import { parseSpokenNumber, ParseResult } from '../../engines/number-parser';

export type SpeechRecognizerState = 'idle' | 'listening' | 'processing' | 'error';

export interface RecognizerCallbacks {
  onStateChange?: (state: SpeechRecognizerState) => void;
  onPartialResult?: (transcript: string) => void;
  onFinalResult?: (result: ParseResult) => void;
  onError?: (error: string) => void;
}

export class SpeechRecognizerService {
  private currentState: SpeechRecognizerState = 'idle';
  private callbacks: RecognizerCallbacks = {};
  private activeRecognition: any = null;
  private listenTimeout: any = null;

  public getState(): SpeechRecognizerState {
    return this.currentState;
  }

  public isAvailable(): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return Boolean(
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      );
    }
    // Native has Vosk / on-device recognizer support
    return true;
  }

  private setState(state: SpeechRecognizerState) {
    this.currentState = state;
    this.callbacks.onStateChange?.(state);
  }

  /**
   * Starts listening for user's numerical answer through the device microphone.
   */
  public async startListening(
    language: Language = 'en',
    callbacks: RecognizerCallbacks,
    timeoutMs: number = 8000
  ) {
    this.stopListening();
    this.callbacks = callbacks;
    this.setState('listening');

    const langCode = language === 'hi' ? 'hi-IN' : 'en-US';

    // 1. Web Speech API Recognition (Chrome, Edge, Safari, Android Chrome)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          this.activeRecognition = recognition;

          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;
          recognition.lang = langCode;

          recognition.onstart = () => {
            this.setState('listening');
          };

          recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }

            const currentText = finalTranscript || interimTranscript;
            if (currentText) {
              this.callbacks.onPartialResult?.(currentText);
            }

            if (finalTranscript) {
              if (this.listenTimeout) {
                clearTimeout(this.listenTimeout);
                this.listenTimeout = null;
              }
              this.setState('processing');
              const parseResult = parseSpokenNumber(finalTranscript, language);
              this.setState('idle');
              this.callbacks.onFinalResult?.(parseResult);
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('Speech recognition event error:', event.error);
            if (this.listenTimeout) {
              clearTimeout(this.listenTimeout);
              this.listenTimeout = null;
            }

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
              this.setState('error');
              this.callbacks.onError?.(
                'Microphone permission was denied. Please allow microphone access in your browser or device settings.'
              );
            } else if (event.error === 'no-speech') {
              // Silence detected
              this.setState('idle');
              this.callbacks.onFinalResult?.({
                number: null,
                detectedLanguage: language,
                confidence: 0,
                rawInput: '',
              });
            } else {
              this.setState('idle');
              this.callbacks.onError?.(`Speech recognition error: ${event.error}`);
            }
          };

          recognition.onend = () => {
            if (this.currentState === 'listening') {
              this.setState('idle');
            }
            this.activeRecognition = null;
          };

          recognition.start();

          // Timeout safety in case browser hangs
          this.listenTimeout = setTimeout(() => {
            if (this.currentState === 'listening') {
              this.stopListening();
              this.callbacks.onFinalResult?.({
                number: null,
                detectedLanguage: language,
                confidence: 0,
                rawInput: '',
              });
            }
          }, timeoutMs);

          return;
        } catch (err: any) {
          console.warn('Failed to start web speech recognition:', err);
          // Fall through to simulated/timer fallback
        }
      }
    }

    // 2. Fallback timeout for environments without Web Speech API or physical microphone
    this.listenTimeout = setTimeout(() => {
      if (this.currentState === 'listening') {
        this.setState('idle');
        this.callbacks.onFinalResult?.({
          number: null,
          detectedLanguage: language,
          confidence: 0,
          rawInput: '',
        });
      }
    }, timeoutMs);
  }

  /**
   * Manually feeds a spoken transcript (from input or voice simulator)
   */
  public processSpokenTranscript(transcript: string, language: Language = 'en') {
    if (this.listenTimeout) {
      clearTimeout(this.listenTimeout);
      this.listenTimeout = null;
    }

    this.stopListening();
    this.setState('processing');
    const parseResult = parseSpokenNumber(transcript, language);
    this.setState('idle');
    this.callbacks.onFinalResult?.(parseResult);
  }

  public stopListening() {
    if (this.listenTimeout) {
      clearTimeout(this.listenTimeout);
      this.listenTimeout = null;
    }

    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch (e) {}
      this.activeRecognition = null;
    }

    this.setState('idle');
  }
}

export const speechRecognizerService = new SpeechRecognizerService();
