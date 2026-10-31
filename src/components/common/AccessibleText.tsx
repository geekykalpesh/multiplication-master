import React from 'react';
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface AccessibleTextProps extends TextProps {
  variant?: 'caption' | 'body' | 'subheading' | 'heading' | 'display' | 'huge';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'black';
  color?: string;
  isHeading?: boolean;
  style?: StyleProp<TextStyle>;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  children,
  variant = 'body',
  weight = 'regular',
  color,
  isHeading = false,
  style,
  ...rest
}) => {
  const { theme, fontScale } = useTheme();

  const getFontSize = () => {
    switch (variant) {
      case 'caption':
        return 13 * fontScale;
      case 'body':
        return 16 * fontScale;
      case 'subheading':
        return 19 * fontScale;
      case 'heading':
        return 23 * fontScale;
      case 'display':
        return 30 * fontScale;
      case 'huge':
        return 42 * fontScale;
      default:
        return 16 * fontScale;
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      case 'black':
        return '900';
      default:
        return '400';
    }
  };

  return (
    <Text
      accessibilityRole={isHeading ? 'header' : 'text'}
      style={[
        {
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
          color: color || theme.text,
          lineHeight: getFontSize() * 1.35,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
