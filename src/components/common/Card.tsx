import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  highlighted?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  highlighted = false,
}) => {
  const { theme, isHighContrast } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: isHighContrast || highlighted ? 2 : 1,
    borderColor: highlighted
      ? theme.primary
      : isHighContrast
      ? theme.border
      : theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isHighContrast ? 0 : 0.05,
    shadowRadius: 8,
    elevation: isHighContrast ? 0 : 2,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        activeOpacity={0.8}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      style={[cardStyle, style]}
    >
      {children}
    </View>
  );
};
