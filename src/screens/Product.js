import React, { useState,useContext } from 'react';
import { Button, TextInput, View } from 'react-native';
import {ProductsContext} from '../context'
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../models';
const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const { setProducts,realm } = useContext(ProductsContext);

  const addProduct = () => {
     
    realm.write(() => {
     
      const newProduct = realm.create('Product', {
        category: Category,
        id: uuidv4(),
        quantity: 10,
        price: 9.99,
        size: 'Large',
        cost: 5.00,
        barcode: '1234567890',
        expiry_date: moment(new Date()),
      });
      realm.create('Product', newProduct);
      
      setProducts([...realm.objects('Product')]);
    });
   
     navigation.goBack();
  };
  return (
    <View>
      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Product Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Add Product" onPress={addProduct} />
    </View>
  );
};

export default AddProductScreen;