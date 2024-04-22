import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AddCategory from './src/components/Category';
import {AddProduct} from './src/screens/Product';
import Categories from './src/screens/Categories';
import Products from './src/screens/Products'; // Import Products
import {useColorScheme} from 'react-native';
import 'react-native-get-random-values';
import {useEffect, useState} from 'react';
import Realm from 'realm';
import {
  Category,
  Product,
  Stock,
  ProductDetail,
  Customer,
  Purchase,
  PurchaseItem,
  CategoryContext,
} from './src/models';

const Stack = createStackNavigator();

const App = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const scheme = useColorScheme();
  let realm = new Realm({
    schema: [
      Category,
      Product,
      Stock,
      ProductDetail,
      Customer,
      Purchase,
      PurchaseItem,
    ],
  });

  useEffect(() => {
    const ncategories = realm.objects('Category');
    const nproducts = realm.objects('Product');
    setCategories([...ncategories]);
    setProducts([...nproducts]);
    return () => {
      realm.close();
    };
  }, []);

  return (
    <CategoryContext.Provider value={{categories, setCategories,products, setProducts , realm: realm}}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="Categories" component={Categories} />
          <Stack.Screen name="newCategory" component={AddCategory} />
          <Stack.Screen name="newProduct" component={AddProduct} />
        </Stack.Navigator>
      </NavigationContainer>
    </CategoryContext.Provider>
  );
};

export default App;
