import React, { useState, useContext } from 'react';
import { Button, TextInput, View } from 'react-native';
import { CategoryContext } from '../models';

const AddCategoryScreen = () => {
  const { setCategories, realm } = useContext(CategoryContext);
  const [category, setCategory] = useState({ id: '', name: '', description: '' });

  const addCategory = () => {
    realm.write(() => {
      const newCategory = realm.create('Category', category);

      // If you have a state for categories, you can update it here
      setCategories(prevCategories => [...prevCategories, newCategory]);
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Category ID"
        value={category.id}
        onChangeText={(value) => setCategory(prevState => ({ ...prevState, id: value }))}
      />
      <TextInput
        placeholder="Category Name"
        value={category.name}
        onChangeText={(value) => setCategory(prevState => ({ ...prevState, name: value }))}
      />
      <TextInput
        placeholder="Category Description"
        value={category.description}
        onChangeText={(value) => setCategory(prevState => ({ ...prevState, description: value }))}
      />
      <Button title="Add Category" onPress={addCategory} />
    </View>
  );
};

export default AddCategoryScreen;