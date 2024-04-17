import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoryCard = ({ title, description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    // backgroundColor: '#fff'
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: 'green',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  description: {
    fontSize: 16,
    padding: 10,
  },
});

export default CategoryCard;