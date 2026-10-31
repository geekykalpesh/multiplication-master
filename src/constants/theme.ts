export interface ColorTheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  accent: string;
  micActive: string;
  micInactive: string;
  gold: string;
  focusIndicator: string;
}

export const lightTheme: ColorTheme = {
  primary: '#2563EB', // Blue 600
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  secondary: '#7C3AED', // Purple 600
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9', // Slate 100
  card: '#FFFFFF',
  text: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400
  border: '#E2E8F0', // Slate 200
  success: '#16A34A', // Green 600
  successLight: '#DCFCE7',
  warning: '#D97706', // Amber 600
  warningLight: '#FEF3C7',
  error: '#DC2626', // Red 600
  errorLight: '#FEE2E2',
  info: '#0284C7', // Sky 600
  infoLight: '#E0F2FE',
  accent: '#F59E0B',
  micActive: '#EF4444',
  micInactive: '#64748B',
  gold: '#F59E0B',
  focusIndicator: '#2563EB',
};

export const darkTheme: ColorTheme = {
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryLight: '#1E3A8A',
  secondary: '#8B5CF6',
  background: '#0F172A', // Slate 900
  surface: '#1E293B', // Slate 800
  surfaceSubtle: '#334155', // Slate 700
  card: '#1E293B',
  text: '#F8FAFC', // Slate 50
  textSecondary: '#CBD5E1', // Slate 300
  textMuted: '#64748B', // Slate 500
  border: '#334155', // Slate 700
  success: '#22C55E',
  successLight: '#064E3B',
  warning: '#F59E0B',
  warningLight: '#78350F',
  error: '#EF4444',
  errorLight: '#7F1D1D',
  info: '#38BDF8',
  infoLight: '#0C4A6E',
  accent: '#FBBF24',
  micActive: '#F87171',
  micInactive: '#94A3B8',
  gold: '#FBBF24',
  focusIndicator: '#60A5FA',
};

export const highContrastTheme: ColorTheme = {
  primary: '#0055FF',
  primaryDark: '#003399',
  primaryLight: '#CCE0FF',
  secondary: '#FFDD00',
  background: '#000000',
  surface: '#000000',
  surfaceSubtle: '#1A1A1A',
  card: '#111111',
  text: '#FFFFFF',
  textSecondary: '#FFFF00', // Yellow on Black WCAG AAA
  textMuted: '#E0E0E0',
  border: '#FFFFFF', // High-contrast solid border
  success: '#00FF66',
  successLight: '#003311',
  warning: '#FFFF00',
  warningLight: '#333300',
  error: '#FF3333',
  errorLight: '#440000',
  info: '#00FFFF',
  infoLight: '#003344',
  accent: '#FFFF00',
  micActive: '#FF0000',
  micInactive: '#FFFFFF',
  gold: '#FFD700',
  focusIndicator: '#FFFF00',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 36,
    huge: 48,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 30,
    xxl: 36,
    display: 44,
    huge: 56,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
