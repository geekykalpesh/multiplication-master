import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { speechModelManager } from '../../src/services/speech/speechModelManager';
import { OFFLINE_SPEECH_MODELS } from '../../src/constants/speechModels';

export default function OnboardingSpeechSetupScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();

  const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [installedModels, setInstalledModels] = useState<Set<string>>(new Set());

  const models = Object.values(OFFLINE_SPEECH_MODELS);

  const handleDownload = async (modelId: string) => {
    setDownloadingModelId(modelId);
    setDownloadProgress(0);

    const success = await speechModelManager.downloadModel(modelId, (state) => {
      setDownloadProgress(state.progressPercent / 100);
      if (state.status === 'installed') {
        setInstalledModels((prev) => new Set([...prev, modelId]));
      }
    });

    setDownloadingModelId(null);
    if (success) {
      Alert.alert(
        language === 'hi' ? 'सफल स्थापना' : 'Model Installed',
        language === 'hi'
          ? 'ऑफ़लाइन वाक् पहचान मॉडल सफलतापूर्वक स्थापित हो गया है।'
          : 'Offline speech model successfully verified and ready for airplane-mode practice.'
      );
    }
  };

  const handleFinish = () => {
    // Finish onboarding -> go to main dashboard tabs!
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'ऑफ़लाइन वाक् मॉडल (वैकल्पिक)' : 'Offline Speech Setup (Optional)'}
      </AccessibleText>

      <AccessibleText variant="body" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'बिना इंटरनेट के आवाज से अभ्यास करने के लिए आप ऑफ़लाइन मॉडल डाउनलोड कर सकते हैं। आप इसे अभी छोड़ भी सकते हैं और बाद में सेटिंग्स से डाउनलोड कर सकते हैं।'
          : 'To practice using your voice without internet, you may install an offline speech recognition model. You can also skip this and install anytime in Settings.'}
      </AccessibleText>

      <View style={styles.list}>
        {models.map((m) => {
          const isInstalled = installedModels.has(m.id);
          const isDownloading = downloadingModelId === m.id;

          return (
            <Card key={m.id} style={styles.modelCard}>
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <AccessibleText variant="subheading" weight="bold">
                    {m.name}
                  </AccessibleText>
                  <AccessibleText variant="caption" color={theme.textSecondary}>
                    {m.language.toUpperCase()} • {m.formattedSize} storage
                  </AccessibleText>
                </View>
                {isInstalled && (
                  <AccessibleText variant="caption" weight="bold" color={theme.success}>
                    ✓ Installed
                  </AccessibleText>
                )}
              </View>

              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginVertical: 8 }}>
                {m.description}
              </AccessibleText>

              {isDownloading && (
                <View style={{ marginVertical: 8 }}>
                  <ProgressBar progress={downloadProgress} />
                  <AccessibleText variant="caption" style={{ marginTop: 4, textAlign: 'right' }}>
                    {Math.round(downloadProgress * 100)}%
                  </AccessibleText>
                </View>
              )}

              <AccessibleButton
                title={
                  isInstalled
                    ? language === 'hi'
                      ? 'स्थापित (सत्यापित)'
                      : 'Installed (Verified)'
                    : isDownloading
                    ? language === 'hi'
                      ? 'डाउनलोड हो रहा है...'
                      : 'Downloading...'
                    : language === 'hi'
                    ? `डाउनलोड करें (${m.formattedSize})`
                    : `Install Model (${m.formattedSize})`
                }
                variant={isInstalled ? 'outline' : 'primary'}
                disabled={isInstalled || isDownloading}
                loading={isDownloading}
                onPress={() => handleDownload(m.id)}
                style={{ marginTop: 8 }}
              />
            </Card>
          );
        })}
      </View>

      <View style={styles.actions}>
        <AccessibleButton
          title={language === 'hi' ? 'डैशबोर्ड में प्रवेश करें' : 'Finish & Enter Dashboard'}
          size="lg"
          variant="primary"
          onPress={handleFinish}
          style={{ width: '100%' }}
        />

        <AccessibleButton
          title={language === 'hi' ? 'अभी छोड़ें (दृश्य मोड में सीखें)' : 'Skip for now (Use Visual Mode)'}
          variant="ghost"
          onPress={handleFinish}
          style={{ width: '100%', marginTop: 8 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  list: {
    gap: 16,
    marginBottom: 24,
  },
  modelCard: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    gap: 8,
    marginTop: 16,
  },
});
