import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UNIT_CATEGORIES,
  CATEGORY_MAP,
  UNIT_MAP,
  UnitCategoryId,
  UnitCategory,
  UnitDefinition,
  convertValue,
  formatUnitValue,
  getFormulaExplanation,
} from '../data/units';
import {
  HistoryItem,
  loadHistory,
  saveHistory,
  loadFavorites,
  saveFavorites,
} from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

interface ConversionContextValue {
  selectedCategory: UnitCategoryId;
  currentCategory: UnitCategory;
  fromUnitId: string;
  toUnitId: string;
  currentFromUnit: UnitDefinition;
  currentToUnit: UnitDefinition;
  inputValue: string;
  precision: number;
  useScientific: boolean;
  convertedValue: number;
  formattedResult: string;
  formulaText: string;
  history: HistoryItem[];
  favorites: HistoryItem[];
  isCurrentFavorite: boolean;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  setCategory: (id: UnitCategoryId) => void;
  setFromUnit: (id: string) => void;
  setToUnit: (id: string) => void;
  setInputValue: (val: string) => void;
  setPrecision: (p: number) => void;
  setUseScientific: (sci: boolean) => void;
  swapUnits: () => void;
  resetToDefaults: () => void;
  quickAdjust: (type: 'add1' | 'sub1' | 'mul10' | 'div10' | 'negate' | 'reset1') => void;
  toggleCurrentFavorite: () => void;
  toggleItemFavorite: (item: HistoryItem) => void;
  applyPreset: (unitId: string, targetUnitId: string, value: number) => void;
  applyParsedQuery: (catId: UnitCategoryId, fromId: string, toId: string | undefined, value: number) => void;
  applyHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
}

const ConversionContext = createContext<ConversionContextValue | null>(null);

