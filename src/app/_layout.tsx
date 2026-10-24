import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { ConversionProvider } from '../context/ConversionContext';
import { NaturalQueryModal } from '../components/NaturalQueryModal';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConversionProvider>
        <StatusBar style="dark" />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textMuted,
            tabBarStyle: {
              backgroundColor: Colors.cardBackground,
              borderTopColor: Colors.cardBorder,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Converter',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="swap-horizontal" size={size} color={color as string} />
              ),
            }}
          />
          <Tabs.Screen
            name="matrix"
            options={{
              title: 'Matrix',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="grid-outline" size={size - 2} color={color as string} />
              ),
            }}
          />
          <Tabs.Screen
            name="presets"
            options={{
              title: 'Benchmarks',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bookmark-outline" size={size - 2} color={color as string} />
              ),
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'History',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="time-outline" size={size - 2} color={color as string} />
              ),
            }}
          />
        </Tabs>
        <NaturalQueryModal />
      </ConversionProvider>
    </SafeAreaProvider>
  );
}
