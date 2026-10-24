import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useConversion } from '../context/ConversionContext';
import { UNIT_MAP } from '../data/units';

interface PresetsSectionProps {
  onApplyPresetNavigate?: () => void;
  isEmbedded?: boolean;
}

export const PresetsSection: React.FC<PresetsSectionProps> = ({
  onApplyPresetNavigate,
  isEmbedded = false,
}) => {
  const { currentCategory, applyPreset } = useConversion();

  if (!currentCategory.presets || currentCategory.presets.length === 0) {
    return null;
  }

  const handlePress = (unitId: string, targetUnitId: string, val: number) => {
    applyPreset(unitId, targetUnitId, val);
    if (onApplyPresetNavigate) {
      onApplyPresetNavigate();
    }
  };

  return (
    <View style={[styles.container, isEmbedded && styles.containerEmbedded]}>
      <View style={styles.header}>
        <Ionicons name="bookmark" size={16} color={Colors.accent} />
        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>Scientific & Everyday Benchmarks</Text>
          <Text style={styles.subtitle}>
            Tap any calibrated constant to load it into the converter
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {currentCategory.presets.map((preset, idx) => {
          const fromUnit = UNIT_MAP.get(preset.unitId);
          const toUnit = UNIT_MAP.get(preset.targetUnitId);
          if (!fromUnit || !toUnit) return null;

          return (
            <TouchableOpacity
              key={idx}
              style={styles.presetCard}
              onPress={() => handlePress(preset.unitId, preset.targetUnitId, preset.value)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <Text style={styles.label}>{preset.label}</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
              </View>

              <Text style={styles.note} numberOfLines={2}>
                {preset.note}
              </Text>

              <View style={styles.cardBottom}>
                <Text style={styles.valFrom}>
                  {preset.value} {fromUnit.symbol}
                </Text>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.valTo}>
                  {toUnit.symbol} ({toUnit.name})
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 12,
  },
  containerEmbedded: {
    marginHorizontal: 0,
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.codeBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  grid: {
    padding: 12,
    gap: 10,
  },
  presetCard: {
    backgroundColor: '#FAFCFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  note: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorderSubtle,
  },
  valFrom: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textPrimary,
  },
  arrow: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  valTo: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textSecondary,
  },
});
