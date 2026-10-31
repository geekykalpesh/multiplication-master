import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { Card } from '../../src/components/common/Card';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();

  const preferences = useUserStore((s) => s.preferences);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const setTheme = useUserStore((s) => s.setTheme);
  const updatePreferences = useUserStore((s) => s.updatePreferences);

  const toggleLanguage = async () => {
    const nextLang = preferences.language === 'en' ? 'hi' : 'en';
    await setLanguage(nextLang);
  };

  const toggleTheme = async () => {
    const nextTheme = preferences.theme === 'light' ? 'dark' : preferences.theme === 'dark' ? 'high_contrast' : 'light';
    await setTheme(nextTheme);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'सेटिंग्स व प्राथमिकताएं' : 'Settings & Preferences'}
      </AccessibleText>

      {/* Language & Theme Section */}
      <AccessibleText variant="caption" color={theme.textSecondary} weight="bold" style={styles.groupLabel}>
        {language === 'hi' ? 'सामान्य' : 'GENERAL'}
      </AccessibleText>
      <Card style={styles.cardGroup}>
        {/* Language switch */}
        <TouchableOpacity
          onPress={toggleLanguage}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Language is ${preferences.language === 'en' ? 'English' : 'Hindi'}. Tap to toggle.`}
          style={styles.settingRow}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="language" size={22} color={theme.primary} />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'भाषा (Language)' : 'Language'}
            </AccessibleText>
          </View>
          <View style={styles.rowRight}>
            <AccessibleText variant="body" color={theme.primary} weight="bold">
              {preferences.language === 'en' ? 'English' : 'हिन्दी'}
            </AccessibleText>
            <Ionicons name="swap-horizontal" size={18} color={theme.textSecondary} style={{ marginLeft: 6 }} />
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Theme switch */}
        <TouchableOpacity
          onPress={toggleTheme}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Theme is ${preferences.theme}. Tap to toggle.`}
          style={styles.settingRow}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="color-palette" size={22} color={theme.secondary} />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'थीम (Theme)' : 'Theme Mode'}
            </AccessibleText>
          </View>
          <View style={styles.rowRight}>
            <AccessibleText variant="body" color={theme.textSecondary} weight="semibold">
              {preferences.theme === 'high_contrast'
                ? 'High Contrast'
                : preferences.theme === 'dark'
                ? 'Dark'
                : 'Light'}
            </AccessibleText>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Mascot toggle */}
        <View style={styles.settingRow}>
          <View style={styles.rowLeft}>
            <Ionicons name="happy" size={22} color="#F59E0B" />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'नुमी मस्कॉट' : 'Numi Mascot'}
            </AccessibleText>
          </View>
          <Switch
            value={preferences.mascotEnabled}
            onValueChange={(val) => updatePreferences({ mascotEnabled: val })}
            trackColor={{ false: '#CBD5E1', true: theme.primaryLight }}
            thumbColor={preferences.mascotEnabled ? theme.primary : '#F1F5F9'}
          />
        </View>
      </Card>

      {/* Advanced Feature Sub-screens */}
      <AccessibleText variant="caption" color={theme.textSecondary} weight="bold" style={styles.groupLabel}>
        {language === 'hi' ? 'विस्तृत सेटिंग्स' : 'PREFERENCES & TOOLS'}
      </AccessibleText>
      <Card style={styles.cardGroup}>
        {/* Accessibility */}
        <TouchableOpacity
          onPress={() => router.push('/settings/accessibility')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Accessibility Settings. Screen reader, dynamic font scaling, high contrast."
          style={styles.settingRow}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="accessibility" size={22} color="#059669" />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'सुलभता सेटिंग्स' : 'Accessibility Settings'}
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Voice & Speech */}
        <TouchableOpacity
          onPress={() => router.push('/settings/voice')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Voice and Speech Settings. Adjust speech speed, pitch, and tutor volume."
          style={styles.settingRow}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="mic-circle" size={22} color="#DC2626" />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'वाक् व ऑडियो सेटिंग्स' : 'Voice & Audio Settings'}
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Offline Speech Models */}
        <TouchableOpacity
          onPress={() => router.push('/settings/speech-models')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Offline Speech Model Manager."
          style={styles.settingRow}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="cloud-download" size={22} color="#0284C7" />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'ऑफ़लाइन वाक् मॉडल' : 'Offline Speech Models'}
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Backup & Restore */}
        <TouchableOpacity
          onPress={() => router.push('/settings/backup')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Local Backup and Restore."
          style={styles.settingRow}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="save" size={22} color="#D97706" />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'बैकअप व पुनर्स्थापना' : 'Local Backup & Restore'}
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* About App */}
        <TouchableOpacity
          onPress={() => router.push('/settings/about')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="About Multiplication Master and Privacy Guarantee."
          style={styles.settingRow}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="information-circle" size={22} color="#64748B" />
            <AccessibleText variant="body" weight="medium" style={styles.rowLabel}>
              {language === 'hi' ? 'एप्लिकेशन के बारे में' : 'About Application'}
            </AccessibleText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 20,
  },
  groupLabel: {
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  cardGroup: {
    padding: 0,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    marginLeft: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 50,
  },
});