export const ConversionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategoryId>('temperature');
  const [fromUnitId, setFromUnitId] = useState<string>('celsius');
  const [toUnitId, setToUnitId] = useState<string>('fahrenheit');
  const [inputValue, setInputValue] = useState<string>('25');
  const [precision, setPrecision] = useState<number>(4);
  const [useScientific, setUseScientific] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<HistoryItem[]>([]);

  // Load saved state on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [savedHistory, savedFavs] = await Promise.all([loadHistory(), loadFavorites()]);
      if (mounted) {
        setHistory(savedHistory);
        setFavorites(savedFavs);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync to storage
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const currentCategory = useMemo(() => {
    return CATEGORY_MAP.get(selectedCategory) || UNIT_CATEGORIES[0];
  }, [selectedCategory]);

  const currentFromUnit = useMemo(() => {
    return UNIT_MAP.get(fromUnitId) || currentCategory.units[0];
  }, [fromUnitId, currentCategory]);

  const currentToUnit = useMemo(() => {
    return UNIT_MAP.get(toUnitId) || currentCategory.units[1] || currentCategory.units[0];
  }, [toUnitId, currentCategory]);

  const numericInput = parseFloat(inputValue);
  const isValidNumber = !isNaN(numericInput);

  const convertedValue = useMemo(() => {
    if (!isValidNumber) return NaN;
    try {
      return convertValue(numericInput, fromUnitId, toUnitId);
    } catch {
      return NaN;
    }
  }, [numericInput, fromUnitId, toUnitId, isValidNumber]);

  const formattedResult = useMemo(() => {
    if (!isValidNumber || isNaN(convertedValue)) return '—';
    return formatUnitValue(convertedValue, precision, useScientific);
  }, [convertedValue, precision, useScientific, isValidNumber]);

  const formulaText = useMemo(() => {
    return getFormulaExplanation(fromUnitId, toUnitId);
  }, [fromUnitId, toUnitId]);

  // Debounced history recording
  useEffect(() => {
    if (!isValidNumber) return;

    const timer = setTimeout(() => {
      try {
        const resultVal = convertValue(numericInput, fromUnitId, toUnitId);
        const formatted = formatUnitValue(resultVal, precision, useScientific);

        const newItem: HistoryItem = {
          id: `${Date.now()}-${fromUnitId}-${toUnitId}`,
          categoryId: selectedCategory,
          fromUnitId,
          toUnitId,
          value: numericInput,
          result: formatted,
          timestamp: Date.now(),
        };

        setHistory((prev) => {
          if (
            prev.length > 0 &&
            prev[0].fromUnitId === newItem.fromUnitId &&
            prev[0].toUnitId === newItem.toUnitId &&
            prev[0].value === newItem.value
          ) {
            return prev;
          }
          return [newItem, ...prev.slice(0, 49)];
        });
      } catch (err) {
        console.error('History update error:', err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [inputValue, fromUnitId, toUnitId, precision, useScientific, selectedCategory, isValidNumber, numericInput]);

  const setCategory = useCallback((catId: UnitCategoryId) => {
    triggerHaptic('selection');
    setSelectedCategory(catId);
    const cat = CATEGORY_MAP.get(catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
      if (catId === 'temperature') {
        setInputValue('25');
      } else if (catId === 'storage') {
        setInputValue('16');
      } else if (catId === 'time') {
        setInputValue('24');
      } else {
        setInputValue('1');
      }
    }
  }, []);

  const swapUnits = useCallback(() => {
    triggerHaptic('impactLight');
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  }, [fromUnitId, toUnitId]);

  const resetToDefaults = useCallback(() => {
    triggerHaptic('impactMedium');
    setInputValue('1');
    if (currentCategory.units.length >= 2) {
      setFromUnitId(currentCategory.units[0].id);
      setToUnitId(currentCategory.units[1].id);
    }
    setPrecision(4);
    setUseScientific(false);
  }, [currentCategory]);

  const quickAdjust = useCallback((type: 'add1' | 'sub1' | 'mul10' | 'div10' | 'negate' | 'reset1') => {
    triggerHaptic('selection');
    const val = parseFloat(inputValue) || 0;
    let nextVal = val;
    switch (type) {
      case 'add1':
        nextVal = val + 1;
        break;
      case 'sub1':
        nextVal = val - 1;
        break;
      case 'mul10':
        nextVal = val * 10;
        break;
      case 'div10':
        nextVal = val / 10;
        break;
      case 'negate':
        nextVal = -val;
        break;
      case 'reset1':
        nextVal = 1;
        break;
    }
    setInputValue(nextVal.toString());
  }, [inputValue]);

  const isCurrentFavorite = useMemo(() => {
    if (!isValidNumber) return false;
    return favorites.some(
      (f) =>
        f.categoryId === selectedCategory &&
        f.fromUnitId === fromUnitId &&
        f.toUnitId === toUnitId &&
        f.value === numericInput
    );
  }, [favorites, selectedCategory, fromUnitId, toUnitId, numericInput, isValidNumber]);

  const toggleCurrentFavorite = useCallback(() => {
    if (!isValidNumber) return;
    triggerHaptic('impactLight');

    const resultVal = convertValue(numericInput, fromUnitId, toUnitId);
    const formatted = formatUnitValue(resultVal, precision, useScientific);

    if (isCurrentFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (f) =>
            !(
              f.categoryId === selectedCategory &&
              f.fromUnitId === fromUnitId &&
              f.toUnitId === toUnitId &&
              f.value === numericInput
            )
        )
      );
    } else {
      const newFav: HistoryItem = {
        id: `fav-${Date.now()}`,
        categoryId: selectedCategory,
        fromUnitId,
        toUnitId,
        value: numericInput,
        result: formatted,
        timestamp: Date.now(),
        isFavorite: true,
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  }, [isValidNumber, numericInput, fromUnitId, toUnitId, precision, useScientific, isCurrentFavorite, selectedCategory]);

  const toggleItemFavorite = useCallback((item: HistoryItem) => {
    triggerHaptic('selection');
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [{ ...item, isFavorite: true }, ...prev];
      }
    });
  }, []);

  const applyPreset = useCallback((unitId: string, targetUnitId: string, value: number) => {
    triggerHaptic('impactMedium');
    setFromUnitId(unitId);
    setToUnitId(targetUnitId);
    setInputValue(value.toString());
  }, []);

  const applyParsedQuery = useCallback(
    (catId: UnitCategoryId, fromId: string, toId: string | undefined, value: number) => {
      triggerHaptic('impactMedium');
      setSelectedCategory(catId);
      setFromUnitId(fromId);
      const cat = CATEGORY_MAP.get(catId);
      if (toId) {
        setToUnitId(toId);
      } else if (cat) {
        const fallback = cat.units.find((u) => u.id !== fromId) || cat.units[0];
        setToUnitId(fallback.id);
      }
      setInputValue(value.toString());
      setSearchModalOpen(false);
    },
    []
  );

  const applyHistoryItem = useCallback((item: HistoryItem) => {
    triggerHaptic('selection');
    setSelectedCategory(item.categoryId);
    setFromUnitId(item.fromUnitId);
    setToUnitId(item.toUnitId);
    setInputValue(item.value.toString());
  }, []);

  const clearHistory = useCallback(() => {
    triggerHaptic('impactHeavy');
    setHistory([]);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    triggerHaptic('impactLight');
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      selectedCategory,
      currentCategory,
      fromUnitId,
      toUnitId,
      currentFromUnit,
      currentToUnit,
      inputValue,
      precision,
      useScientific,
      convertedValue,
      formattedResult,
      formulaText,
      history,
      favorites,
      isCurrentFavorite,
      searchModalOpen,
      setSearchModalOpen,
      setCategory,
      setFromUnit: setFromUnitId,
      setToUnit: setToUnitId,
      setInputValue,
      setPrecision,
      setUseScientific,
      swapUnits,
      resetToDefaults,
      quickAdjust,
      toggleCurrentFavorite,
      toggleItemFavorite,
      applyPreset,
      applyParsedQuery,
      applyHistoryItem,
      clearHistory,
      removeHistoryItem,
    }),
    [
      selectedCategory,
      currentCategory,
      fromUnitId,
      toUnitId,
      currentFromUnit,
      currentToUnit,
      inputValue,
      precision,
      useScientific,
      convertedValue,
      formattedResult,
      formulaText,
      history,
      favorites,
      isCurrentFavorite,
      searchModalOpen,
      setCategory,
      swapUnits,
      resetToDefaults,
      quickAdjust,
      toggleCurrentFavorite,
      toggleItemFavorite,
      applyPreset,
      applyParsedQuery,
      applyHistoryItem,
      clearHistory,
      removeHistoryItem,
    ]
  );

  return <ConversionContext.Provider value={value}>{children}</ConversionContext.Provider>;
};

export const useConversion = (): ConversionContextValue => {
  const context = useContext(ConversionContext);
  if (!context) {
    throw new Error('useConversion must be used within a ConversionProvider');
  }
  return context;
};
