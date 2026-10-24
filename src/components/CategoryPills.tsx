import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UNIT_CATEGORIES, UnitCategoryId } from '../data/units';
import { Colors } from '../constants/theme';
import { useConversion } from '../context/ConversionContext';

type IoniconsName = keyof typeof Ionicons.glyphMap;

const CATEGORY_ICON_MAP: Record<UnitCategoryId, IoniconsName> = {
  temperature: 'thermometer-outline',
  time: 'time-outline',
  storage: 'hardware-chip-outline',
  length: 'resize-outline',
  mass: 'scale-outline',
  area: 'square-outline',
  volume: 'flask-outline',
  speed: 'speedometer-outline',
  pressure: 'pulse-outline',
  energy: 'flash-outline',
  angle: 'compass-outline',
};

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setCategory } = useConversion();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {UNIT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const iconName = CATEGORY_ICON_MAP[cat.id] || 'layers-outline';

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.pill,
                isSelected ? styles.pillActive : styles.pillInactive,
              ]}
              onPress={() => setCategory(cat.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Ionicons
                name={iconName}
                size={15}
                color={isSelected ? Colors.pillActiveText : Colors.pillInactiveText}
              />
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.pillTextActive : styles.pillTextInactive,
                ]}
              >
                {cat.name}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isSelected ? styles.countBadgeActive : styles.countBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isSelected ? styles.countTextActive : styles.countTextInactive,
                  ]}
                >
                  {cat.units.length}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: Colors.pillActiveBg,
    borderColor: Colors.pillActiveBg,
  },
  pillInactive: {
    backgroundColor: Colors.pillInactiveBg,
    borderColor: Colors.cardBorder,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: Colors.pillActiveText,
  },
  pillTextInactive: {
    color: Colors.pillInactiveText,
  },
  countBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countBadgeInactive: {
    backgroundColor: Colors.codeBg,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  countTextActive: {
    color: Colors.textInverse,
  },
  countTextInactive: {
    color: Colors.textMuted,
  },
});
