import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { categories } from '../data/Services';

interface FiltersProps {
  selectedCategory: string | null;
  handleSelectCategory: (category: string | null) => void;
}

export default function Filters({ selectedCategory, handleSelectCategory }: FiltersProps) {
  
  // Formatea el texto para aplicar Capitalize (Ej: "TECNOLOGÍA" -> "Tecnología")
  const formatText = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <View style={styles.filtersContainer}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          // Evalúa si la categoría actual es la seleccionada por el usuario
          const isActive = selectedCategory === cat;
          
          return (
            <Pressable
              key={cat}
              onPress={() => handleSelectCategory(cat)}
              style={[
                styles.chipBase,
                isActive ? styles.activeChip : styles.inactiveChip
              ]}
            >
              <Text style={[
                styles.chipText,
                isActive ? styles.activeText : styles.inactiveText
              ]}>
                {formatText(cat)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  scrollContent: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 1,
    gap: 10,
    paddingVertical: 4,
  },
  chipBase: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeChip: {
    backgroundColor: '#7fac75',
    borderColor: '#7fac75',
  },
  inactiveChip: {
    backgroundColor: '#EDF2F7',
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : 'System',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#4A5568',
  },
});