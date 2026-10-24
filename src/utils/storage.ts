import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnitCategoryId } from '../data/units';

export interface HistoryItem {
  id: string;
  categoryId: UnitCategoryId;
  fromUnitId: string;
  toUnitId: string;
  value: number;
  result: string;
  timestamp: number;
  isFavorite?: boolean;
}

const STORAGE_KEY_HISTORY = '@omniunit_history_v1';
const STORAGE_KEY_FAVORITES = '@omniunit_favorites_v1';

export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load history from storage:', e);
    return [];
  }
}

export async function saveHistory(history: HistoryItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to save history to storage:', e);
  }
}

export async function loadFavorites(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load favorites from storage:', e);
    return [];
  }
}

export async function saveFavorites(favorites: HistoryItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
  } catch (e) {
    console.warn('Failed to save favorites to storage:', e);
  }
}
