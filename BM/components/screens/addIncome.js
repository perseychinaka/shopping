import moment from 'moment';
import { Authorisation } from '../../context';
import React, { useState, useContext, useEffect } from 'react';
import uuid from "react-native-uuid"
import * as DB from './database';
const db = DB.db;
import {
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { ScreenContainer, styles } from '../styles/styles';
import { Splash } from './splash'

export const AddIncome = ({ navigation, route }) => {
  const [ucost, setucost] = useState(0.0);
  const [bcost, setBcost] = useState(0.0);
  const [ecost, setEcost] = useState(0.0);
  const [isLoading, setIsLoading] = useState(true);
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
  const [name, setName] = useState(null);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [locked, Lock] = useState(false);
  const { userroles, currentuser,severip, client,clientip } = useContext(Authorisation);


  useEffect(() => {
    (async () => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Settings ORDER BY id DESC LIMIT 1;',
          [],
          (_, { rows }) => {
            // console.log(rows);
            setEco(rows.item(0).ecocash.toString());
            setBond(rows.item(0).bond.toString());
          },
        );
      }, null);
      userroles.reduce((prev, { name }) => { if ('Can add new expenses' == name) setIsAuthorised(true) }, 0);

      setIsLoading(false);
    })();
  }, []);

  const saveExpense = async () => {
    let date = moment(new Date()).format('DD MMMM YYYY');
    // description, value, date,type,user
    if (client) {
      let data = { function: 'addOperation', data: { name, ucost, date, type: 'Income',id:await uuid.v4(), user: currentuser.name },clientip,severip };
      if (!locked) { Lock(true); client.write(JSON.stringify(data)); }
    }
    else DB.addOperation(name, ucost, date, 'Income', currentuser.name,uuid.v4()).then(r => {
      if ((typeof (r)).toString().toLowerCase() == 'number') {
        navigation.goBack();
        ToastAndroid.showWithGravity(name + '  income saved successfully',
        ToastAndroid.SHORT,
                ToastAndroid.CENTER)
}
      else alert("there has been an error saving data");
    });
    navigation.goBack();

  };

  if (isLoading) {
    return <Splash />;
  }
  return (

    <ScreenContainer>
      <View style={

        {
          alignContent: 'center', flexDirection: 'column'
          , width: '90%', borderColor: 'green', borderRadius: 5
          , backgroundColor: 'white'
          , borderWidth: .5, padding: 5, justifyContent: 'center'
        }
      }>{isAuthorised ?
        <View
          style={

            { alignContent: 'center', justifyContent: 'center' }
          }
        >
          <View style={(styles.container, styles.flexRow)}>
            <Text
              style={{
                fontWeight: 'bold',
                alignSelf: 'center',
              }}
            >
              Income :
            </Text>
            <TextInput
              onChangeText={(name) => setName(name)}
              placeholderTextColor="#0dcaf0" placeholder=" discription"
              value={name}
              underlineColorAndroid="#0dcaf0"
              style={styles.input}
            />
          </View>
          <View style={styles.flexRow}>
            <Text
              style={{
                fontWeight: 'bold',
                alignSelf: 'center',
              }}
            >
              Cost :
            </Text>
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'space-around',
              }}
            >
              <TextInput
                onChangeText={(ucost) => {
                  setucost(ucost);
                  setBcost(
                    (parseFloat(ucost) * parseFloat(bond)).toFixed(2).toString(),
                  );
                  setEcost(
                    (parseFloat(ucost) * parseFloat(ecocash)).toFixed(2).toString(),
                  );
                }}
                underlineColorAndroid="#0dcaf0"
                keyboardType="numeric"
                placeholderTextColor="#0dcaf0" placeholder="ucost of product "
                 style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}
                value={ucost.toString()}
              />
              <Text
                style={{
                  alignSelf: 'center',
                }}
              >
                usd
              </Text>
            </View>

            <View
              style={{
                alignSelf: 'center',
                alignItems: 'stretch',
                justifyContent: 'space-around',
              }}
            >
              <TextInput
                onChangeText={(bcost) => {
                  setBcost(bcost);
                  setucost(
                    (parseFloat(bcost) / parseFloat(bond)).toFixed(2).toString(),
                  );
                  setEcost(
                    ((parseFloat(bcost) / parseFloat(bond)) * parseFloat(ecocash))
                      .toFixed(2)
                      .toString(),
                  );
                }}
                keyboardType="numeric"
                underlineColorAndroid="#0dcaf0"
                placeholderTextColor="#0dcaf0" placeholder="cost of product "
                 style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}
                value={bcost.toString()}
              />
              <Text
                style={{
                  alignSelf: 'center',
                }}
              >
                bond
              </Text>
            </View>

            <View
              style={{
                alignSelf: 'center',
                alignItems: 'stretch',
                flex: 1,
                justifyContent: 'space-around',
              }}
            >
              <TextInput
                onChangeText={(ecost) => {
                  setEcost(ecost);
                  setucost(
                    (parseFloat(ecost) / parseFloat(ecocash)).toFixed(2).toString(),
                  );
                  setBcost(
                    ((parseFloat(ecost) / parseFloat(ecocash)) * parseFloat(bond))
                      .toFixed(2)
                      .toString(),
                  );
                }}
                keyboardType="numeric"
                placeholderTextColor="#0dcaf0" placeholder="ucost of product "
                 style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}
                underlineColorAndroid="#0dcaf0"
                value={ecost.toString()}
              />
              <Text
                style={{
                  alignSelf: 'center',
                }}
              >
                rtgs
              </Text>
            </View>
          </View>
          <View style={(styles.flexRow, { alignItems: 'center' })}>
            <TouchableOpacity
              style={{

                flexWrap: 'wrap',
                padding: 5,

                borderWidth: .5, borderColor: 'blue', borderRadius: 20,
                marginVertical: 5,
                alignItems: 'center',
              }}
              onPress={() => saveExpense()}
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
        </View> : <View>
          <Text style={{
            backgroundColor: 'yellow', borderRadius: 5, margin: 5, padding: 5
          }}>You are not authorised to go to the this screen. {'\n'}
            You are required to have permissions so that you {'can add new expenses'} </Text>
        </View>}</View></ScreenContainer>);
};
