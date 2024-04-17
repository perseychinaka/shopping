import React, { useContext } from 'react';
import { View,Text, Button } from 'react-native';
import CategoryCard from '../components/CategoryCard';

import { CategoryContext } from '../models';
import { FlatList } from 'react-native-gesture-handler';

const CategoriesScreen = ({ navigation }) => {
  const { categories } = useContext(CategoryContext);

  return (
    <View style={{marginBottom:15, paddingBottom:10,justifyContent:'center'}}>
      <Button title="Add Category" onPress={() => navigation.navigate('newCategory')} />
      <FlatList  data={categories} keyExtractor={(item) => item.id} renderItem={({ item }) =><CategoryCard title={item.name} description={item.description} />} />
      
    </View>
  );
};

export default CategoriesScreen;