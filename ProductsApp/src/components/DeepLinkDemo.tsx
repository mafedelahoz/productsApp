import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Linking from 'expo-linking';

const DeepLinkDemo: React.FC = () => {
  const handleDeepLinkTest = (url: string) => {
    Alert.alert(
      'Deep Link Test',
      `Opening: ${url}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open', 
          onPress: () => {
            Linking.openURL(url).catch(err => {
              Alert.alert('Error', 'Failed to open deep link');
              console.error('Deep link error:', err);
            });
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Link Demo</Text>
      <Text style={styles.subtitle}>Test the deep linking functionality</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleDeepLinkTest('productsapp://product/1')}
      >
        <Text style={styles.buttonText}>Open Product #1</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleDeepLinkTest('productsapp://product/5')}
      >
        <Text style={styles.buttonText}>Open Product #5</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleDeepLinkTest('productsapp://category/electronics')}
      >
        <Text style={styles.buttonText}>Open Electronics Category</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleDeepLinkTest('productsapp://category/smartphones')}
      >
        <Text style={styles.buttonText}>Open Smartphones Category</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DeepLinkDemo;
