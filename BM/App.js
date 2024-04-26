import React, { useState, useEffect, useContext, useMemo } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as DB from './components/screens/database';
import { SignIn } from './components/screens/signin';
import { CreateAccount } from './components/screens/signup'
import { ResetAccount } from './components/screens/resetaccount'
import { ClientScreen } from './components/screens/ClientScreen';
import { ServerScreen } from './components/screens/ServerScreen';
import { Product } from './components/screens/Product';
import { Expenses } from './components/screens/expenses';
import { Sales } from './components/screens/sales';
import { Splash } from './components/screens/splash';
import { Income } from './components/screens/incomes';
import { AdminSettings } from './components/screens/HomeSettings';
import { Sale } from './components/screens/sale';
import { Tockens } from './components/screens/Tockens';
import { Home } from './components/screens/Home';
import { AddExpenses } from './components/screens/addexpenses';
import { AddIncome } from './components/screens/addIncome';
import { Editproduct } from './components/screens/editproduct';
import { Products } from './components/screens/model';
import { ProfitandLoss } from './components/screens/profit&loss';
import { Editsale } from './components/screens/editsale';
import { Editcart } from './components/screens/editcart';
import { Cart } from './components/screens/cart';
import { MyHeaderRight } from './components/screens/headerRight';
import { Users } from './components/screens/users';
import { AsignRoles } from './components/screens/assignroles';
import { ChangePassword } from './components/screens/changepassword';
import { Roles } from './components/screens/roles';
import { Registration } from './components/screens/Registration';
let net = require('react-native-tcp');
import { Settings } from './components/screens/exchangerates';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Authentication, Authorisation } from './context';
import { LogBox, Text, useColorScheme, View, TouchableOpacity } from 'react-native';
import * as deviceinfo from 'react-native-device-info';
import { styles } from './components/styles/styles';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  "addStatement - parameter of type <object> converted to string using toString()", "ViewPropTypes will be removed from React Native",
  "new NativeEventEmitter",

]);
const Default = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backgroundColor: 'transparent',
  }
}

const Dark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    backgroundColor: 'transparent',
  }
}

const AuthTabs = createBottomTabNavigator();
const SettingsStack = createStackNavigator();
const EvaluationStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const Header = ({ name }) => <View><Text style={{
  color: 'white', fontWeight: 'bold', fontSize: 18

}}>{name} </Text></View>

const HomeStackScreen = () =>
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      elevation: 0,
      backgroundColor: 'black',
      borderBottomLeftRadius: 15, borderBottomRightRadius: 15, height: 40,
    }, headerTintColor: 'white',

  }}
   
  >

    <HomeStack.Screen name="Home" component={Home}  options={{
      headerRight: () => (<MyHeaderRight/>),
    }} />
    <HomeStack.Screen name="Add Expense" component={AddExpenses} options={{ headerTitle: () => <Header name="Add Expense" /> }} />
    <HomeStack.Screen name="Add Income" component={AddIncome} />
    <HomeStack.Screen name="Sale Products" component={Sale} />
    <HomeStack.Screen name="new product" component={Product} />
    <HomeStack.Screen name="Cart" component={Cart} />
    <HomeStack.Screen name="Expenses" component={Expenses} />
    <HomeStack.Screen name="Tockens" component={Tockens} />
    <HomeStack.Screen name="view products" component={Products} />
    <HomeStack.Screen name="Income" component={Income} />
    <HomeStack.Screen name="edit product" component={Editproduct} />
    <HomeStack.Screen name="Sold Products" component={Sales} />

    <HomeStack.Screen name="Edit Cart" component={Editcart} />
    <HomeStack.Screen name="Edit Sale" component={Editsale} options={{ title: 'Edit Reciept' }} />
    <HomeStack.Screen name="Profit and Loss account" component={ProfitandLoss} />
  </HomeStack.Navigator>;
const RegistrationScreen = () =>
  <HomeStack.Navigator >
    <HomeStack.Screen name="Registration" component={Registration} />
  </HomeStack.Navigator>;
const SettingsStackScreen = () => <SettingsStack.Navigator screenOptions={{
  headerStyle: {
    elevation: 0,
    backgroundColor: 'black',
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, height: 40,
  }, headerTintColor: 'white',
}}>
  <SettingsStack.Screen name='Settings' component={AdminSettings} />
  <SettingsStack.Screen name="Registration" component={Registration} />
  <SettingsStack.Screen name='Users' component={Users} />
  <SettingsStack.Screen name='rates' component={Settings} options={{ title: "Exchange rates" }} />
  <SettingsStack.Screen name="Client" component={ClientScreen} />
  <SettingsStack.Screen name="Server" component={ServerScreen} />
  <SettingsStack.Screen name='Change Password' component={ChangePassword} />
  <SettingsStack.Screen name='assignroles' component={AsignRoles} />
  <SettingsStack.Screen name='roles' component={Roles} options={{ title: "User groups" }} />
