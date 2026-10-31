import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { OFFLINE_SPEECH_MODELS } from '../../src/constants/speechModels';
import { speechModelManager } from '../../src/services/speech/speechModelManager';
import { InstalledSpeechModel } from '../../src/types/database';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { ProgressBar } from '../../src/components/common/ProgressBar';

export default function SpeechModelsManagerScreen() {
  const { theme, language } = useTheme();
  const [installedModels, setInstalledModels] = useState<InstalledSpeechModel[]>([]);
  const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const models = Object.values(OFFLINE_SPEECH_MODELS);

  const loadModels = async () => {
    const list = await speechModelManager.getInstalledModelList();
    setInstalledModels(list);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleDownload = async (modelId: string) => {
    setDownloadingModelId(modelId);
    setDownloadProgress(0);

    const success = await speechModelManager.downloadModel(modelId, (state) => {
      setDownloadProgress(state.progressPercent / 100);
      if (state.status === 'installed') {
        loadModels();
      }
    });

    setDownloadingModelId(null);
    if (success) {
      Alert.alert(
        language === 'hi' ? 'सफल स्थापना' : 'Model Verified & Installed',
        language === 'hi'
          ? 'मॉडल सत्यापित हो गया है और ऑफ़लाइन उपयोग के लिए तैयार है।'
          : 'Offline speech model successfully verified and ready for airplane-mode practice.'
      );
    }
  };

  const handleDelete = (modelId: string) => {
    Alert.alert(
      language === 'hi' ? 'मॉडल हटाएं' : 'Remove Offline Model',
      language === 'hi'
        ? 'क्या आप वास्तव में इस वाक् मॉडल को हटाकर संग्रहण स्थान खाली करना चाहते हैं?'
        : 'Are you sure you want to remove this offline model and free storage?',
      [
        { text: language === 'hi' ? 'रद्द करें' : 'Cancel', style: 'cancel' },
        {
          text: language === 'hi' ? 'हटाएं' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            await speechModelManager.deleteModel(modelId);
            await loadModels();
          },
        },
      ]
    );
  };

  const installedMap = new Map(installedModels.map((m) => [m.modelId, m]));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'ऑफ़लाइन वाक् मॉडल प्रबंधक' : 'Offline Speech Models'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'पूरी तरह ऑफ़लाइन वाक् पहचान के लिए आधिकारिक ओपन-सोर्स वोस्क (Vosk) मॉडल। एक बार डाउनलोड करने के बाद बिना इंटरनेट के चलेगा।'
          : 'High-efficiency Vosk offline speech recognition models. Operates entirely locally without internet.'}
      </AccessibleText>

      <View style={styles.modelsList}>
        {models.map((m) => {
          const installed = installedMap.get(m.id);
          const isDownloading = downloadingModelId === m.id;

          return (
            <Card key={m.id} style={styles.card}>
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <AccessibleText variant="subheading" weight="bold">
                    {m.name}
                  </AccessibleText>
                  <AccessibleText variant="caption" color={theme.textSecondary}>
                    {m.language.toUpperCase()} • {m.formattedSize} storage
                  </AccessibleText>
                </View>

                {installed ? (
                  <AccessibleText variant="caption" weight="bold" color={theme.success}>
                    ✓ Verified & Installed
                  </AccessibleText>
                ) : (
                  <AccessibleText variant="caption" color={theme.textMuted}>
                    Not Installed
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

              <View style={styles.actionsRow}>
                {installed ? (
                  <AccessibleButton
                    title={language === 'hi' ? 'मॉडल हटाएं' : 'Remove Model'}
                    variant="danger"
                    size="sm"
                    onPress={() => handleDelete(m.id)}
                  />
                ) : (
                  <AccessibleButton
                    title={
                      isDownloading
                        ? language === 'hi'
                          ? 'डाउनलोड हो रहा है...'
                          : 'Downloading...'
                        : language === 'hi'
                        ? `डाउनलोड करें (${m.formattedSize})`
                        : `Download (${m.formattedSize})`
                    }
                    variant="primary"
                    size="sm"
                    loading={isDownloading}
                    disabled={isDownloading}
                    onPress={() => handleDownload(m.id)}
                  />
                )}
              </View>
            </Card>
          );
        })}
      </View>
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
  modelsList: {
    gap: 16,
  },
  card: {
    padding: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
