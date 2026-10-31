import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ProgressBarProps {
  progress: number; // 0.0 to 1.0
  color?: string;
  height?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  height = 8,
  accessibilityLabel,
  style,
}) => {
  const { theme, isHighContrast } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clamped * 100);

  return (
    <View
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      accessibilityLabel={accessibilityLabel || `Progress: ${percent}%`}
      style={[
        styles.container,
        {
          height,
          backgroundColor: theme.surfaceSubtle,
          borderColor: isHighContrast ? theme.border : 'transparent',
          borderWidth: isHighContrast ? 1 : 0,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${percent}%`,
            backgroundColor: color || theme.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
