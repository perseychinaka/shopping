import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { CategoryContext } from '../models';
const CategoriesScreen = ({ navigation }) => {
  const { categories } = useContext(CategoryContext);

  return (
    <View>
      <Text>Categories Screen</Text>
      {categories.map((category) => (
        <View key={category.id}>
          <Text>{category.name}</Text>
        </View>
      ))}
      <Button title="Add Category" onPress={() => navigation.navigate('newCategory')} />
    </View>
  );
};

export default CategoriesScreen;