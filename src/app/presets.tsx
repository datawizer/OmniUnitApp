import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/theme';
import { Header } from '../components/Header';
import { CategoryPills } from '../components/CategoryPills';
import { PresetsSection } from '../components/PresetsSection';
import { useConversion } from '../context/ConversionContext';

export default function PresetsScreen() {
  const { currentCategory } = useConversion();

  const handleApplyPresetNavigate = () => {
    router.navigate('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <CategoryPills />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>
            {currentCategory.name} Scientific Presets & Benchmarks
          </Text>
          <Text style={styles.introSubtitle}>
            Physical constants, international standards, and everyday rules of thumb. Tap any benchmark to immediately load it into the converter.
          </Text>
        </View>

        <PresetsSection onApplyPresetNavigate={handleApplyPresetNavigate} />
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
  introBox: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  introSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
});
