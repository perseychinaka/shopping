import React, { useContext } from 'react';
import { View } from 'react-native';
import {AddFab} from '../components/fab';
import ProductComponent from '../components/Product';
import { CategoryContext } from '../models';
import { FlatList } from 'react-native-gesture-handler';


const ProductsScreen = ({ navigation }) => {
  const { products } = useContext(CategoryContext);

  return (
    
    <View style={{flex: 1, justifyContent: 'center'}}>
        <FlatList
        data={products}
        renderItem={({ item }) => <ProductComponent id={item.id} name={item.name} description={item.description} category={item.category.name} />}
        keyExtractor={item => item.id}
        numColumns={2}
      />
<AddFab navigation={navigation} />
    </View>
  );
};



export default ProductsScreen;