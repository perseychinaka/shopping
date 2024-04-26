import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import * as DB from './database';
import { ScreenContainer, styles } from '../styles/styles';
import { Authorisation } from '../../context';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
export const AdminSettings = ({ navigation }) => {
  const [activated, setactivated] = useState(false);
  const { Host } = useContext(Authorisation);

  useEffect(() => {
    DB.db.transaction((tns) => {
      tns.executeSql(
        'Select * From owner WHERE 1',
        [],
        (_, { rows }) => {
          if (rows.item(0).paid === 'Fully Paid') setactivated(true);
        },
        e => alert(JSON.stringify(e))

      );

    }, null);
  }, []);


  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomColor: 'blue', borderBottomWidth: .5, margin: 4 }}>
        <TouchableOpacity
          style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
          onPress={() => navigation.push('Users')}>
          <Icon color="blue" name="user" style={{ margin: 4, fontSize: 18, flex: .1 }}  ></Icon>
          <Text style={{ margin: 4, fontSize: 18 }} >Users</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomColor: 'blue', borderBottomWidth: .5, margin: 4 }}>
        <TouchableOpacity
          style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
          onPress={() => navigation.push('roles')}>
          <Icon color="blue" name="users" style={{ margin: 4, fontSize: 18, flex: .1 }}  ></Icon>
          <Text style={{ margin: 4, fontSize: 18 }} >User groups</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomColor: 'blue', borderBottomWidth: .5, margin: 4 }}>
        <TouchableOpacity
          style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
          onPress={() => navigation.push('rates')}>
          <Icon color="blue" name="cog" style={{ margin: 4, fontSize: 18, flex: .1 }}  ></Icon>
          <Text style={{ margin: 4, fontSize: 18 }} >Exchange rates settings</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomColor: 'blue', borderBottomWidth: .5, margin: 4 }}>

        <TouchableOpacity
          style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
          onPress={() => navigation.push('Change Password')}>
          <Icon color="blue" name="lock" style={{ margin: 4, paddingHorizontal: 4, fontSize: 18, flex: .1 }}  ></Icon>
          <Text style={{ margin: 4, fontSize: 18 }} >Change password</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomColor: 'blue', borderBottomWidth: .5, margin: 4 }}>
        {!activated && <TouchableOpacity
          style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
          onPress={() => navigation.push('Registration')}>
          <Icon color="blue" name="tags" style={{ margin: 4, fontSize: 18, flex: .1 }}  ></Icon>
          <Text style={{ margin: 4, fontSize: 18 }} >Activate</Text>
        </TouchableOpacity>}
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomColor: 'blue', borderBottomWidth: .5, margin: 4 }}>

        <TouchableOpacity
          style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
          onPress={() => navigation.push('Client')}>
          <Icon color="blue" name="share" style={{ margin: 4, paddingHorizontal: 4, fontSize: 18, flex: .1 }}  ></Icon>
          <Text style={{ margin: 4, fontSize: 18 }} >Client</Text>
        </TouchableOpacity>
      </View>

      {Host ? <View style={{ flexDirection: 'row', justifyContent: "center", margin: 4, alignItems: "center" }}>
        <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: "bold", color: "white", marginHorizontal: 5 }} >Scan to connect</Text>
        <Text style={{ padding: 15, backgroundColor: "white", marginHorizontal: 5 }} >
          <QRCode
            style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
            value={Host}
          />
        </Text></View> :
        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderBottomColor: 'blue', borderBottomWidth: .5, margin: 4 }}>
          <TouchableOpacity
            style={(styles.homebutton, { flex: 1, alignItems: 'center', margin: 5, flexDirection: 'row' })}
            onPress={() => navigation.push('Server')}>
            <Icon color="blue" name="share" style={{ margin: 4, paddingHorizontal: 4, fontSize: 18, flex: .1 }}  ></Icon>
            <Text style={{ margin: 4, fontSize: 18 }} >Create server</Text>
          </TouchableOpacity>
        </View>}

    </ScreenContainer>
  );
};