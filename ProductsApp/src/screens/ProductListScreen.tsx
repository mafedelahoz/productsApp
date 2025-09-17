import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Product, SortOption } from '../types';
import { ProductsApiService, ApiError } from '../services/api';
import { sortProducts } from '../utils/sorting';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorView from '../components/ErrorView';

type ProductListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

type ProductListScreenRouteProp = RouteProp<RootStackParamList, 'ProductList'>;

interface ProductListScreenProps {
  navigation: ProductListScreenNavigationProp;
  route: ProductListScreenRouteProp;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation, route }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    route.params?.category || null
  );
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 20;

  const loadProducts = useCallback(async (page: number = 0, category?: string | null, reset: boolean = false) => {
    try {
      if (reset) {
        setError(null);
        setIsLoading(true);
      }

      const response = await ProductsApiService.getProducts(
        page * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE,
        category || undefined
      );

      if (reset) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);
      }

      setHasMore(response.products.length === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Failed to load products. Please try again.';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const categoriesData = await ProductsApiService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories(['smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration', 'furniture', 'tops', 'womens-dresses', 'womens-shoes', 'mens-shirts', 'mens-shoes', 'mens-watches', 'womens-watches', 'womens-bags', 'womens-jewellery', 'sunglasses', 'automotive', 'motorcycle', 'lighting']);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadProducts(0, selectedCategory, true);
  }, [loadProducts, selectedCategory]);

  const handleCategorySelect = useCallback((category: string | null) => {
    setSelectedCategory(category);
    loadProducts(0, category, true);
  }, [loadProducts]);

  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
  }, []);

  const handleProductPress = useCallback((productId: number) => {
    navigation.navigate('ProductDetail', { productId });
  }, [navigation]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadProducts(currentPage + 1, selectedCategory, false);
    }
  }, [isLoading, hasMore, currentPage, loadProducts, selectedCategory]);

  const handleRetry = useCallback(() => {
    loadProducts(0, selectedCategory, true);
  }, [loadProducts, selectedCategory]);

  useEffect(() => {
    loadProducts(0, null, true);
    loadCategories();
  }, [loadProducts, loadCategories]);

  const sortedProducts = sortProducts(products, sortBy);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item.id)}
    />
  );

  const renderFooter = () => {
    if (!isLoading || currentPage === 0) return null;
    return <LoadingSpinner message="Loading more products..." />;
  };

  if (error && currentPage === 0) {
    return <ErrorView message={error} onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      
      {isLoading && currentPage === 0 ? (
        <LoadingSpinner message="Loading products..." />
      ) : (
        <FlatList
          data={sortedProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#007AFF"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default ProductListScreen;
