import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/theme';
import { useConversion } from '../context/ConversionContext';
import { UnitDefinition, convertValue, formatUnitValue } from '../data/units';
import { triggerHaptic } from '../utils/haptics';

interface AllUnitsComparisonProps {
  onUnitSelectTarget?: (unitId: string) => void;
  isEmbedded?: boolean;
}

export const AllUnitsComparison: React.FC<AllUnitsComparisonProps> = ({
  onUnitSelectTarget,
  isEmbedded = false,
}) => {
  const {
    currentCategory,
    currentFromUnit,
    inputValue,
    precision,
    useScientific,
    setFromUnit,
    setToUnit,
  } = useConversion();

  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const numericValue = parseFloat(inputValue);
  const isValidNumber = !isNaN(numericValue);

  const filteredUnits = useMemo(() => {
    if (!filterQuery.trim()) return currentCategory.units;
    const q = filterQuery.toLowerCase().trim();
    return currentCategory.units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.symbol.toLowerCase().includes(q) ||
        (u.aliases && u.aliases.some((a) => a.toLowerCase().includes(q)))
    );
  }, [currentCategory.units, filterQuery]);

  const handleCopySingle = async (unit: UnitDefinition, formatted: string) => {
    triggerHaptic('success');
    await Clipboard.setStringAsync(`${formatted} ${unit.symbol}`);
    setCopiedId(unit.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCopyAll = async () => {
    if (!isValidNumber) return;
    triggerHaptic('success');
    const lines = currentCategory.units.map((u) => {
      const val = convertValue(numericValue, currentFromUnit.id, u.id);
      const formatted = formatUnitValue(val, precision, useScientific);
      return `${u.name} (${u.symbol}): ${formatted}`;
    });
    const header = `OmniUnit — ${currentCategory.name} Conversions for ${inputValue} ${currentFromUnit.symbol}:`;
    const fullText = [header, ...lines].join('\n');
    await Clipboard.setStringAsync(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleSelectUnit = (unitId: string) => {
    triggerHaptic('selection');
    if (onUnitSelectTarget) {
      onUnitSelectTarget(unitId);
    } else {
      setToUnit(unitId);
    }
  };

  return (
    <View style={[styles.container, isEmbedded && styles.containerEmbedded]}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>All {currentCategory.name} Units Matrix</Text>
          <Text style={styles.subtitle}>
            Source: {inputValue || '0'} {currentFromUnit.symbol}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.copyAllBtn, !isValidNumber && styles.btnDisabled]}
          onPress={handleCopyAll}
          disabled={!isValidNumber}
          activeOpacity={0.7}
        >
          <Ionicons
            name={copiedAll ? 'checkmark' : 'document-text-outline'}
            size={14}
            color={copiedAll ? Colors.success : Colors.textPrimary}
          />
          <Text
            style={[
              styles.copyAllBtnText,
              copiedAll && { color: Colors.success, fontWeight: '700' },
            ]}
          >
            {copiedAll ? 'Copied' : 'Copy All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        <Ionicons name="search" size={15} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.filterInput}
          value={filterQuery}
          onChangeText={setFilterQuery}
          placeholder="Filter units..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {filterQuery.length > 0 && (
          <TouchableOpacity onPress={() => setFilterQuery('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Units List */}
      <View style={styles.list}>
        {filteredUnits.map((unit) => {
          const isSource = unit.id === currentFromUnit.id;
          const val = isValidNumber
            ? convertValue(numericValue, currentFromUnit.id, unit.id)
            : NaN;
          const formatted = isValidNumber
            ? formatUnitValue(val, precision, useScientific)
            : '—';
          const isCopied = copiedId === unit.id;

          return (
            <TouchableOpacity
              key={unit.id}
              style={[styles.row, isSource && styles.rowSource]}
              onPress={() => handleSelectUnit(unit.id)}
              activeOpacity={0.7}
            >
              <View style={styles.unitLeft}>
                <View style={styles.nameRow}>
                  <Text style={[styles.unitName, isSource && styles.unitNameSource]}>
                    {unit.name}
                  </Text>
                  {isSource && (
                    <View style={styles.sourceBadge}>
                      <Text style={styles.sourceBadgeText}>SOURCE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.symbolText}>{unit.symbol}</Text>
              </View>

              <View style={styles.unitRight}>
                <Text
                  style={[styles.convertedValue, isSource && styles.convertedValueSource]}
                  numberOfLines={1}
                >
                  {formatted}
                </Text>
                <TouchableOpacity
                  style={styles.copySingleBtn}
                  onPress={(e) => {
                    handleCopySingle(unit, formatted);
                  }}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name={isCopied ? 'checkmark' : 'copy-outline'}
                    size={14}
                    color={isCopied ? Colors.success : Colors.textMuted}
                  />
                </TouchableOpacity>
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
    justifyContent: 'space-between',
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  copyAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  copyAllBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchIcon: {
    marginRight: 6,
  },
  filterInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    padding: 0,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorderSubtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorderSubtle,
  },
  rowSource: {
    backgroundColor: Colors.accentLight,
  },
  unitLeft: {
    flex: 1,
    paddingRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unitName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  unitNameSource: {
    color: Colors.accentDark,
    fontWeight: '700',
  },
  sourceBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  sourceBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  symbolText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textMuted,
    marginTop: 2,
  },
  unitRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  convertedValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textPrimary,
  },
  convertedValueSource: {
    color: Colors.accentDark,
    fontWeight: '700',
  },
  copySingleBtn: {
    padding: 4,
  },
});
