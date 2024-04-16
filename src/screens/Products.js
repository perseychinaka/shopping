import React, { useEffect, useState,useContext } from 'react';
import { Button, FlatList, View } from 'react-native';
import Realm from 'realm';
import { v4 as uuidv4 } from 'uuid';
import ProductComponent from '../components/Product'; // Import the Product component
import {Product} from '../models';
import { ProductsContext } from '../context';

const ProductsScreen = ({ navigation }) => {
  const { products, setProducts ,realm} = useContext(ProductsContext);
  useEffect(() => {

    // Query the list of all products
    const products = realm.objects('Product');
    setProducts([...products]); // Spread the results into a new array

    return () => {
      // Remember to close the realm when finished.
      realm.close();
    };
  }, []);

  const navigateToAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  return (
    <View>
      <Button title="Add Product" onPress={navigateToAddProduct} />
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductComponent id={item.id} name={item.name} price={item.price} />}
        keyExtractor={item => item.id}
        numColumns={2} // Display 2 products in a row
      />
    </View>
  );
};

export default ProductsScreen;