import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SortOption } from '../types';
import { getSortOptionLabel } from '../utils/sorting';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  sortBy,
  onSortChange,
}) => {
  const sortOptions: SortOption[] = ['price-asc', 'price-desc', 'rating-asc', 'rating-desc'];

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === null && styles.filterChipActive,
            ]}
            onPress={() => onCategorySelect(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === null && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.filter(category => category && typeof category === 'string').map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}
              onPress={() => onCategorySelect(category)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive,
                ]}
              >
                {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterChip,
                sortBy === option && styles.filterChipActive,
              ]}
              onPress={() => onSortChange(option)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  sortBy === option && styles.filterChipTextActive,
                ]}
              >
                {getSortOptionLabel(option)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
});

export default FilterBar;
