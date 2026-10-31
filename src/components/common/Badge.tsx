import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AccessibleText } from './AccessibleText';

export interface BadgeProps {
  label: string;
  icon?: string;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'gold';
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  variant = 'primary',
  style,
}) => {
  const { theme, isHighContrast } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: theme.successLight, text: theme.success };
      case 'warning':
        return { bg: theme.warningLight, text: theme.warning };
      case 'info':
        return { bg: theme.infoLight, text: theme.info };
      case 'gold':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'primary':
      default:
        return { bg: theme.primaryLight, text: theme.primaryDark };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isHighContrast ? 'transparent' : colors.bg,
          borderColor: isHighContrast ? theme.border : 'transparent',
          borderWidth: isHighContrast ? 1 : 0,
        },
        style,
      ]}
    >
      {Boolean(icon) && (
        <AccessibleText variant="caption" style={{ marginRight: 4 }}>
          {icon}
        </AccessibleText>
      )}
      <AccessibleText
        variant="caption"
        weight="semibold"
        color={isHighContrast ? theme.text : colors.text}
      >
        {label}
      </AccessibleText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});