</SettingsStack.Navigator>;
const HomeTabsScreen = () => <Tabs.Navigator
  screenOptions={{
    headerShown: false,

    tabBarShowLabel: false,
    tabBarStyle: {
      showLabel: false,
      position: 'relative',
      backgroundColor: 'black',
      height: 40,
    }
  }}
>

  <Tabs.Screen name="HOME" component={HomeStackScreen} options={{
    tabBarLabel: '________', tabBarIcon: ({ color, size, focused }) => (<Icon name="home" color={(focused) ? 'blue' : 'white'}
      style={{
        borderRadius: 9,
        padding: 5, marginHorizontal: 12,
      }}
      size={size} />),
  }} />
  <Tabs.Screen name="SETTINGS" component={SettingsStackScreen} options={{
    tabBarLabel: '________', tabBarIcon: ({ color, size, focused }) => (<Icon name="cog" color={(focused) ? 'blue' : 'white'}
      style={{
        borderRadius: 9,
        padding: 5,
      }} size={size} />),
  }} />

  {/* <Tabs.Screen name="Evaluatio" component={EvaluationStackScreen} options={{
    tabBarLabel: 'EVALUATIONS', tabBarIcon: ({ color, size }) => (<Icon name="balance-scale" color={color} size={size * 0.8} />),
  }} /> */}
</Tabs.Navigator>;
const AuthTabsScreen = () => <AuthTabs.Navigator screenOptions={{
  // headerShown: false,
  headerStyle: {
    elevation: 0,
    backgroundColor: 'black',
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, height: 40,
  }, headerTintColor: 'white',
  tabBarShowLabel: false,
  tabBarStyle: {
    showLabel: false,
    position: 'absolute',
    // botton: 25,
    marginHorizontal: 50,
    // flex:1,
    elevation: 0,
    backgroundColor: 'black',
    // backgroundColor: 'transparent',
    shadowOpacity: 0,
    borderTopRightRadius: 115,
    borderTopLeftRadius: 115,
    // borderBottomLeftRadius: -3115,
    height: 40,
  }
}}>
  <AuthTabs.Screen name="createAccount" component={CreateAccount} options={{
    title: "Create Account", tabBarLabel: ' Create Account', tabBarIcon: ({ color, size }) => (<Icon name="plus" color={color} size={size * 0.8} />
    ),
  }} />
  <AuthTabs.Screen name="sign-in" component={SignIn} options={{
    tabBarLabel: 'signIn', tabBarIcon: ({ color, size }) => (<Icon name="user" color={color} size={size * 0.8} />),
  }} />
  <AuthTabs.Screen name="resetAccount" component={ResetAccount} options={{
    title: "Reset Account", tabBarLabel: ' Reset Account', tabBarIcon: ({ color, size }) => (<Icon name="lock" color={color} size={size * 0.8} />),
  }} />

</AuthTabs.Navigator>;

