import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ProductProps {
  id: string;
  name: string;
  price: number;
}

const Product: React.FC<ProductProps> = ({ id, name, price }) => {
  return (
    <View key={id} style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: 'blue',
    borderWidth: 1,
    margin: 3,
    paddingHorizontal: 4,
    borderRadius: 10, // Use borderRadius for rounded corners
    padding: 10,
    // backgroundColor: '#f9f9f9', // Light grey background
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
  },
});

export default Product;