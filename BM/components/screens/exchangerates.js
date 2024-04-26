import React, { useState, useContext, useEffect } from 'react';
import { Text, TextInput, View,ToastAndroid, TouchableOpacity, Alert } from 'react-native';
import { styles, ScreenContainer } from '../styles/styles';
import { Authorisation } from '../../context';
import * as DB from './database';

const db = DB.db;
export const Settings = ({ navigation }) => {
  const [ecocash, setEco] = useState(0);
  const { userroles, currentuser, client } = useContext(Authorisation);
  const [locked, Lock] = useState(false);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [bond, setBond] = useState(0);
  const [profitmargin, setProfitmargin] = useState(0);
  useEffect(() => {
    userroles.reduce((prev, { name }) => { if ('Can approve' == name) setIsAuthorised(true) }, 0);
    db.transaction((tx) => {
      tx.executeSql(
        'create table if not exists Settings(id integer primary key not null,profitmargin float,bond float,ecocash float);',
      );
      tx.executeSql(
        'SELECT * FROM Settings ORDER BY id ASC LIMIT 1;',
        [],
        (_, { rows }) => {
          //   console.log(rows);
          //   alert(JSON.stringify(rows.item(0)
          //     ));
          setEco(rows.item(0).ecocash.toString());
          setBond(rows.item(0).bond.toString());
          setProfitmargin(rows.item(0).profitmargin.toString());
        },
      );
    });
  }, []);

  const saveSettings = () => {
    if (isAuthorised) {
      if (client) {
        let data = { function: 'saveSettings', data: { ecocash, bond, profitmargin } };
        if (!locked) { Lock(true); client.write(JSON.stringify(data)); }
      }
      else {
        DB.saveSettings(ecocash, bond, profitmargin);
      }
    }
    else {

      ToastAndroid.showWithGravity('You are not authorised to make any changes here,\n You may need to talk to your admin',
      ToastAndroid.LONG,
              ToastAndroid.CENTER)    }
    navigation.goBack();

  };
  return (
    <ScreenContainer>
      <View style={{ backgroundColor: 'white', borderRadius: 9, paddingHorizontal: 15 }}>
        <View style={[styles.flexRow, { width: "90%", justifyContent: 'center', alignItems: "baseline" }]}>
          <Text
            style={{
              flex: 1, fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Bond/USD
          </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={(bond) => {
              setBond(bond);
            }}
            placeholderTextColor="#0dcaf0" placeholder="amount of Bond required per USD $1"
            value={bond.toString()}
            underlineColorAndroid="#0dcaf0"
            style={[styles.input2, { flex: 2 }]}
          />
        </View>
        <View style={[styles.flexRow, { width: "90%", justifyContent: 'center', alignItems: "baseline" }]}>
          <Text
            style={{
              flex: 1, fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Ecocash/USD
          </Text>
          <TextInput
            onChangeText={(eco) => {
              setEco(eco);
            }}
            multiline={true} keyboardType="numeric"
            placeholderTextColor="#0dcaf0" placeholder="amount of rtgs required per USD $1 "
            underlineColorAndroid="#0dcaf0"
            style={[styles.input2, { flex: 2 }]}
            value={ecocash.toString()}
          />
        </View>
        <View style={[styles.flexRow, { width: "90%", justifyContent: 'center', alignItems: "baseline" }]}>
          <Text
            style={{
              fontWeight: 'bold',
              flex: 1, alignSelf: 'center',
            }}
          >
            Profit margin
          </Text>
          <View style={{ flexDirection: 'row', flex: 2 }}>
            <TextInput
              onChangeText={(profit) => {
                setProfitmargin(profit);
              }}
              multiline={true} keyboardType="numeric"
              placeholderTextColor="#0dcaf0" placeholder=" profit percentage  "
              underlineColorAndroid="#0dcaf0"
              style={[styles.input2, { flex: 2 }]}
              value={profitmargin.toString()}
            />
            <Text style={{ textAlignVertical: 'bottom', paddingBottom: 5, fontSize: 20, fontWeight: 'bold' }}>%</Text></View></View>
        <View style={(styles.flexRow, { alignItems: 'center' })}>
          <TouchableOpacity
            style={{

              flexWrap: 'wrap',
              padding: 5,

              borderWidth: .5, borderColor: 'blue', borderRadius: 20,
              marginVertical: 5,
              alignItems: 'center',
            }}
            onPress={() => saveSettings()}
          >
            <Text
              style={{
                color: 'blue',
                fontWeight: 'bold',
                textAlign: 'center',
                marginHorizontal: 5,
                fontSize: 28,
                fontStyle: 'italic',
              }}
            >
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};


