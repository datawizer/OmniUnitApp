import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useConversion } from '../context/ConversionContext';
import { UNIT_MAP } from '../data/units';
import { HistoryItem } from '../utils/storage';

interface HistorySectionProps {
  onSelectItemNavigate?: () => void;
  isEmbedded?: boolean;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  onSelectItemNavigate,
  isEmbedded = false,
}) => {
  const {
    history,
    favorites,
    applyHistoryItem,
    toggleItemFavorite,
    clearHistory,
    removeHistoryItem,
  } = useConversion();

  const handleSelectItem = (item: HistoryItem) => {
    applyHistoryItem(item);
    if (onSelectItemNavigate) {
      onSelectItemNavigate();
    }
  };

  return (
    <View style={[styles.container, isEmbedded && styles.containerEmbedded]}>
      {/* FAVORITES */}
      {favorites.length > 0 && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="star" size={16} color={Colors.favoriteActive} />
              <Text style={styles.sectionTitle}>
                Pinned Favorites ({favorites.length})
              </Text>
            </View>
          </View>

          <View style={styles.itemsList}>
            {favorites.map((fav) => {
              const fromUnit = UNIT_MAP.get(fav.fromUnitId);
              const toUnit = UNIT_MAP.get(fav.toUnitId);
              if (!fromUnit || !toUnit) return null;

              return (
                <TouchableOpacity
                  key={fav.id}
                  style={styles.itemCard}
                  onPress={() => handleSelectItem(fav)}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemUnits}>
                      {fromUnit.name} → {toUnit.name}
                    </Text>
                    <Text style={styles.itemEquation}>
                      {fav.value} {fromUnit.symbol} = {fav.result} {toUnit.symbol}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.starBtn}
                    onPress={() => toggleItemFavorite(fav)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="star" size={17} color={Colors.favoriteActive} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* RECENT HISTORY */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="time" size={16} color={Colors.textSecondary} />
            <Text style={styles.sectionTitle}>Recent History ({history.length})</Text>
          </View>

          {history.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={clearHistory}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={13} color={Colors.danger} />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="time-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No history recorded yet</Text>
            <Text style={styles.emptySubtitle}>
              Conversions you perform will automatically appear here
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {history.map((item) => {
              const fromUnit = UNIT_MAP.get(item.fromUnitId);
              const toUnit = UNIT_MAP.get(item.toUnitId);
              if (!fromUnit || !toUnit) return null;

              const isFav = favorites.some((f) => f.id === item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => handleSelectItem(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemEquation}>
                      <Text style={styles.bold}>{item.value}</Text> {fromUnit.symbol} →{' '}
                      <Text style={styles.bold}>{item.result}</Text> {toUnit.symbol}
                    </Text>
                    <Text style={styles.itemUnits}>
                      {fromUnit.name} to {toUnit.name}
                    </Text>
                  </View>

                  <View style={styles.actionsRight}>
                    <TouchableOpacity
                      style={styles.starBtn}
                      onPress={() => toggleItemFavorite(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isFav ? 'star' : 'star-outline'}
                        size={16}
                        color={isFav ? Colors.favoriteActive : Colors.textMuted}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.trashBtn}
                      onPress={() => removeHistoryItem(item.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={16} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  containerEmbedded: {
    marginHorizontal: 0,
    marginTop: 0,
  },
  sectionBlock: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.codeBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.dangerBg,
  },
  clearText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.danger,
  },
  itemsList: {
    padding: 12,
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFCFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemLeft: {
    flex: 1,
    paddingRight: 8,
  },
  itemEquation: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textPrimary,
  },
  bold: {
    fontWeight: '700',
  },
  itemUnits: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starBtn: {
    padding: 6,
  },
  trashBtn: {
    padding: 6,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
