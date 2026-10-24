import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/theme';
import { Header } from '../components/Header';
import { HistorySection } from '../components/HistorySection';

export default function HistoryScreen() {
  const handleSelectItemNavigate = () => {
    router.navigate('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>Saved & Conversion History</Text>
          <Text style={styles.introSubtitle}>
            Review previous calculations or tap any entry to reload it directly into the conversion studio. Pinned favorites stay at the top for quick access.
          </Text>
        </View>

        <HistorySection onSelectItemNavigate={handleSelectItemNavigate} />
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
