import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../../src/hooks/useTheme';
import { localBackupService } from '../../src/services/storage/backupService';
import { useLearningStore } from '../../src/stores/learningStore';
import { useUserStore } from '../../src/stores/userStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function LocalBackupScreen() {
  const { theme, language } = useTheme();
  const refreshLearningData = useLearningStore((s) => s.refreshLearningData);
  const loadUserData = useUserStore((s) => s.loadUserData);

  const [lastExportPath, setLastExportPath] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const filePath = await localBackupService.exportBackup();
      setLastExportPath(filePath);
      Alert.alert(
        language === 'hi' ? 'सफल बैकअप' : 'Backup Created Successfully',
        language === 'hi'
          ? `बैकअप फ़ाइल आपके डिवाइस पर सुरक्षित है:\n${filePath}`
          : `Backup file stored locally on your device storage:\n${filePath}`
      );
    } catch (err: any) {
      Alert.alert('Export Error', err.message || 'Failed to create backup');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importJsonText.trim()) {
      Alert.alert(
        language === 'hi' ? 'खाली डेटा' : 'Empty Data',
        language === 'hi' ? 'कृपया बैकअप JSON सामग्री पेस्ट करें।' : 'Please paste valid backup JSON text.'
      );
      return;
    }

    try {
      setIsImporting(true);
      const result = await localBackupService.importBackup(importJsonText);
      await loadUserData();
      await refreshLearningData();

      Alert.alert(
        language === 'hi' ? 'पुनर्स्थापना सफल' : 'Restore Successful',
        language === 'hi'
          ? `डेटाबेस बहाल हो गया! ${result.factsRestored} तथ्य सफलतापूर्वक पुनर्स्थापित किए गए।`
          : `Database restored! ${result.factsRestored} multiplication facts restored with full validation.`
      );
      setImportJsonText('');
    } catch (err: any) {
      Alert.alert('Validation Error', err.message || 'Malformed backup data.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'स्थानीय बैकअप व पुनर्स्थापना' : 'Local Backup & Restore'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'आपकी सीखने की प्रगति 100% आपके डिवाइस पर है। आप जब चाहें अपनी प्रगति को सुरक्षित JSON फ़ाइल के रूप में निर्यात या आयात कर सकते हैं।'
          : 'Zero cloud reliance. Export your mastery, spaced schedules, and achievements to a portable JSON file.'}
      </AccessibleText>

      {/* Export Card */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          {language === 'hi' ? '1. स्थानीय बैकअप निर्यात करें' : '1. Export Progress Backup'}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginVertical: 6 }}>
          {language === 'hi'
            ? 'अपनी प्राथमिकताओं, सिद्ध तथ्यों और पदकों का एक पूर्ण स्नैपशॉट बनाएं।'
            : 'Creates a validated JSON snapshot of your learning records and preferences.'}
        </AccessibleText>

        {lastExportPath && (
          <AccessibleText variant="caption" color={theme.primary} style={{ marginBottom: 8 }}>
            Last saved to: {lastExportPath}
          </AccessibleText>
        )}

        <AccessibleButton
          title={isExporting ? (language === 'hi' ? 'निर्यात हो रहा है...' : 'Exporting...') : (language === 'hi' ? 'बैकअप फ़ाइल बनाएं' : 'Create Backup File')}
          size="md"
          variant="primary"
          loading={isExporting}
          onPress={handleExport}
        />
      </Card>

      {/* Import Card */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          {language === 'hi' ? '2. बैकअप पुनर्स्थापित करें' : '2. Restore from Backup'}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginVertical: 6 }}>
          {language === 'hi'
            ? 'पिछले निर्यात किए गए बैकअप JSON को यहाँ पेस्ट करें। आयात करने से पहले स्कीमा की पूर्ण जांच की जाती है।'
            : 'Paste your previously exported JSON string. All records undergo Zod runtime schema validation.'}
        </AccessibleText>

        <TextInput
          multiline
          numberOfLines={5}
          value={importJsonText}
          onChangeText={setImportJsonText}
          placeholder='{"version": 1, "appName": "Multiplication Master", ...}'
          placeholderTextColor={theme.textMuted}
          style={[
            styles.jsonInput,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.surfaceSubtle,
            },
          ]}
        />

        <AccessibleButton
          title={isImporting ? (language === 'hi' ? 'पुनर्स्थापित हो रहा है...' : 'Restoring...') : (language === 'hi' ? 'सत्यापित करें और पुनर्स्थापित करें' : 'Validate & Restore Backup')}
          size="md"
          variant="secondary"
          loading={isImporting}
          onPress={handleImport}
          style={{ marginTop: 10 }}
        />
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
  jsonInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
    fontSize: 13,
  },
});
