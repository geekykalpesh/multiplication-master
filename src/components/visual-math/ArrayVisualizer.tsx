import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AccessibleText } from '../common/AccessibleText';
import { AccessibleButton } from '../common/AccessibleButton';

export interface ArrayVisualizerProps {
  rows: number;
  cols: number;
  onCellCount?: (count: number) => void;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  rows: initialRows,
  cols: initialCols,
  onCellCount,
}) => {
  const { theme, isHighContrast } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [highlightedCount, setHighlightedCount] = useState<number | null>(null);

  const activeRows = isFlipped ? initialCols : initialRows;
  const activeCols = isFlipped ? initialRows : initialCols;
  const total = activeRows * activeCols;

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    setHighlightedCount(null);
  };

  return (
    <View
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`Array of ${activeRows} rows by ${activeCols} columns, total ${total} items.`}
      style={[
        styles.container,
        {
          backgroundColor: theme.surfaceSubtle,
          borderColor: isHighContrast ? theme.border : theme.border,
        },
      ]}
    >
      <View style={styles.header}>
        <AccessibleText variant="subheading" weight="bold">
          {activeRows} × {activeCols} = {total}
        </AccessibleText>
        <AccessibleButton
          title={isFlipped ? 'Swap (Original)' : 'Swap (Commutative)'}
          variant="outline"
          size="sm"
          onPress={toggleFlip}
          accessibilityHint="Demonstrates that factor order does not change the product"
        />
      </View>

      <AccessibleText variant="caption" color={theme.textSecondary} style={{ marginBottom: 12 }}>
        {activeRows} rows of {activeCols} dots each:
      </AccessibleText>

      <View style={styles.grid}>
        {Array.from({ length: activeRows }).map((_, rIdx) => (
          <View key={`row_${rIdx}`} style={styles.row}>
            {Array.from({ length: activeCols }).map((_, cIdx) => {
              const cellIndex = rIdx * activeCols + cIdx + 1;
              const isSelected = highlightedCount !== null && cellIndex <= highlightedCount;

              return (
                <TouchableOpacity
                  key={`cell_${rIdx}_${cIdx}`}
                  onPress={() => {
                    setHighlightedCount(cellIndex);
                    onCellCount?.(cellIndex);
                  }}
                  accessible={true}
                  accessibilityLabel={`Item ${cellIndex} of ${total}`}
                  activeOpacity={0.7}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isSelected
                        ? theme.primary
                        : isHighContrast
                        ? '#333333'
                        : theme.primaryLight,
                      borderColor: isHighContrast ? theme.border : theme.primary,
                      borderWidth: isHighContrast ? 2 : 1,
                    },
                  ]}
                >
                  <AccessibleText
                    variant="caption"
                    weight="bold"
                    color={isSelected ? '#FFFFFF' : theme.primaryDark}
                    style={{ fontSize: 10 }}
                  >
                    {cellIndex}
                  </AccessibleText>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <AccessibleText variant="caption" color={theme.textSecondary} style={styles.caption}>
        Tip: Tap any circle to count items up to that position.
      </AccessibleText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    marginTop: 12,
    textAlign: 'center',
  },
});
