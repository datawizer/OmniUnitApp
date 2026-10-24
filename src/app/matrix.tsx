import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/theme';
import { Header } from '../components/Header';
import { CategoryPills } from '../components/CategoryPills';
import { AllUnitsComparison } from '../components/AllUnitsComparison';
import { useConversion } from '../context/ConversionContext';

export default function MatrixScreen() {
  const { currentCategory, currentFromUnit, inputValue, setInputValue, setToUnit } = useConversion();

  const handleSelectTarget = (unitId: string) => {
    setToUnit(unitId);
    router.navigate('/');
  };

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
        {/* Quick Value Bar */}
        <View style={styles.valueBar}>
          <View style={styles.valueBarLeft}>
            <Text style={styles.valueBarTitle}>Matrix Base Value</Text>
            <Text style={styles.valueBarSubtitle}>
              Translating across all {currentCategory.units.length} units in {currentCategory.name}
            </Text>
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.valueInput}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.symbolBadge}>{currentFromUnit.symbol}</Text>
          </View>
        </View>

        {/* Matrix Component */}
        <AllUnitsComparison onUnitSelectTarget={handleSelectTarget} />

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            Tip: Tap any row in the matrix to set it as the target unit in the dual converter.
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
  valueBar: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  valueBarLeft: {
    flex: 1,
  },
  valueBarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  valueBarSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.codeBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 100,
  },
  valueInput: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textPrimary,
    minWidth: 50,
    padding: 2,
  },
  symbolBadge: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  tipBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
