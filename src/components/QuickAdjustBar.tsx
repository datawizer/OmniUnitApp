import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { useConversion } from '../context/ConversionContext';

export const QuickAdjustBar: React.FC = () => {
  const { quickAdjust } = useConversion();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => quickAdjust('sub1')}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>-1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => quickAdjust('add1')}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>+1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => quickAdjust('div10')}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>÷10</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => quickAdjust('mul10')}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>×10</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => quickAdjust('negate')}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>±</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.resetBtn]}
        onPress={() => quickAdjust('reset1')}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnText, styles.resetBtnText]}>Set 1</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  btn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  resetBtn: {
    marginLeft: 'auto',
    backgroundColor: Colors.pillActiveBg,
    borderColor: Colors.pillActiveBg,
  },
  resetBtnText: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
});
