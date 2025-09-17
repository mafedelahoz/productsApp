# Products App

A React Native mobile application that allows users to browse and explore a catalog of products using the DummyJSON API.


https://github.com/user-attachments/assets/d5c946a9-0124-422f-a423-4907a3251143


## Features

### Core Features
- **Product Catalog**: Browse a comprehensive list of products with thumbnails, titles, prices, and ratings
- **Category Filtering**: Filter products by category (electronics, clothing, groceries, etc.)
- **Product Sorting**: Sort products by price (ascending/descending) or rating (ascending/descending)
- **Product Details**: View detailed product information including description, brand, stock availability, and multiple images
- **Responsive Design**: Clean, user-friendly interface optimized for mobile devices

### Advanced Features
- **Deep Linking**: Open the app directly to specific categories or products using custom URLs
- **Calendar Integration**: Add purchase reminders to your device's calendar with push notifications
- **Error Handling**: Comprehensive error handling with user-friendly error messages and retry options
- **Loading States**: Smooth loading indicators and pull-to-refresh functionality
- **Infinite Scroll**: Load more products as you scroll through the catalog

## Technical Implementation

### Architecture
- **Clean Architecture**: Separation of concerns with dedicated service layers, mappers, and utilities
- **TypeScript**: Full type safety throughout the application
- **React Navigation**: Stack-based navigation with deep linking support
- **Expo**: Cross-platform development with native module integration

### API Integration
- **DummyJSON API**: Integration with https://dummyjson.com/products for product data
- **Data Mappers**: Clean separation between API responses and application models
- **Error Handling**: Robust error handling for network requests and API failures

### Key Components
- `ProductListScreen`: Main screen displaying filtered and sorted products
- `ProductDetailScreen`: Detailed product view with image gallery and purchase reminders
- `FilterBar`: Category and sorting controls
- `ProductCard`: Reusable product display component
- `CalendarService`: Native calendar integration with notification support

## Deep Linking

The app supports deep linking with the following URL schemes:

- **Product Detail**: `productsapp://product/{productId}`
- **Category Filter**: `productsapp://category/{categoryName}`
- **Home**: `productsapp://`

Example deep links:
- `productsapp://product/1` - Opens product with ID 1
- `productsapp://category/electronics` - Opens electronics category
- `productsapp://` - Opens the main product list

## Calendar Integration

The app includes a native calendar module that allows users to:
- Add purchase reminders to their device calendar
- Schedule push notifications for reminders
- Manage upcoming purchase reminders

### Permissions Required
- Calendar access (to create events)
- Notification permissions (for push notifications)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/mafedelahoz/productsApp>
cd ProductsApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

### Testing Deep Links

#### iOS Simulator
```bash
xcrun simctl openurl booted "productsapp://product/1"
xcrun simctl openurl booted "productsapp://category/electronics"
```

#### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "productsapp://product/1" com.productsapp.app
adb shell am start -W -a android.intent.action.VIEW -d "productsapp://category/electronics" com.productsapp.app
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProductCard.tsx
│   ├── FilterBar.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorView.tsx
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── ProductListScreen.tsx
│   └── ProductDetailScreen.tsx
├── services/           # API and external services
│   ├── api.ts
│   └── calendarService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    ├── sorting.ts
    └── deepLinking.ts
```

## API Endpoints Used

- `GET /products` - Fetch all products with pagination
- `GET /products/{id}` - Fetch specific product details
- `GET /products/categories` - Fetch all available categories
- `GET /products/category/{category}` - Fetch products by category
- `GET /products/search?q={query}` - Search products

## Error Handling

The app implements comprehensive error handling:
- Network connectivity issues
- API rate limiting
- Invalid product IDs
- Permission denials (calendar/notifications)
- Malformed deep links

All errors are displayed with user-friendly messages and retry options.

## Performance Optimizations

- **Image Optimization**: Efficient image loading and caching
- **Infinite Scroll**: Lazy loading of products to improve performance
- **Memoization**: React.memo and useCallback for component optimization
- **FlatList**: Optimized list rendering for large product catalogs

