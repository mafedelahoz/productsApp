import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Product } from '../types';
import { ProductsApiService, ApiError } from '../services/api';
import { formatPrice, formatRating } from '../utils/sorting';
import calendarService from '../services/calendarService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorView from '../components/ErrorView';

type ProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

interface ProductDetailScreenProps {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;
}

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const productData = await ProductsApiService.getProduct(productId);
      setProduct(productData);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Failed to load product details. Please try again.';
      setError(errorMessage);
      console.error('Error loading product:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const handleAddToCalendar = useCallback(async () => {
    if (!product) return;

    Alert.alert(
      'Add Reminder',
      `Would you like to add a reminder to purchase "${product.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Reminder', 
          onPress: async () => {
            try {
              const reminderDate = new Date();
              reminderDate.setHours(reminderDate.getHours() + 24); // 24 hours from now
              
              await calendarService.addPurchaseReminder(product.title, reminderDate);
              Alert.alert('Success', 'Reminder added to your calendar and notifications!');
            } catch (error) {
              console.error('Failed to add reminder:', error);
              Alert.alert(
                'Error', 
                'Failed to add reminder. Please check your calendar permissions.'
              );
            }
          }
        },
      ]
    );
  }, [product]);

  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (isLoading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <ErrorView 
        message={error || 'Product not found'} 
        onRetry={loadProduct}
      />
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.images[currentImageIndex] || product.thumbnail }} 
          style={styles.mainImage}
          resizeMode="cover"
        />
        {product.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{product.discountPercentage.toFixed(0)}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Image Thumbnails */}
      {product.images.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
          contentContainerStyle={styles.thumbnailContent}
        >
          {product.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.thumbnail,
                currentImageIndex === index && styles.thumbnailActive
              ]}
              onPress={() => handleImagePress(index)}
            >
              <Image source={{ uri: image }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.brand}>by {product.brand}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {formatRating(product.rating)}</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={styles.originalPrice}>
              ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.stockContainer}>
          <Text style={[
            styles.stock,
            product.stock > 10 ? styles.stockInStock : styles.stockLow
          ]}>
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!`}
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <TouchableOpacity 
          style={styles.calendarButton} 
          onPress={handleAddToCalendar}
        >
          <Text style={styles.calendarButtonText}>📅 Add Purchase Reminder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#F2F2F7',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  thumbnailContainer: {
    maxHeight: 80,
    backgroundColor: '#F2F2F7',
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
    lineHeight: 30,
  },
  brand: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  stockContainer: {
    marginBottom: 24,
  },
  stock: {
    fontSize: 16,
    fontWeight: '600',
  },
  stockInStock: {
    color: '#34C759',
  },
  stockLow: {
    color: '#FF3B30',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
  },
  calendarButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
