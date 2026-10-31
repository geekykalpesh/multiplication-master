import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function AccessibilitySettingsScreen() {
  const { theme, language } = useTheme();
  const preferences = useUserStore((s) => s.preferences);
  const updatePreferences = useUserStore((s) => s.updatePreferences);

  const toggleHighContrast = async (val: boolean) => {
    await updatePreferences({
      highContrast: val,
      theme: val ? 'high_contrast' : 'light',
    });
  };

  const adjustFontScale = async (scale: number) => {
    await updatePreferences({ fontScale: scale });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'सुलभता सेटिंग्स' : 'Accessibility Settings'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'Multiplication Master सभी शिक्षार्थियों, विशेषकर दृष्टि बाधित उपयोगकर्ताओं के लिए पूर्णतः सुलभ बनाया गया है।'
          : 'Multiplication Master complies with WCAG AAA accessibility guidelines.'}
      </AccessibleText>

      {/* High Contrast Mode */}
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <AccessibleText variant="subheading" weight="bold">
              {language === 'hi' ? 'उच्च कंट्रास्ट मोड (High Contrast)' : 'High Contrast Mode'}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
              {language === 'hi'
                ? 'काला और सफेद/पीला कंट्रास्ट जो पढ़ने में अधिकतम स्पष्टता प्रदान करता है।'
                : 'Pure black background with maximum contrast yellow and white elements.'}
            </AccessibleText>
          </View>
          <Switch
            value={preferences.highContrast}
            onValueChange={toggleHighContrast}
            trackColor={{ false: '#CBD5E1', true: theme.primaryLight }}
            thumbColor={preferences.highContrast ? theme.primary : '#F1F5F9'}
          />
        </View>
      </Card>

      {/* Reduced Motion */}
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <AccessibleText variant="subheading" weight="bold">
              {language === 'hi' ? 'कम गतिशीलता (Reduced Motion)' : 'Reduced Motion'}
            </AccessibleText>
            <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
              {language === 'hi'
                ? 'अनावश्यक एनिमेशन और गति प्रभाव को बंद करें।'
                : 'Disables decorative animations and screen transitions.'}
            </AccessibleText>
          </View>
          <Switch
            value={preferences.reducedMotion}
            onValueChange={(val) => updatePreferences({ reducedMotion: val })}
            trackColor={{ false: '#CBD5E1', true: theme.primaryLight }}
            thumbColor={preferences.reducedMotion ? theme.primary : '#F1F5F9'}
          />
        </View>
      </Card>

      {/* Dynamic Font Scaling */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          {language === 'hi' ? 'अक्षर का आकार (Font Scaling)' : 'Dynamic Font Scaling'}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2, marginBottom: 12 }}>
          {language === 'hi' ? `वर्तमान पैमाना: ${(preferences.fontScale || 1.0).toFixed(1)}x` : `Current text scale: ${(preferences.fontScale || 1.0).toFixed(1)}x`}
        </AccessibleText>

        <View style={styles.fontScaleButtons}>
          {[1.0, 1.15, 1.3, 1.5].map((scale) => (
            <AccessibleButton
              key={`font_${scale}`}
              title={`${scale}x`}
              variant={preferences.fontScale === scale ? 'primary' : 'outline'}
              size="sm"
              onPress={() => adjustFontScale(scale)}
            />
          ))}
        </View>
      </Card>

      {/* Screen Reader & Audio Instructions */}
      <Card style={[styles.card, { backgroundColor: theme.surfaceSubtle }]}>
        <AccessibleText variant="subheading" weight="bold">
          📱 TalkBack & VoiceOver Compatibility
        </AccessibleText>
        <AccessibleText variant="body" color={theme.textSecondary} style={{ marginTop: 6, lineHeight: 22 }}>
          {language === 'hi'
            ? 'इस ऐप के सभी बटन, इनपुट और गणितीय परिणाम स्क्रीन रीडर द्वारा स्पष्ट रूप से बोले जाते हैं। आप ऑडियो केंद्रित मोड या हैंड्स-फ्री वॉयस प्रैक्टिस का उपयोग करके बिना स्क्रीन देखे पूरी तरह सीख सकते हैं।'
            : 'All buttons, mathematical cards, and prompts feature semantic accessibility roles and assertive live region announcements. The entire curriculum is completeable through Audio Focus and Hands-Free Voice modes.'}
        </AccessibleText>
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
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 20,
  },
  card: {
    padding: 18,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontScaleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});
