import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';
import { ttsService } from '../../src/services/speech/ttsService';
import { speechRecognizerService } from '../../src/services/speech/speechRecognizer';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function VoiceSettingsScreen() {
  const { theme, language } = useTheme();
  const preferences = useUserStore((s) => s.preferences);
  const updatePreferences = useUserStore((s) => s.updatePreferences);

  const [rate, setRate] = useState<number>(preferences.speechRate || 1.0);
  const [pitch, setPitch] = useState<number>(preferences.speechPitch || 1.0);
  const [isTesting, setIsTesting] = useState(false);
  const [isListeningTest, setIsListeningTest] = useState(false);
  const [micTestResult, setMicTestResult] = useState<string>('');

  const handleRateChange = async (newRate: number) => {
    setRate(newRate);
    await updatePreferences({ speechRate: newRate });
  };

  const handlePitchChange = async (newPitch: number) => {
    setPitch(newPitch);
    await updatePreferences({ speechPitch: newPitch });
  };

  const testTTS = async () => {
    setIsTesting(true);
    await ttsService.unlockAudio();
    ttsService.playTone(440, 100);

    const sample =
      preferences.language === 'hi'
        ? 'सत्रह गुणा आठ बराबर एक सौ छत्तीस।'
        : 'Seventeen times eight equals one hundred thirty-six.';

    await ttsService.speak(sample, {
      language: preferences.language,
      rate,
      pitch,
      onDone: () => setIsTesting(false),
      onStopped: () => setIsTesting(false),
      onError: (err) => {
        setIsTesting(false);
        console.warn('TTS test error:', err);
      },
    });
  };

  const testMic = async () => {
    setMicTestResult(language === 'hi' ? 'सुन रहा हूँ... बोलिए (उदा: "84" या "136")' : 'Listening... Speak a number (e.g., "84" or "136")');
    setIsListeningTest(true);

    await speechRecognizerService.startListening(
      preferences.language,
      {
        onPartialResult: (transcript) => {
          setMicTestResult(`Heard: "${transcript}"`);
        },
        onFinalResult: (result) => {
          setIsListeningTest(false);
          if (result.number !== null) {
            setMicTestResult(`✓ Recognized number: ${result.number} (from "${result.rawInput}")`);
          } else {
            setMicTestResult(
              result.rawInput
                ? `Heard "${result.rawInput}", but could not parse a valid number.`
                : 'No speech was detected.'
            );
          }
        },
        onError: (err) => {
          setIsListeningTest(false);
          setMicTestResult(`Error: ${err}`);
        },
      },
      8000
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'वाक् व ऑडियो सेटिंग्स' : 'Voice & Audio Settings'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'ट्यूटर की आवाज की गति और पिच को अपने सुनने के आराम के अनुसार समायोजित करें।'
          : 'Fine-tune the speech synthesis rate and pitch for optimal clarity.'}
      </AccessibleText>

      {/* Speech Rate Card */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          {language === 'hi' ? 'आवाज की गति (Speech Rate)' : 'Speech Rate'}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginBottom: 12 }}>
          {rate.toFixed(1)}x
        </AccessibleText>

        <View style={styles.btnRow}>
          {[0.7, 0.85, 1.0, 1.15, 1.3].map((r) => (
            <AccessibleButton
              key={`rate_${r}`}
              title={`${r}x`}
              variant={rate === r ? 'primary' : 'outline'}
              size="sm"
              onPress={() => handleRateChange(r)}
            />
          ))}
        </View>
      </Card>

      {/* Speech Pitch Card */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          {language === 'hi' ? 'आवाज की पिच (Speech Pitch)' : 'Voice Pitch'}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginBottom: 12 }}>
          {pitch.toFixed(1)}x
        </AccessibleText>

        <View style={styles.btnRow}>
          {[0.8, 1.0, 1.2].map((p) => (
            <AccessibleButton
              key={`pitch_${p}`}
              title={`${p}x`}
              variant={pitch === p ? 'primary' : 'outline'}
              size="sm"
              onPress={() => handlePitchChange(p)}
            />
          ))}
        </View>
      </Card>

      {/* Test Speaker Audio Output */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          🔊 {language === 'hi' ? 'ऑडियो आउटपुट परीक्षण' : 'Test Audio Voice Output'}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginVertical: 6 }}>
          {language === 'hi'
            ? 'नीचे दिए गए बटन पर टैप करके सुनिश्चित करें कि आपके डिवाइस का स्पीकर आवाज निकाल रहा है।'
            : 'Tap below to test that speech synthesis is working properly through your speakers.'}
        </AccessibleText>
        <AccessibleButton
          title={isTesting ? (language === 'hi' ? 'बोल रहा है...' : 'Speaking Sample...') : (language === 'hi' ? 'नमूना आवाज सुनें' : 'Play Test Speech Sample')}
          size="md"
          variant="primary"
          loading={isTesting}
          onPress={testTTS}
          style={{ marginTop: 8 }}
        />
      </Card>

      {/* Test Microphone Voice Recognition */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          🎙️ {language === 'hi' ? 'माइक्रोफ़ोन वाक् पहचान परीक्षण' : 'Test Microphone Speech Recognition'}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginVertical: 6 }}>
          {language === 'hi'
            ? 'माइक्रोफ़ोन का परीक्षण करने के लिए टैप करें और कोई भी संख्या बोलें।'
            : 'Tap below, speak a number (e.g., "136" or "eighty-four"), and see the live result.'}
        </AccessibleText>

        {micTestResult ? (
          <Card style={[styles.testResultCard, { backgroundColor: theme.surfaceSubtle }]}>
            <AccessibleText variant="caption" weight="semibold" color={theme.primary}>
              {micTestResult}
            </AccessibleText>
          </Card>
        ) : null}

        <AccessibleButton
          title={isListeningTest ? (language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...') : (language === 'hi' ? 'माइक्रोफ़ोन टेस्ट करें' : 'Test Microphone Input')}
          size="md"
          variant={isListeningTest ? 'danger' : 'secondary'}
          loading={isListeningTest}
          onPress={testMic}
          style={{ marginTop: 8 }}
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
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  testResultCard: {
    padding: 12,
    marginVertical: 8,
  },
});
