import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { Header } from '../components/Header';
import { CategoryPills } from '../components/CategoryPills';
import { ConverterCard } from '../components/ConverterCard';
import { AllUnitsComparison } from '../components/AllUnitsComparison';
import { PresetsSection } from '../components/PresetsSection';

export default function ConverterScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <CategoryPills />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Main Dual Converter Card */}
        <ConverterCard />

        {/* Quick View Navigation Banner */}
        <View style={styles.quickNav}>
          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => router.navigate('/matrix')}
            activeOpacity={0.7}
          >
            <Ionicons name="grid-outline" size={16} color={Colors.accent} />
            <Text style={styles.quickNavText}>Comparative Matrix</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => router.navigate('/presets')}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark-outline" size={16} color={Colors.accent} />
            <Text style={styles.quickNavText}>Scientific Benchmarks</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Multi-unit Comparison Grid */}
        <AllUnitsComparison />

        {/* Benchmarks Section */}
        <PresetsSection />

        {/* App Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>OmniUnit Measurement Converter</Text>
          <Text style={styles.footerText}>
            11 Measurement Domains · SI & Imperial Standards · High Precision IEEE 754
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  quickNav: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
  },
  quickNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  quickNavText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 4,
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  footerText: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
});
