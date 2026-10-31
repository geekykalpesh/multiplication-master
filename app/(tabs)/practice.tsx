import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useLearningStore } from '../../src/stores/learningStore';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';

export default function PracticeHubScreen() {
  const router = useRouter();
  const { theme, language } = useTheme();
  const dueCount = useLearningStore((s) => s.dueReviewsCount);
  const weakCount = useLearningStore((s) => s.weakFacts.length);

  const [selectedTables, setSelectedTables] = useState<number[]>([7]);

  const toggleTable = (num: number) => {
    if (selectedTables.includes(num)) {
      if (selectedTables.length > 1) {
        setSelectedTables(selectedTables.filter((n) => n !== num));
      }
    } else {
      setSelectedTables([...selectedTables, num].sort((a, b) => a - b));
    }
  };

  const selectAll = () => setSelectedTables(Array.from({ length: 20 }, (_, i) => i + 1));
  const select1to10 = () => setSelectedTables([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <AccessibleText variant="heading" weight="bold" isHeading style={styles.title}>
        {language === 'hi' ? 'अभ्यास केंद्र' : 'Practice Hub'}
      </AccessibleText>
      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.subtitle}>
        {language === 'hi'
          ? 'अपनी पसंद का मोड या विशेष पहाड़े चुनकर अभ्यास शुरू करें।'
          : 'Choose a dedicated learning mode or customize your target tables.'}
      </AccessibleText>

      {/* Primary Practice Modes */}
      <View style={styles.modesContainer}>
        {/* Hands-Free Voice */}
        <Card
          onPress={() => router.push('/practice/voice')}
          accessibilityLabel="Hands-free voice practice. The app speaks questions and you answer aloud."
          style={styles.modeCard}
        >
          <View style={styles.modeHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="mic" size={26} color="#DC2626" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'हैंड्स-फ्री वॉयस अभ्यास' : 'Hands-Free Voice'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'स्क्रीन देखे बिना सीधे बोलकर उत्तर दें।'
                  : 'Practice without touching the phone. Perfect while walking or relaxing.'}
              </AccessibleText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </Card>

        {/* Audio Focus Mode */}
        <Card
          onPress={() => router.push('/practice/audio-focus')}
          accessibilityLabel="Audio Focus mode. Screenless audio companion."
          style={styles.modeCard}
        >
          <View style={styles.modeHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="volume-high" size={26} color="#7C3AED" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'ऑडियो केंद्रित मोड' : 'Audio Focus Mode'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'दृष्टि बाधित और श्रवण आधारित शिक्षार्थियों के लिए।'
                  : 'Screen-reader friendly, verbal explanations, repeat & hint buttons.'}
              </AccessibleText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </Card>

        {/* Visual Practice Session */}
        <Card
          onPress={() => router.push('/practice/session')}
          accessibilityLabel="Interactive Visual Practice Session."
          style={styles.modeCard}
        >
          <View style={styles.modeHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="play" size={26} color="#2563EB" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <AccessibleText variant="subheading" weight="bold">
                {language === 'hi' ? 'सक्रिय विजुअल अभ्यास' : 'Visual Practice'}
              </AccessibleText>
              <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginTop: 2 }}>
                {language === 'hi'
                  ? 'बहुविकल्पीय प्रश्न, लुप्त संख्याएँ और कीपैड।'
                  : 'Multiple choice, missing numbers, reverse equations, and keypad.'}
              </AccessibleText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </View>
        </Card>
      </View>

      {/* Targeted Revision Options */}
      <View style={styles.targetedRow}>
        {dueCount > 0 && (
          <Card
            onPress={() => router.push('/progress/spaced-repetition')}
            style={styles.halfCard}
          >
            <AccessibleText variant="caption" color={theme.primary} weight="bold">
              {dueCount} DUE
            </AccessibleText>
            <AccessibleText variant="body" weight="bold" style={{ marginTop: 4 }}>
              {language === 'hi' ? 'आवर्ती समीक्षा' : 'Spaced Review'}
            </AccessibleText>
          </Card>
        )}

        {weakCount > 0 && (
          <Card
            onPress={() => router.push('/progress/weak-facts')}
            style={styles.halfCard}
          >
            <AccessibleText variant="caption" color={theme.warning} weight="bold">
              {weakCount} WEAK
            </AccessibleText>
            <AccessibleText variant="body" weight="bold" style={{ marginTop: 4 }}>
              {language === 'hi' ? 'कमजोर तथ्य' : 'Targeted Revision'}
            </AccessibleText>
          </Card>
        )}
      </View>

      {/* Table Custom Selector */}
      <AccessibleText variant="subheading" weight="bold" style={styles.tableSelectTitle}>
        {language === 'hi' ? 'पहाड़ा चुनें (अभ्यास हेतु)' : 'Select Tables to Practice'}
      </AccessibleText>

      <View style={styles.quickSelectors}>
        <AccessibleButton title="1–10" size="sm" variant="outline" onPress={select1to10} />
        <AccessibleButton title="All 1–20" size="sm" variant="outline" onPress={selectAll} />
      </View>

      <View style={styles.tableChipsGrid}>
        {Array.from({ length: 20 }, (_, idx) => {
          const num = idx + 1;
          const isSelected = selectedTables.includes(num);

          return (
            <TouchableOpacity
              key={`tbl_chip_${num}`}
              onPress={() => toggleTable(num)}
              accessible={true}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Table of ${num}`}
              style={[
                styles.tableChip,
                {
                  backgroundColor: isSelected ? theme.primary : theme.surface,
                  borderColor: isSelected ? theme.primary : theme.border,
                },
              ]}
            >
              <AccessibleText
                variant="body"
                weight="bold"
                color={isSelected ? '#FFFFFF' : theme.text}
              >
                {num}
              </AccessibleText>
            </TouchableOpacity>
          );
        })}
      </View>

      <AccessibleButton
        title={
          language === 'hi'
            ? `चयनित पहाड़ों का अभ्यास शुरू करें (${selectedTables.length})`
            : `Start Practice with Selected (${selectedTables.length})`
        }
        size="lg"
        onPress={() => router.push('/practice/session')}
        style={{ marginTop: 24 }}
      />
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
  modesContainer: {
    gap: 14,
    marginBottom: 20,
  },
  modeCard: {
    padding: 16,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetedRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfCard: {
    flex: 1,
    padding: 14,
  },
  tableSelectTitle: {
    marginBottom: 8,
  },
  quickSelectors: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tableChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tableChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
