import React, { useState, useContext } from 'react';
import { Button, TextInput, View } from 'react-native';
import { ProductsContext } from '../context';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../models';
import BarcodeScanner from 'react-native-barcode-scanner-google';

export const AddProductScreen = ({ navigation }) => {
  const { setProducts, realm } = useContext(ProductsContext);
  const [product, setProduct] = useState({ name: '', price: '', quantity: '', size: '', cost: '', barcode: '' });

  const addProduct = () => {
    realm.write(() => {
      realm.create('Product', { category: Category, id: uuidv4(), ...product, expiry_date: moment(new Date()) });
      setProducts([...realm.objects('Product')]);
    });
    navigation.goBack();
  };

  const onBarcodeRead = ({ data }) => setProduct({ ...product, barcode: data });

  return (
    <View>
      {['name', 'price', 'quantity', 'size', 'cost', 'barcode'].map(field => (
        <TextInput
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={product[field]}
          onChangeText={value => setProduct({ ...product, [field]: value })}
          keyboardType={['price', 'cost', 'quantity'].includes(field) ? 'numeric' : 'default'}
        />
      ))}
      <BarcodeScanner onBarcodeRead={onBarcodeRead} />
      <Button title="Add Product" onPress={addProduct} />
    </View>
  );
};
