import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { ttsService } from '../../src/services/speech/ttsService';
import { AccessibleText } from '../../src/components/common/AccessibleText';
import { AccessibleButton } from '../../src/components/common/AccessibleButton';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';

export default function TableLearningScreen() {
  const { num } = useLocalSearchParams<{ num: string }>();
  const router = useRouter();
  const { theme, language } = useTheme();

  const tableNum = parseInt(num || '7', 10);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Generate multiples up to 20 as requested in Section 5
  const tableRows = Array.from({ length: 20 }, (_, idx) => {
    const factorB = idx + 1;
    const product = tableNum * factorB;
    return {
      factorA: tableNum,
      factorB,
      product,
      speechEn: `${tableNum} times ${factorB} equals ${product}`,
      speechHi: `${tableNum} गुणा ${factorB} बराबर ${product}`,
    };
  });

  const speakLine = async (index: number) => {
    const row = tableRows[index];
    setPlayingIndex(index);
    const text = language === 'hi' ? row.speechHi : row.speechEn;

    await ttsService.unlockAudio();
    await ttsService.speak(text, {
      language,
      onDone: () => setPlayingIndex(null),
      onStopped: () => setPlayingIndex(null),
    });
  };

  const playEntireTable = async () => {
    for (let i = 0; i < 10; i++) {
      await speakLine(i);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AccessibleText variant="heading" weight="black" isHeading>
            {language === 'hi' ? `${tableNum} का पहाड़ा` : `Table of ${tableNum}`}
          </AccessibleText>
          <AccessibleText variant="caption" color={theme.textSecondary}>
            {language === 'hi'
              ? `प्रत्येक पद में ${tableNum} जोड़ा जाता है`
              : `Each consecutive step adds ${tableNum}`}
          </AccessibleText>
        </View>

        <AccessibleButton
          title={language === 'hi' ? 'पूरा सुनें' : 'Listen All'}
          size="sm"
          variant="primary"
          icon={<Ionicons name="volume-high" size={16} color="#FFFFFF" />}
          onPress={playEntireTable}
        />
      </View>

      {/* Skip Counting Track */}
      <Card style={styles.skipCard}>
        <AccessibleText variant="caption" weight="bold" color={theme.primary} style={{ marginBottom: 6 }}>
          {language === 'hi' ? `${tableNum} के अंतराल पर गिनती (Skip Counting):` : `Skip Counting by ${tableNum}s:`}
        </AccessibleText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skipScroll}>
          {tableRows.slice(0, 10).map((r, i) => (
            <TouchableOpacity
              key={`skip_${i}`}
              onPress={() => speakLine(i)}
              style={[styles.skipChip, { backgroundColor: theme.surfaceSubtle }]}
            >
              <AccessibleText variant="body" weight="bold" color={theme.primaryDark}>
                {r.product}
              </AccessibleText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card>

      {/* Full Multiplication Table Rows */}
      <View style={styles.tableRowsList}>
        {tableRows.map((row, idx) => {
          const isPlaying = playingIndex === idx;

          return (
            <Card
              key={`row_${idx}`}
              onPress={() => speakLine(idx)}
              highlighted={isPlaying}
              accessibilityLabel={`${row.factorA} times ${row.factorB} equals ${row.product}. Tap to hear audio.`}
              style={[
                styles.tableRowCard,
                isPlaying && { backgroundColor: theme.primaryLight },
              ]}
            >
              <View style={styles.rowFormula}>
                <AccessibleText variant="subheading" weight="bold">
                  {row.factorA} × {row.factorB}
                </AccessibleText>
                <AccessibleText variant="subheading" color={theme.textSecondary}>
                  =
                </AccessibleText>
                <AccessibleText variant="heading" weight="black" color={theme.primary}>
                  {row.product}
                </AccessibleText>
              </View>

              <Ionicons
                name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
                size={22}
                color={isPlaying ? theme.primary : theme.textMuted}
              />
            </Card>
          );
        })}
      </View>

      {/* Test / Practice Button */}
      <AccessibleButton
        title={language === 'hi' ? `पहाड़ा ${tableNum} का अभ्यास करें` : `Practice Table ${tableNum} Now`}
        size="lg"
        variant="primary"
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skipCard: {
    padding: 14,
    marginBottom: 16,
  },
  skipScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  skipChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRowsList: {
    gap: 8,
  },
  tableRowCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowFormula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
