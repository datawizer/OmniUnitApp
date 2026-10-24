import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { parseNaturalQuery } from '../data/units';
import { useConversion } from '../context/ConversionContext';
import { triggerHaptic } from '../utils/haptics';

const SAMPLE_QUERIES = [
  '37 c to f',
  '100 km to miles',
  '16 gb to mb',
  '24 hours to seconds',
  '150 lbs to kg',
  '1 gallon to liters',
  '32 psi to bar',
  '2000 kcal to kj',
  '90 degrees to radians',
  '50 mph to km/h',
];

export const NaturalQueryModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, applyParsedQuery } = useConversion();
  const [query, setQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (!query.trim()) return null;
    return parseNaturalQuery(query);
  }, [query]);

  const handleApply = (queryString: string) => {
    const result = parseNaturalQuery(queryString);
    if (result) {
      triggerHaptic('success');
      applyParsedQuery(
        result.category.id,
        result.fromUnit.id,
        result.toUnit ? result.toUnit.id : undefined,
        result.value
      );
      setQuery('');
      setErrorMsg(null);
      setSearchModalOpen(false);
    } else {
      triggerHaptic('warning');
      setErrorMsg('Could not understand query. Try: "100 km to miles" or "37 c in f"');
    }
  };

  const handleClose = () => {
    setQuery('');
    setErrorMsg(null);
    setSearchModalOpen(false);
  };

  return (
    <Modal
      visible={searchModalOpen}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="flash" size={18} color={Colors.accent} />
              <Text style={styles.title}>Natural Language Query</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Input Box */}
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder='e.g. "100 km to miles", "37 c in f"...'
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={() => handleApply(query)}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => handleApply(query)}
                style={styles.runButton}
                activeOpacity={0.8}
              >
                <Text style={styles.runButtonText}>Apply</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Live Preview if parsed */}
          {parsed && (
            <View style={styles.previewBox}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.previewText}>
                Interpreted: <Text style={styles.bold}>{parsed.value}</Text> {parsed.fromUnit.name} ({parsed.fromUnit.symbol}){' '}
                {parsed.toUnit ? (
                  <>
                    → <Text style={styles.bold}>{parsed.toUnit.name}</Text> ({parsed.toUnit.symbol})
                  </>
                ) : null}
              </Text>
            </View>
          )}

          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Quick Suggestions Chips */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>Instant Examples:</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {SAMPLE_QUERIES.map((sample, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chip}
                  onPress={() => handleApply(sample)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{sample}</Text>
                  <Ionicons name="arrow-forward" size={12} color={Colors.accent} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.codeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  runButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  runButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successBg,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  previewText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dangerBg,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    flex: 1,
  },
  suggestionsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
