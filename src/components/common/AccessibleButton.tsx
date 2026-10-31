import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AccessibleText } from './AccessibleText';

export interface AccessibleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
  icon,
  style,
}) => {
  const { theme, isHighContrast } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.surfaceSubtle;
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'danger':
        return theme.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textMuted;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
        return isHighContrast ? theme.textSecondary : theme.primary;
      case 'ghost':
        return isHighContrast ? theme.text : theme.textSecondary;
      default:
        return '#FFFFFF';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 28 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      activeOpacity={0.75}
      style={[
        styles.buttonBase,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor:
            variant === 'outline' || isHighContrast
              ? theme.border
              : 'transparent',
          borderWidth: variant === 'outline' || isHighContrast ? 2 : 0,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <AccessibleText
            variant={size === 'lg' ? 'subheading' : 'body'}
            weight="semibold"
            color={getTextColor()}
            style={{ textAlign: 'center' }}
          >
            {title}
          </AccessibleText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: 48, // Guaranteed WCAG touch target
    minWidth: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
