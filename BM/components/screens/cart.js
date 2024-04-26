// Example of GridView using FlatList in React Native
// https://aboutreact.com/example-of-gridview-using-flatlist-in-react-native/

import React, { useState, useContext, useEffect } from 'react';
import { Authorisation } from '../../context';
import uuid from "react-native-uuid"
import * as Styles from '../styles/styles';
import * as DB from './database';
import moment from 'moment';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';
export const db = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });
export const Cart = ({ navigation, route }) => {
  const [dataSource, setDataSource] = useState(null);
  const [choice, setChoice] = useState('usd');
  const { currentuser, client } = useContext(Authorisation);
  const [totalprice, setTotal] = useState(null);
  const [u, setu] = useState('green');
  const [b, setb] = useState('blue');
  const [e, sete] = useState('blue');
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
  const [locked, Lock] = useState(false);
  useEffect(() => {
    (async () => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Settings ORDER BY id DESC LIMIT 1;',
          [],
          (_, { rows }) => {
            setEco(rows.item(0).ecocash.toString());
            setBond(rows.item(0).bond.toString());

          },
        );
      }, null);
    })();
    setDataSource(route.params.productList);
    setTotal(route.params.totalprice);
  }, []);

  const saveThisTransaction = () => {
    let date = moment(new Date()).format('DD MMMM YYYY H:mma');
    console.log(JSON.stringify(dataSource));
    let data = { function: 'saveTransaction', data: { dataSource, totalprice, date,rid:uuid.v4(), user: currentuser.name } };
    if (client) {
      if (!locked) { Lock(true); client.write(JSON.stringify(data)); }
    }
    else if (!locked) { Lock(true); DB.saveTransaction(dataSource, totalprice, date, uuid.v4(),currentuser.name); }
    DB.updateclosingstock(); navigation.pop();
    navigation.push('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            setChoice('usd');
            setb('blue');
            sete('blue');
            setu('green');
          }}
          style={{ flex: 1 }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: u,
              fontWeight: 'bold',
              fontSize: 18,
              fontStyle: 'italic',
            }}
          >
            usd
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setChoice('bond');
            sete('blue');
            setu('blue');
            setb('green');
          }}
          style={{ flex: 1 }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: b,
              fontWeight: 'bold',
              fontSize: 18,
              fontStyle: 'italic',
            }}
          >
            bond
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setChoice('rtgs');
            setu('blue');
            setb('blue');
            sete('green');
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: e,
              fontWeight: 'bold',
              fontSize: 18,
              fontStyle: 'italic',
            }}
          >
            ecocash
          </Text>
        </TouchableOpacity>
      </View>
      {dataSource && (
        <FlatList
          data={dataSource}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.pop();
                navigation.push('Sale Products', {
                  dataSource: dataSource,
                  item: item,
                  totalprice: totalprice,
                });
              }}
              style={{
                flex: 1,
                flexDirection: 'column',
                borderColor: 'blue',
                borderWidth: 1,
                borderRadius: 5,
                margin: 2,
                paddingHorizontal: 3,
              }}
            >
              <View style={Styles.styles.flexRow}>
                <Text
                  style={{
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  {item.size}
                </Text>
              </View>
              <View style={Styles.styles.flexRow}>
                <Text
                  style={{
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  Quantity:
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    flex: 1,
                  }}
                >
                  {item.q.toString()}
                </Text>
              </View>
              <View style={Styles.styles.flexRow}>
                <Text
                  style={{
                    textAlign: 'center',
                    flex: 0.85,
                  }}
                >
                  Price:
                </Text>

                {choice === 'usd' && (
                  <Text
                    style={{
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    ${(parseInt(item.q) * parseFloat(item.price)).toFixed(2)}{' '}
                    usd
                  </Text>
                )}
                {choice === 'bond' && (
                  <Text
                    style={{
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    ${(parseFloat(item.price) * parseFloat(bond)).toFixed(2).toString()} bond
                  </Text>
                )}
                {choice === 'rtgs' && (
                  <Text
                    style={{
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    ${(parseInt(item.q) * parseFloat(item.price) * parseFloat(ecocash)).toFixed(2)} rtgs
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {totalprice && (
          <Text
            style={{
              flex: 0.65,
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
              alignSelf: 'center',
            }}
          >
            Total :
            {choice === 'usd' && (
              <Text
                style={{
                  fontWeight: 'bold',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                ${totalprice} usd
              </Text>
            )}
            {choice === 'bond' && (
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                ${(parseFloat(totalprice) * parseFloat(bond)).toFixed(2)} bond
              </Text>
            )}
            {choice === 'rtgs' && (
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                ${(parseFloat(totalprice) * parseFloat(ecocash)).toFixed(2)}  rtgs
              </Text>
            )}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          // backgroundColor: 'blue',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{

            flexWrap: 'wrap',
            padding: 5,

            borderWidth: .5, borderColor: 'blue', borderRadius: 20,
            marginVertical: 5,
            alignSelf: 'center',
            alignItems: 'center',
          }}
          onPress={() => saveThisTransaction()}
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
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
