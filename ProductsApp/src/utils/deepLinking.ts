import * as Linking from 'expo-linking';
import { DeepLinkParams } from '../types';

export const createDeepLink = (params: DeepLinkParams): string => {
  const baseUrl = 'productsapp://';
  
  if (params.productId) {
    return `${baseUrl}product/${params.productId}`;
  }
  
  if (params.category) {
    return `${baseUrl}category/${encodeURIComponent(params.category)}`;
  }
  
  return baseUrl;
};

export const parseDeepLink = (url: string): DeepLinkParams | null => {
  try {
    const parsed = Linking.parse(url);
    
    if (!parsed.path) {
      return null;
    }
    
    const pathSegments = parsed.path.split('/').filter(Boolean);
    
    if (pathSegments.length === 2) {
      const [type, value] = pathSegments;
      
      if (type === 'product') {
        const productId = parseInt(value, 10);
        if (!isNaN(productId)) {
          return { productId };
        }
      }
      
      if (type === 'category') {
        return { category: decodeURIComponent(value) };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};

export const handleDeepLink = (
  url: string,
  navigation: any
): boolean => {
  const params = parseDeepLink(url);
  
  if (!params) {
    return false;
  }
  
  if (params.productId) {
    navigation.navigate('ProductDetail', { productId: params.productId });
    return true;
  }
  
  if (params.category) {
    // Navigate to product list with category filter
    navigation.navigate('ProductList', { category: params.category });
    return true;
  }
  
  return false;
};
