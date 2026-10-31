import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { AccessibleText } from '../common/AccessibleText';
import { VoiceState } from '../../types/speech';

export interface MicrophoneIndicatorProps {
  state: VoiceState;
  onPressToggle?: () => void;
  size?: number;
}

export const MicrophoneIndicator: React.FC<MicrophoneIndicatorProps> = ({
  state,
  onPressToggle,
  size = 72,
}) => {
  const { theme, isHighContrast } = useTheme();

  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking_prompt' || state === 'speaking_feedback';

  const getStatusText = () => {
    switch (state) {
      case 'speaking_prompt':
        return 'Tutor speaking...';
      case 'listening':
        return 'Listening! Speak your answer now...';
      case 'processing_audio':
      case 'evaluating_answer':
        return 'Evaluating...';
      case 'speaking_feedback':
        return 'Explaining...';
      case 'paused':
        return 'Paused';
      case 'idle':
      default:
        return 'Tap to start voice practice';
    }
  };

  const getIconColor = () => {
    if (isListening) return '#FFFFFF';
    if (isSpeaking) return theme.primary;
    return theme.textSecondary;
  };

  const getBackgroundColor = () => {
    if (isListening) return theme.micActive;
    if (isSpeaking) return theme.primaryLight;
    return theme.surfaceSubtle;
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onPressToggle}
        disabled={!onPressToggle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Microphone status: ${getStatusText()}`}
        accessibilityLiveRegion="assertive"
        activeOpacity={0.8}
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getBackgroundColor(),
            borderColor: isHighContrast ? theme.border : theme.border,
            borderWidth: isHighContrast ? 3 : 1,
          },
        ]}
      >
        <Ionicons
          name={isListening ? 'mic' : isSpeaking ? 'volume-high' : 'mic-outline'}
          size={size * 0.45}
          color={getIconColor()}
        />
      </TouchableOpacity>
      <AccessibleText
        variant="caption"
        weight="semibold"
        color={isListening ? theme.micActive : theme.textSecondary}
        style={styles.statusLabel}
      >
        {getStatusText()}
      </AccessibleText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statusLabel: {
    marginTop: 8,
    textAlign: 'center',
  },
});
