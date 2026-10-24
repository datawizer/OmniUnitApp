import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/theme';
import { useConversion } from '../context/ConversionContext';
import { UnitPickerModal } from './UnitPickerModal';
import { QuickAdjustBar } from './QuickAdjustBar';
import { triggerHaptic } from '../utils/haptics';

export const ConverterCard: React.FC = () => {
  const {
    currentCategory,
    currentFromUnit,
    currentToUnit,
    inputValue,
    setInputValue,
    setFromUnit,
    setToUnit,
    swapUnits,
    precision,
    setPrecision,
    useScientific,
    setUseScientific,
    formattedResult,
    formulaText,
    isCurrentFavorite,
    toggleCurrentFavorite,
  } = useConversion();

  const [fromModalVisible, setFromModalVisible] = useState(false);
  const [toModalVisible, setToModalVisible] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedEquation, setCopiedEquation] = useState(false);

  const numericInput = parseFloat(inputValue);
  const isValidNumber = !isNaN(numericInput);

  const handleCopyResult = async () => {
    if (!isValidNumber) return;
    triggerHaptic('success');
    await Clipboard.setStringAsync(formattedResult);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const handleCopyEquation = async () => {
    if (!isValidNumber) return;
    triggerHaptic('success');
    const eq = `${inputValue} ${currentFromUnit.symbol} = ${formattedResult} ${currentToUnit.symbol}`;
    await Clipboard.setStringAsync(eq);
    setCopiedEquation(true);
    setTimeout(() => setCopiedEquation(false), 2000);
  };

  return (
    <View style={styles.card}>
      {/* Top Banner */}
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.categoryTitle}>{currentCategory.name}</Text>
          <Text style={styles.siBaseBadge}>SI base: {currentCategory.baseUnitSymbol}</Text>
        </View>

        <View style={styles.headerControls}>
          {/* Favorite Toggle */}
          <TouchableOpacity
            style={[styles.controlBtn, isCurrentFavorite && styles.favoriteActiveBtn]}
            onPress={toggleCurrentFavorite}
            activeOpacity={0.7}
            accessibilityLabel="Toggle favorite"
          >
            <Ionicons
              name={isCurrentFavorite ? 'star' : 'star-outline'}
              size={17}
              color={isCurrentFavorite ? Colors.favoriteActive : Colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Precision Selector */}
          <View style={styles.precisionGroup}>
            {[2, 4, 6].map((p) => {
              const active = precision === p && !useScientific;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.precisionBtn, active && styles.precisionBtnActive]}
                  onPress={() => {
                    triggerHaptic('selection');
                    setPrecision(p);
                    setUseScientific(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.precisionText,
                      active && styles.precisionTextActive,
                    ]}
                  >
                    .{p}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.precisionBtn, useScientific && styles.precisionBtnActive]}
              onPress={() => {
                triggerHaptic('selection');
                setUseScientific(!useScientific);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.precisionText,
                  useScientific && styles.precisionTextActive,
                ]}
              >
                Sci
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Conversion Stage */}
      <View style={styles.stage}>
        {/* FROM ZONE */}
        <View style={styles.zoneBox}>
          <View style={styles.zoneHeader}>
            <Text style={styles.zoneLabel}>FROM</Text>
            <Text style={styles.unitMeta} numberOfLines={1}>
              {currentFromUnit.name}
            </Text>
          </View>

          {/* Numeric Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numericInput}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              selectTextOnFocus
            />
            {inputValue.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic('impactLight');
                  setInputValue('');
                }}
                style={styles.clearBtn}
              >
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick adjust steppers */}
          <QuickAdjustBar />

          {/* From Unit Selector Button */}
          <TouchableOpacity
            style={styles.unitSelectButton}
            onPress={() => setFromModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.unitSelectLeft}>
              <Text style={styles.unitSelectName} numberOfLines={1}>
                {currentFromUnit.name}
              </Text>
              <View style={styles.symbolTag}>
                <Text style={styles.symbolTagText}>{currentFromUnit.symbol}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* SWAP BUTTON */}
        <View style={styles.swapContainer}>
          <TouchableOpacity
            style={styles.swapButton}
            onPress={swapUnits}
            activeOpacity={0.8}
            accessibilityLabel="Swap from and to units"
          >
            <Ionicons name="swap-vertical" size={20} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>

        {/* TO ZONE */}
        <View style={styles.zoneBox}>
          <View style={styles.zoneHeader}>
            <Text style={styles.zoneLabel}>TO (RESULT)</Text>
            <Text style={styles.unitMeta} numberOfLines={1}>
              {currentToUnit.name}
            </Text>
          </View>

          {/* Result Output Text */}
          <View style={styles.resultContainer}>
            <Text
              style={styles.resultText}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              selectable
            >
              {formattedResult}
            </Text>
          </View>

          {/* Copy Buttons */}
          <View style={styles.copyRow}>
            <TouchableOpacity
              style={[styles.copyBtn, !isValidNumber && styles.btnDisabled]}
              onPress={handleCopyResult}
              disabled={!isValidNumber}
              activeOpacity={0.7}
            >
              <Ionicons
                name={copiedResult ? 'checkmark' : 'copy-outline'}
                size={14}
                color={copiedResult ? Colors.success : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.copyBtnText,
                  copiedResult && { color: Colors.success, fontWeight: '700' },
                ]}
              >
                {copiedResult ? 'Copied' : 'Copy Result'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.copyBtn, !isValidNumber && styles.btnDisabled]}
              onPress={handleCopyEquation}
              disabled={!isValidNumber}
              activeOpacity={0.7}
            >
              <Ionicons
                name={copiedEquation ? 'checkmark' : 'copy-outline'}
                size={14}
                color={copiedEquation ? Colors.success : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.copyBtnText,
                  copiedEquation && { color: Colors.success, fontWeight: '700' },
                ]}
              >
                {copiedEquation ? 'Copied' : 'Copy Equation'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* To Unit Selector Button */}
          <TouchableOpacity
            style={styles.unitSelectButton}
            onPress={() => setToModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.unitSelectLeft}>
              <Text style={styles.unitSelectName} numberOfLines={1}>
                {currentToUnit.name}
              </Text>
              <View style={styles.symbolTag}>
                <Text style={styles.symbolTagText}>{currentToUnit.symbol}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Formula & Live Equation Ribbon */}
      <View style={styles.formulaRibbon}>
        <View style={styles.formulaHeader}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.accent} />
          <Text style={styles.formulaLabel}>Formula</Text>
        </View>
        <Text style={styles.formulaCode}>{formulaText}</Text>
        {isValidNumber && (
          <Text style={styles.equationPreview}>
            {inputValue} {currentFromUnit.symbol} = {formattedResult} {currentToUnit.symbol}
          </Text>
        )}
      </View>

      {/* Unit Picker Modals */}
      <UnitPickerModal
        visible={fromModalVisible}
        title={`From Unit (${currentCategory.name})`}
        units={currentCategory.units}
        selectedUnitId={currentFromUnit.id}
        onSelectUnit={setFromUnit}
        onClose={() => setFromModalVisible(false)}
      />

      <UnitPickerModal
        visible={toModalVisible}
        title={`To Unit (${currentCategory.name})`}
        units={currentCategory.units}
        selectedUnitId={currentToUnit.id}
        onSelectUnit={setToUnit}
        onClose={() => setToModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 16,
    marginTop: 12,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.codeBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  siBaseBadge: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textMuted,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteActiveBtn: {
    backgroundColor: Colors.favoriteBg,
    borderColor: Colors.favoriteActive,
  },
  precisionGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 2,
  },
  precisionBtn: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  precisionBtnActive: {
    backgroundColor: Colors.primary,
  },
  precisionText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textSecondary,
  },
  precisionTextActive: {
    color: Colors.textInverse,
  },
  stage: {
    padding: 16,
    gap: 12,
  },
  zoneBox: {
    backgroundColor: '#FAFCFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  zoneLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
  },
  unitMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.cardBorder,
    paddingBottom: 4,
  },
  numericInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textPrimary,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  clearBtn: {
    padding: 4,
  },
  resultContainer: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingVertical: 6,
    minHeight: 46,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textPrimary,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  copyBtn: {
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
  copyBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  unitSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  unitSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  unitSelectName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  symbolTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: Colors.codeBg,
  },
  symbolTagText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textSecondary,
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: -6,
    zIndex: 10,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 3,
    borderColor: Colors.cardBackground,
  },
  formulaRibbon: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.codeBg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    gap: 4,
  },
  formulaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  formulaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    textTransform: 'uppercase',
  },
  formulaCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: Colors.textPrimary,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: 2,
  },
  equationPreview: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