export default () => {
  const [currentuser, setcurrentuser] = useState(null);
  const [userroles, setuserroles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [AllowedUser, setAllowedUser] = useState(false);
  const scheme = useColorScheme();
  const [client, setClient] = useState(null);
  const [Try, setTry] = useState(true);
  const [Host, setHost] = useState(null);
  const [ip, setIp] = useState(null);
  const [clientip, setclientip] = useState('');
  const [severip, setseverip] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [FullName, setFullName] = useState('');
  const authentication = useMemo(() => {
    return {
      signIn: (username, password) =>
        DB.getuser(username, password).then(user => {
          if (user != null) {
            console.log(user);

            setcurrentuser(JSON.parse(user.user).user);
            setuserroles(JSON.parse(user.user).roles);
          }
        })
      , authorise: (v) => setAllowedUser(v)
      , createClient: async (ip) => {
        const client = await net.createConnection(6666, ip, () => {
          setseverip(ip);
          console.log('opened client on ' + client._address.address);
          setclientip(client._address.address)
        });

        client.on('data', (data) => {
          data = JSON.parse(data);
          console.log('client Received : ' + JSON.stringify(data.data));
          if (data['function'] === 'AddProduct') {
            DB.AddProduct(data.data);
          }
          else if (data['function'] === 'saveTransaction') {
            let { dataSource, totalprice, date, rid, user } = data.data;
            DB.saveTransaction(dataSource, totalprice, date, rid, user);
          }
          else if (data['function'] === 'cancelThisTransaction') {
            let { receptid } = data.data;
            DB.cancelThisTransaction(receptid);
          }
          else if (data['function'] === 'addOperation') {
            let { name, ucost, date, type, user, id } = data.data;
            DB.addOperation(name, ucost, date, type, user, id);
          }
          else if (data['function'] === 'correctAndSaveThisTransaction') {
            let { receptid, dataSource, totalprice } = data.data;
            DB.correctAndSaveThisTransaction(receptid, dataSource, totalprice);
          }
          else if (data['function'] === 'updateProduct') {
            let { barcode, name, size, cost, price, id } = data.data;
            DB.updateProduct(barcode, name, size, cost, price, id);
          }
          else if (data['function'] === 'saveSettings') {
            let { ecocash, bond, profitmargin } = data.data;
            DB.saveSettings(ecocash, bond, profitmargin);
          }
          else if (data['function'] === 'deleteProduct') {
            let { name, id } = data.data;
            DB.deleteProduct(name, id);
          }
          else if (data['function'] === 'delOperation') {
            let { description, id } = data.data;
            DB.deleteExpense(description, id);
          }
          else if (data['function'] === 'deleteUser') {
            let { name, id } = data.data;
            DB.deleteProduct(name, parseInt(id));
          }

        });
        client.on('error', (error) => {
          console.log('client error ' + error);
        });

        client.on('close', () => {
          console.log('client close');
        });
        setClient(client);
        return client;
      },
      signUp: (question, answer, newpassword1, newpassword2, username, newaccount) => {
        if (username.endsWith(' ')) {

          // username = username.substring(0, -1);
        }
        DB.createNewUser(question, answer, newpassword1, newpassword2, username, newaccount).then(user => {
          if (user != null) {
            // console.log(user);
            if (parseFloat(user.id) == 1) { DB.saveUserRoles(userroles, user, { id: 1, name: 'Admin' }) }
            DB.getuser(username, newpassword1).then(user => {
              if (user != null) {
                console.log(user);

                setcurrentuser(JSON.parse(user.user).user);
                setuserroles(JSON.parse(user.user).roles);
                // alert('qwerty');

              }
            })
          }
        })
      },
      signOut: () => {
        DB.logout().then(v => {

          setcurrentuser(null);
        });
      },
    }
  }, [])

  useEffect(() => {
    (async () => {
      await DB.Products();
      await DB.Settings();
      await DB.getCurrentUser().then((user) => {
        if (user != "null") {
          setcurrentuser(JSON.parse(user.user).user);
          setuserroles(JSON.parse(user.user).roles);
        }
      }).catch((e) => { })
      await DB.updateTrial(setFullName, setPhoneNumber, setTry).then(
        (r) => {
          setAllowedUser(r);
        })
      await tryapp();
      setIsLoading(false);
    })();

  }, []);
  const tryapp = () => {
    DB.db.transaction((tx) => {
      tx.executeSql(
        'Select * From owner WHERE 1',
        [],
        (_, { rows }) => {
          if (rows.length == 0) {
            deviceinfo.getDeviceName().then((deviceName) => {
              let dvc = { 'UniqueId': deviceinfo.getUniqueId(), FullName: FullName, activated: false, paid: null, date: new Date(), period: 7, PhoneNumber: PhoneNumber, 'deviceName': deviceName }
              DB.Register(dvc).then((id) => {
                setAllowedUser(true);
              })
            })
          }
        }
      )
    })

  };
  if (isLoading) {
    return <Splash />;
  }
  return (
    <Authentication.Provider value={authentication}>
      <Authorisation.Provider value={{ currentuser, userroles, ip, setIp, clientip, severip, client, setClient, Host, setHost }}>
        {!AllowedUser ? <NavigationContainer>
          {/* {!AllowedUser ? <NavigationContainer theme={(scheme === 'dark') ? Dark : Default}> */}
          {/* {!AllowedUser ? <NavigationContainer theme={ Dark }> */}
          <RegistrationScreen />
        </NavigationContainer> : <NavigationContainer >
          {/* </NavigationContainer> : <NavigationContainer theme={(scheme === 'dark') ? Dark : Dark}> */}
          {/* </NavigationContainer> : <NavigationContainer theme={ Dark }> */}
          {currentuser ?
            <HomeTabsScreen />
            :
            <AuthTabsScreen />}
        </NavigationContainer>}
      </Authorisation.Provider>
    </Authentication.Provider >
  );
}
