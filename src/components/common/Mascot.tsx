import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../stores/userStore';

export type MascotMood = 'happy' | 'thinking' | 'celebrating' | 'encouraging';

export interface MascotProps {
  mood?: MascotMood;
  size?: number;
  style?: ViewStyle;
}

/**
 * "Numi" - The Friendly Mathematics Learning Companion
 */
export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 100,
  style,
}) => {
  const { theme, isHighContrast } = useTheme();
  const mascotEnabled = useUserStore((s) => s.preferences.mascotEnabled);
  const targetAudience = useUserStore((s) => s.profile?.targetAudience || 'child');

  // If mascot is disabled or user is in adult mode with mascot disabled, don't display
  if (!mascotEnabled) return null;

  const primaryColor = isHighContrast ? '#FFFFFF' : '#3B82F6';
  const secondaryColor = isHighContrast ? '#FFFF00' : '#60A5FA';
  const eyeColor = isHighContrast ? '#000000' : '#1E293B';
  const blushColor = isHighContrast ? 'transparent' : '#F43F5E';
  const accessoryColor = isHighContrast ? '#FFFF00' : '#F59E0B';

  return (
    <View
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Numi the math mascot, feeling ${mood}`}
      style={[styles.container, { width: size, height: size }, style]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Shadow */}
        <Circle cx="50" cy="92" r="30" fill={isHighContrast ? '#333333' : '#E2E8F0'} />

        {/* Mascot Body: Friendly Rounded Robot / Companion */}
        <Rect
          x="20"
          y="25"
          width="60"
          height="55"
          rx="22"
          fill={primaryColor}
          stroke={isHighContrast ? '#FFFFFF' : '#1D4ED8'}
          strokeWidth="3"
        />

        {/* Belly Screen with Math Symbol */}
        <Rect
          x="30"
          y="48"
          width="40"
          height="24"
          rx="8"
          fill={isHighContrast ? '#000000' : '#EFF6FF'}
          stroke={isHighContrast ? '#FFFFFF' : '#BFDBFE'}
          strokeWidth="2"
        />
        <SvgText
          x="50"
          y="65"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fill={isHighContrast ? '#FFFF00' : '#2563EB'}
        >
          {mood === 'celebrating' ? '100%' : mood === 'thinking' ? '?' : '×'}
        </SvgText>

        {/* Eyes according to mood */}
        {mood === 'thinking' ? (
          <G>
            {/* Left eye looking up */}
            <Circle cx="38" cy="38" r="4" fill={eyeColor} />
            {/* Right eye squinted */}
            <Path d="M 58 38 Q 64 34 70 38" stroke={eyeColor} strokeWidth="3" fill="none" />
          </G>
        ) : mood === 'celebrating' ? (
          <G>
            {/* Happy arch eyes */}
            <Path d="M 32 40 Q 38 32 44 40" stroke={isHighContrast ? '#FFFFFF' : '#1E293B'} strokeWidth="3" fill="none" />
            <Path d="M 56 40 Q 62 32 68 40" stroke={isHighContrast ? '#FFFFFF' : '#1E293B'} strokeWidth="3" fill="none" />
            {/* Confetti or Stars */}
            <SvgText x="15" y="25" fontSize="12" fill={accessoryColor}>✨</SvgText>
            <SvgText x="75" y="25" fontSize="12" fill={accessoryColor}>⭐</SvgText>
          </G>
        ) : (
          <G>
            {/* Normal Happy Eyes */}
            <Circle cx="38" cy="38" r="4" fill={eyeColor} />
            <Circle cx="62" cy="38" r="4" fill={eyeColor} />
            {/* Highlights */}
            <Circle cx="39" cy="37" r="1.5" fill="#FFFFFF" />
            <Circle cx="63" cy="37" r="1.5" fill="#FFFFFF" />
            {/* Cheeks */}
            <Circle cx="31" cy="43" r="3" fill={blushColor} opacity="0.6" />
            <Circle cx="69" cy="43" r="3" fill={blushColor} opacity="0.6" />
          </G>
        )}

        {/* Antenna */}
        <Path d="M 50 25 L 50 12" stroke={isHighContrast ? '#FFFFFF' : '#1D4ED8'} strokeWidth="3" />
        <Circle cx="50" cy="10" r="5" fill={accessoryColor} />

        {/* Cute Ears / Screws */}
        <Circle cx="18" cy="45" r="4" fill={secondaryColor} />
        <Circle cx="82" cy="45" r="4" fill={secondaryColor} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
