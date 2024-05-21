import React, {useState, useContext} from 'react';
import {Button, TextInput, View} from 'react-native';
import {CategoryContext} from '../models';
import {Picker} from '@react-native-picker/picker';

export const AddProduct = ({navigation}) => {
  const {realm, categories, products,setProducts} = useContext(CategoryContext);
  const [product, setProduct] = useState({name: '', description: '', category: categories[0] || null});

  const addProduct = () => {
    realm.write(() => {
      const newProduct = realm.create('Product', {id: Math.random().toString(), ...product});
      setProduct({name: '', description: '',category: categories[0] || null });
      setProducts([...products, newProduct]);
      navigation.goBack();
    });
  };

  return (
    <View>
      <TextInput placeholder="Product Name" value={product.name} onChangeText={text => setProduct({...product, name: text})} />
      <TextInput placeholder="Product Description" value={product.description} onChangeText={text => setProduct({...product, description: text})} />
      {/* <Picker selectedValue={product.category.id} onValueChange={itemValue => setProduct({...product, category: categories.find(category => category.id === itemValue)})}>
        {categories.map(category => <Picker.Item key={category.id} label={category.name} value={category.id} />)}
      </Picker> */}
      <Button title="Add Product" onPress={addProduct} />
    </View>
  );
};

export const editProduct = ({navigation, route}) => {
  const {realm, categories, products, setProducts} = useContext(CategoryContext);
  const {product: initialProduct} = route.params;
  const [product, setProduct] = useState(initialProduct);

  const editProduct = () => {
    realm.write(() => {
      realm.create('Product', product, Realm.UpdateMode.Modified);
      setProducts([...products]);
      navigation.goBack();
    });
  };

  return (
    <View>
      <TextInput placeholder="Product Name" value={product.name} onChangeText={text => setProduct({...product, name: text})} />
      <TextInput placeholder="Product Description" value={product.description} onChangeText={text => setProduct({...product, description: text})} />
      <Picker selectedValue={product.category.id} onValueChange={itemValue => setProduct({...product, category: categories.find(category => category.id === itemValue)})}>
        {categories.map(category => <Picker.Item key={category.id} label={category.name} value={category.id} />)}
      </Picker>
      <Button title="Edit Product" onPress={editProduct} />
    </View>
  );
}
export const viewProduct = ({navigation, route}) => {
  const {product} = route.params;

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>{product.description}</Text>
      <Text>{product.category.name}</Text>
    </View>
  );
}