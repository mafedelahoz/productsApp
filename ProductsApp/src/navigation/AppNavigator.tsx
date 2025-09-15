import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types';
import { handleDeepLink } from '../utils/deepLinking';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const linking = {
    prefixes: [Linking.createURL('/'), 'productsapp://'],
    config: {
      screens: {
        ProductList: {
          path: '/',
          parse: {
            category: (category: string) => category,
          },
        },
        ProductDetail: {
          path: '/product/:productId',
          parse: {
            productId: (productId: string) => parseInt(productId, 10),
          },
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="ProductList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{
            title: 'Products',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ route }) => ({
            title: `Product #${route.params.productId}`,
            headerTitleAlign: 'center',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
