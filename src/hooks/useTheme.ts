import { useUserStore } from '../stores/userStore';
import { lightTheme, darkTheme, highContrastTheme, ColorTheme } from '../constants/theme';

export function useTheme(): {
  theme: ColorTheme;
  themeMode: 'light' | 'dark' | 'high_contrast';
  fontScale: number;
  reducedMotion: boolean;
  isHighContrast: boolean;
  language: 'en' | 'hi';
} {
  const preferences = useUserStore((s) => s.preferences);

  let theme: ColorTheme = lightTheme;
  if (preferences.theme === 'high_contrast' || preferences.highContrast) {
    theme = highContrastTheme;
  } else if (preferences.theme === 'dark') {
    theme = darkTheme;
  }

  return {
    theme,
    themeMode: preferences.theme,
    fontScale: preferences.fontScale || 1.0,
    reducedMotion: preferences.reducedMotion || false,
    isHighContrast: preferences.highContrast || preferences.theme === 'high_contrast',
    language: preferences.language || 'en',
  };
}
