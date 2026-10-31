import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { Language } from '../../types/database';

export interface TTSOptions {
  language?: Language;
  rate?: number; // 0.5 to 1.5
  pitch?: number; // 0.5 to 1.5
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: any) => void;
}

// Module-level reference to prevent garbage collection in Chrome
let activeUtterance: any = null;

class TextToSpeechService {
  private isSpeakingInternal: boolean = false;
  private audioContext: any = null;

  /**
   * Initializes or unlocks audio context (required by browsers for autoplay policies)
   */
  public async unlockAudio(): Promise<void> {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.resume();
        }
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx && !this.audioContext) {
          this.audioContext = new AudioCtx();
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      } catch (e) {
        console.warn('Audio unlock warning:', e);
      }
    }
  }

  /**
   * Plays a pleasant sound tone (success chime or click) via Web Audio API or fallback
   */
  public playTone(frequency: number = 440, durationMs: number = 150): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          if (!this.audioContext) this.audioContext = new AudioCtx();
          if (this.audioContext.state === 'suspended') this.audioContext.resume();

          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
          gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + durationMs / 1000);
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          osc.start();
          osc.stop(this.audioContext.currentTime + durationMs / 1000);
        }
      } catch (e) {
        // AudioContext tone fallback
      }
    }
  }

  public async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!text || text.trim().length === 0) {
      options.onDone?.();
      return;
    }

    await this.unlockAudio();

    const langCode = options.language === 'hi' ? 'hi-IN' : 'en-US';
    const speechRate = options.rate ?? 1.0;
    const speechPitch = options.pitch ?? 1.0;

    // Direct Web Speech API implementation on web to bypass Chrome cancel/speak bugs & getVoices hangs
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
      return new Promise((resolve) => {
        try {
          window.speechSynthesis.resume();
          // Do not cancel if already speaking immediately without delay
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }

          setTimeout(() => {
            try {
              window.speechSynthesis.resume();
              const utterance = new SpeechSynthesisUtterance(text);
              activeUtterance = utterance; // prevent GC

              utterance.lang = langCode;
              utterance.rate = Math.max(0.5, Math.min(2.0, speechRate));
              utterance.pitch = Math.max(0.5, Math.min(2.0, speechPitch));

              // Find best matching voice if available
              const voices = window.speechSynthesis.getVoices();
              if (voices && voices.length > 0) {
                const match = voices.find((v) => v.lang === langCode || v.lang.startsWith(langCode.slice(0, 2)));
                if (match) {
                  utterance.voice = match;
                }
              }

              utterance.onstart = () => {
                this.isSpeakingInternal = true;
              };

              utterance.onend = () => {
                this.isSpeakingInternal = false;
                activeUtterance = null;
                options.onDone?.();
                resolve();
              };

              utterance.onerror = (err) => {
                this.isSpeakingInternal = false;
                activeUtterance = null;
                console.warn('SpeechSynthesis error:', err);

                // Fallback: if hi-IN voice failed, retry with default language
                if (langCode === 'hi-IN') {
                  const fallback = new SpeechSynthesisUtterance(text);
                  fallback.rate = speechRate;
                  fallback.onend = () => {
                    options.onDone?.();
                    resolve();
                  };
                  fallback.onerror = () => {
                    options.onDone?.();
                    resolve();
                  };
                  window.speechSynthesis.speak(fallback);
                } else {
                  options.onError?.(err);
                  resolve();
                }
              };

              window.speechSynthesis.speak(utterance);
            } catch (innerErr) {
              this.isSpeakingInternal = false;
              console.warn('Speech speak exception:', innerErr);
              options.onDone?.();
              resolve();
            }
          }, 30);
        } catch (err) {
          this.isSpeakingInternal = false;
          console.warn('Web speech setup failed:', err);
          options.onDone?.();
          resolve();
        }
      });
    }

    // Native implementation (Android & iOS) via expo-speech
    return new Promise((resolve) => {
      this.isSpeakingInternal = true;

      Speech.speak(text, {
        language: langCode,
        rate: speechRate,
        pitch: speechPitch,
        onDone: () => {
          this.isSpeakingInternal = false;
          options.onDone?.();
          resolve();
        },
        onStopped: () => {
          this.isSpeakingInternal = false;
          options.onStopped?.();
          resolve();
        },
        onError: (err) => {
          this.isSpeakingInternal = false;
          console.warn('Native TTS error:', err);
          // If Hindi fails on native Android, retry with en-US so audio is never silent
          if (langCode === 'hi-IN') {
            Speech.speak(text, {
              language: 'en-US',
              rate: speechRate,
              pitch: speechPitch,
              onDone: () => {
                options.onDone?.();
                resolve();
              },
              onError: () => {
                options.onDone?.();
                resolve();
              },
            });
          } else {
            options.onError?.(err);
            resolve();
          }
        },
      });
    });
  }

  public async stop(): Promise<void> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    } else {
      try {
        await Speech.stop();
      } catch (err) {}
    }
    this.isSpeakingInternal = false;
    activeUtterance = null;
  }

  public async isSpeaking(): Promise<boolean> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
      return window.speechSynthesis.speaking;
    }
    return this.isSpeakingInternal || (await Speech.isSpeakingAsync());
  }
}

export const ttsService = new TextToSpeechService();
