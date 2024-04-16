import { NavigationContainer,DefaultTheme,DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddProductScreen from './src/screens/Product';
import Products from './src/screens/Products';
import { useColorScheme } from 'react-native';
import 'react-native-get-random-values';
import  { useEffect, useState } from 'react';
import Realm from 'realm';
import { Category, Product, Stock, ProductDetail, Customer, Purchase, PurchaseItem } from './src/models';
import { ProductsContext } from './src/context';
const Stack = createStackNavigator();

const App = () => {
  
const [products, setProducts] = useState([]);
const scheme = useColorScheme();
let  realm = new Realm({ schema: [Category, Product, Stock, ProductDetail, Customer, Purchase, PurchaseItem] });

useEffect(() => {

  const nproducts = realm.objects('Product');
  setProducts([...nproducts]); // Spread the results into a new array

  return () => {
    realm.close();
  };
}, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts ,realm:realm}}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductsContext.Provider>
    );
};

export default App;