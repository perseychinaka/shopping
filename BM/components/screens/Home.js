import React, { useState, useContext, useEffect } from 'react';
import { PermissionsAndroid, Text, Image, View, Button, TouchableOpacity } from 'react-native';
import { Authentication, Authorisation } from '../../context';
import * as DB from './database';
import { TabsStackScreen } from '../../App'
import { Registration } from './Registration'
import { Avatar } from 'react-native-elements'
import { ScreenContainer, styles } from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
export const Home = ({ navigation }) => {
  const [activated, setactivated] = useState(false);
  const { userroles, currentuser } = useContext(Authorisation);
  const [Group, setGroup] = useState();
  const { signOut } = useContext(Authentication)

  useEffect(() => {
    // (async () => {
    
    // })();
    DB.db.transaction((t) => {
      t.executeSql(
        'SELECT * FROM `groups` WHERE (`id`=?);',
        [currentuser.group],
        (_, { rows }) => {
          setGroup(rows.item(0).name);
        },
        (er) => {
          alert(JSON.stringify(er));
          resolve(null);

        },
      );

    }, null);
  }, []);


  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>

      <ScreenContainer>
        {/* <Text>{JSON.stringify(userroles)}</Text> */}
        
        <View style={{ flexDirection: 'row', alignContent: 'space-around', margin: 5 }}>
          <TouchableOpacity
            style={styles.homebutton1}
            onPress={() => navigation.push('view products')}
          >
            <Avatar
              size={50}
              ImageComponent={() => <Image
                style={[styles.stretch, { tintColor: 'white' }]}
                source={require('../assets/newgoods.png')}
              />}
            /><Text style={styles.homebuttonlabel}>Stock</Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homebutton1} onPress={() => navigation.push('Sale Products')}
          >
            <Avatar
              size={50}
              ImageComponent={() => <Image
                style={styles.stretch}
                source={require('../assets/sale.png')}
              />}
            /><Text style={styles.homebuttonlabel}>Sale Products</Text>
          </TouchableOpacity>


        </View>

        <View style={{ flexDirection: 'row', alignContent: 'space-around', margin: 5 }}>
          <TouchableOpacity
            style={styles.homebutton1}
            onPress={() => navigation.push('Expenses')}
          ><Avatar
              size={50}
              ImageComponent={() => <Image
                style={styles.stretch}
                source={require('../assets/pay.png')}
              />}
            />
            <Text style={styles.homebuttonlabel}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homebutton1}
            onPress={() => navigation.push('Sold Products')}
          ><Avatar
              size={50}
              ImageComponent={() => <Image
                style={styles.stretch}
                source={require('../assets/receipt.png')}
              />}
            />
            <Text style={styles.homebuttonlabel}>Reciepts</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.homebutton1}
            onPress={() =>
              navigation.push('Add Income')
            }
          >
            <Avatar
              size={50}
              ImageComponent={() => <Image
                style={styles.stretch}
                source={require('../assets/paid.png')}
              />}
            /><Text style={styles.homebuttonlabel}>Add income</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{ flexDirection: 'row', margin: 5 }}>
          <TouchableOpacity
            style={styles.homebutton1}
            onPress={() => navigation.push('Income')}
          >
            <Avatar
              size={50}
              ImageComponent={() => <Image
                style={styles.stretch}
                source={require('../assets/cash.png')}
              />}
            />
            <Text style={styles.homebuttonlabel}>Income</Text>
          </TouchableOpacity>





          <TouchableOpacity
            style={styles.homebutton1}
            onPress={() => navigation.push('Profit and Loss account')}
          >
            <Avatar
              size={50}
              ImageComponent={() => <Image
                style={styles.stretch}
                source={require('../assets/pnl.png')}
              />}
            /><Text style={styles.homebuttonlabel}>Profit & Loss </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer></View>
  );

};
