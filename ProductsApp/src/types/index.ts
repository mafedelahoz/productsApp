// Product related types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// API Response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoriesResponse extends Array<string> {}

// Sorting and filtering types
export type SortOption = 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc';

export interface FilterOptions {
  category?: string;
  sortBy?: SortOption;
  searchQuery?: string;
}

// Navigation types
export type RootStackParamList = {
  ProductList: { category?: string } | undefined;
  ProductDetail: { productId: number };
};

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Deep linking types
export interface DeepLinkParams {
  category?: string;
  productId?: number;
}
