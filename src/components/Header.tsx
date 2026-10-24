import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useConversion } from '../context/ConversionContext';
import { triggerHaptic } from '../utils/haptics';

export const Header: React.FC = () => {
  const { resetToDefaults, setSearchModalOpen } = useConversion();

  const handleOpenSearch = () => {
    triggerHaptic('selection');
    setSearchModalOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="swap-horizontal" size={20} color={Colors.textInverse} />
        </View>
        <View>
          <Text style={styles.title}>OmniUnit</Text>
          <Text style={styles.subtitle}>High-Precision SI & Imperial</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleOpenSearch}
          activeOpacity={0.7}
          accessibilityLabel="Open fast query jump"
        >
          <Ionicons name="search" size={17} color={Colors.textPrimary} />
          <Text style={styles.actionText}>Quick Jump</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={resetToDefaults}
          activeOpacity={0.7}
          accessibilityLabel="Reset values"
        >
          <Ionicons name="refresh" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  resetButton: {
    paddingHorizontal: 9,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
