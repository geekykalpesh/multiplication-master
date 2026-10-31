import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { Card } from '../../src/components/common/Card';
import { Mascot } from '../../src/components/common/Mascot';

export default function AboutScreen() {
  const { theme, language } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Mascot mood="happy" size={90} />
        <AccessibleText variant="heading" weight="black" isHeading style={{ marginTop: 12 }}>
          Multiplication Master
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.primary} weight="bold">
          Version 1.0.0 (Offline-First Edition)
        </AccessibleText>
      </View>

      {/* Privacy Guarantee Card */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold" color={theme.success}>
          🔒 100% Offline & Absolute Privacy
        </AccessibleText>
        <AccessibleText variant="body" color={theme.textSecondary} style={{ marginTop: 6, lineHeight: 22 }}>
          {language === 'hi'
            ? 'Multiplication Master पूरी तरह से आपके डिवाइस पर स्थानीय रूप से चलता है।\n\n• कोई रिमोट सर्वर या क्लाउड डेटाबेस नहीं।\n• कोई लॉगिन या खाता आवश्यकता नहीं।\n• कोई आवाज रिकॉर्डिंग या व्यक्तिगत डेटा अपलोड नहीं होता।\n• सभी अंकगणितीय गणनाएं 100% सटीक और स्थानीय हैं।'
            : 'Multiplication Master operates entirely locally on your device.\n\n• Zero remote backends or hosted cloud databases.\n• No login, registration, or accounts required.\n• Zero audio recordings or learning telemetry uploaded.\n• All arithmetic evaluations are 100% deterministic.'}
        </AccessibleText>
      </Card>

      {/* Learning Science Philosophy */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          🧠 Learning Methodology
        </AccessibleText>
        <AccessibleText variant="body" color={theme.textSecondary} style={{ marginTop: 6, lineHeight: 22 }}>
          {language === 'hi'
            ? 'हमारा उद्देश्य केवल रटना नहीं, बल्कि स्वचालित स्मरण शक्ति (Automatic Recall) विकसित करना है। सुपरमेमो SM-2 अंतराल, प्रतिक्रिया विलंबता संकेत और कमज़ोर तथ्य सुधार का उपयोग करके हम प्रत्येक शिक्षार्थी की गति के अनुसार अनुकूलन करते हैं।'
            : 'Designed based on cognitive science principles: spaced repetition (SM-2), retrieval practice, latency fluency benchmarks, and targeted weak-fact remediation.'}
        </AccessibleText>
      </Card>

      {/* Accessibility Mission */}
      <Card style={styles.card}>
        <AccessibleText variant="subheading" weight="bold">
          ♿ Inclusive & Accessible Design
        </AccessibleText>
        <AccessibleText variant="body" color={theme.textSecondary} style={{ marginTop: 6, lineHeight: 22 }}>
          {language === 'hi'
            ? 'बच्चों, वयस्कों और दृष्टि बाधित उपयोगकर्ताओं के लिए समान रूप से उपयोगी। टॉकबैक व वॉयसओवर के साथ बिना स्क्रीन देखे पूर्ण शिक्षण संभव है।'
            : 'Designed for children, adult self-learners, and visually impaired individuals. Fully navigable with TalkBack, VoiceOver, and Hands-Free Voice Practice.'}
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 18,
    marginBottom: 16,
  },
});
