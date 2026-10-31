import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AccessibleText } from '../common/AccessibleText';

export interface GroupingVisualizerProps {
  groups: number;
  itemsPerGroup: number;
  itemEmoji?: string;
  groupLabel?: string;
}

export const GroupingVisualizer: React.FC<GroupingVisualizerProps> = ({
  groups,
  itemsPerGroup,
  itemEmoji = '🍎',
  groupLabel = 'Group',
}) => {
  const { theme, isHighContrast } = useTheme();
  const total = groups * itemsPerGroup;
  const additionFormula = Array(groups).fill(itemsPerGroup).join(' + ');

  return (
    <View
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`${groups} groups with ${itemsPerGroup} items each, total ${total}`}
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
          {groups} × {itemsPerGroup} = {total}
        </AccessibleText>
        <AccessibleText variant="caption" color={theme.textSecondary}>
          {additionFormula} = {total}
        </AccessibleText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {Array.from({ length: groups }).map((_, gIdx) => (
          <View
            key={`group_${gIdx}`}
            accessible={true}
            accessibilityLabel={`${groupLabel} ${gIdx + 1}: ${itemsPerGroup} items`}
            style={[
              styles.groupBox,
              {
                backgroundColor: theme.surface,
                borderColor: isHighContrast ? theme.border : theme.border,
              },
            ]}
          >
            <AccessibleText variant="caption" weight="semibold" color={theme.textSecondary} style={{ marginBottom: 6 }}>
              {groupLabel} {gIdx + 1}
            </AccessibleText>
            <View style={styles.itemsGrid}>
              {Array.from({ length: itemsPerGroup }).map((_, iIdx) => (
                <AccessibleText key={`item_${gIdx}_${iIdx}`} variant="subheading" style={{ margin: 2 }}>
                  {itemEmoji}
                </AccessibleText>
              ))}
            </View>
            <AccessibleText variant="caption" weight="bold" color={theme.primary} style={{ marginTop: 6 }}>
              {itemsPerGroup}
            </AccessibleText>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 12,
  },
  scroll: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  groupBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 90,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 80,
  },
});
