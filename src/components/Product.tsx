import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';

const numColumns = 2; // Change this to the number of columns you want
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - (numColumns + 1) * 10) / numColumns;

interface ProductProps {
  id: string;
  name: string;
  description: string;
  category: string;
}

const ProductComponent: React.FC<ProductProps> = ({ id, name, description,category }) => {
  return (
    <View key={id} style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.name}>{description}</Text>
      <Text style={styles.price}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: 'blue',
    // backgroundColor:  theme === 'dark' ? 'green' : 'white',
    borderWidth: 1,
    margin: 3,
    paddingHorizontal: 4,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    width: itemWidth,
    borderRadius: 10, // Use borderRadius for rounded corners
    padding: 10,
    color: 'black', // Light grey background
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
  },
});

export default ProductComponent;