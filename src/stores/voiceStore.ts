import { create } from 'zustand';
import { VoiceState } from '../types/speech';

interface VoiceSessionState {
  voiceState: VoiceState;
  lastTranscript: string;
  isMicActive: boolean;
  audioLevel: number; // 0 to 1
  setVoiceState: (state: VoiceState) => void;
  setLastTranscript: (transcript: string) => void;
  setAudioLevel: (level: number) => void;
  resetVoiceState: () => void;
}

export const useVoiceStore = create<VoiceSessionState>((set) => ({
  voiceState: 'idle',
  lastTranscript: '',
  isMicActive: false,
  audioLevel: 0,

  setVoiceState: (voiceState: VoiceState) => {
    set({
      voiceState,
      isMicActive: voiceState === 'listening',
    });
  },

  setLastTranscript: (lastTranscript: string) => {
    set({ lastTranscript });
  },

  setAudioLevel: (audioLevel: number) => {
    set({ audioLevel });
  },

  resetVoiceState: () => {
    set({
      voiceState: 'idle',
      lastTranscript: '',
      isMicActive: false,
      audioLevel: 0,
    });
  },
}));
