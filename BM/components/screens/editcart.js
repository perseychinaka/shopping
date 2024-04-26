
import React, { useState, useContext, useEffect } from 'react';
import { Authorisation } from '../../context';
import { styles, ScreenContainer } from '../styles/styles';
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
import * as DB from './database';
const db = DB.db;

export const Editcart = ({ navigation, route }) => {
  const [dataSource, setDataSource] = useState(null);
  const [choice, setChoice] = useState('usd');
  const [totalprice, setTotal] = useState(null);
  const [u, setu] = useState('green');
  const [b, setb] = useState('blue');
  const [locked, Lock] = useState(false);
  const [e, sete] = useState('blue');
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const { userroles, client } = useContext(Authorisation);

  const [receptid, setreceptid] = useState(null);
  useEffect(() => {
    userroles.reduce((prev, { name }) => { if ('Can sale products' == name) setIsAuthorised(true) }, 0);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Settings ORDER BY id DESC LIMIT 1;',
        [],
        (_, { rows }) => {
          setEco(rows.item(0).ecocash);
          setBond(rows.item(0).bond);
        }, e => alert(JSON.stringify(e))
      );
    })
    setDataSource(route.params.productList);
    setTotal(route.params.total);
  }, []);
  const cancelThisTransaction = () => {
    if (client) {
      let data = { function: 'cancelThisTransaction', data: { receptid: route.params.receptid } };
      if (!locked) { Lock(true); client.write(JSON.stringify(data)); }
    } else if (!locked) { Lock(true); DB.cancelThisTransaction(route.params.receptid); }
    navigation.pop();
    navigation.pop();
    navigation.push('Sold Products');
  };
  const correctAndSaveThisTransaction = () => {
    console.log(JSON.stringify(dataSource));
    if (client) {
          // let { dataSource, totalprice, time, receiptId, name } = data.data;
      let data = { function: 'correctAndSaveThisTransaction', data: { receptid: route.params.receptid, dataSource, totalprice } };
      if (!locked) { Lock(true); client.write(JSON.stringify(data)); }
    } else {
      DB.correctAndSaveThisTransaction(route.params.receptid, dataSource, totalprice);
    }
    navigation.pop();
    navigation.pop();
    navigation.push('Sold Products');
  };

  return (
    // <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }} >{isAuthorised ?
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'white',
    }}>
      <Text>{receptid}</Text>
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
                navigation.push('Edit Sale', {
                  dataSource: dataSource,
                  receptid: route.params.receptid,
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
              <View style={styles.flexRow}>
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
              <View style={styles.flexRow}>
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
              <View style={styles.flexRow}>
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
                    ${(parseInt(item.q) * parseFloat(item.price) * parseFloat(bond)).toFixed(2).toString()}
                    bond
                  </Text>
                )}
                {choice === 'rtgs' && (
                  <Text
                    style={{
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    ${(parseInt(item.q) * parseFloat(item.price) * parseFloat(ecocash)).toFixed(2)}
                    rtgs
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
                ${parseFloat(bond) * parseFloat(totalprice).toFixed(2)} bond
              </Text>
            )}
            {choice === 'rtgs' && (
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                ${parseFloat(ecocash) * parseFloat(totalprice).toFixed(2)} rtgs
              </Text>
            )}
          </Text>
        )}
      </View>
      {isAuthorised && <View
        style={{
          flexDirection: 'row',
          marginBottom: 45,
          // backgroundColor: 'blue',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            // 
            flexWrap: 'wrap',
            padding: 5,

            borderWidth: .5, borderColor: 'blue', borderRadius: 20,
            marginVertical: 5,
            alignSelf: 'center',
            alignItems: 'center',
          }}
          onPress={() => cancelThisTransaction()}
        >
          <Text
            style={{
              color: 'red',
              fontWeight: 'bold',
              textAlign: 'center',
              marginHorizontal: 5,
              fontSize: 28,
              fontStyle: 'italic',
            }}
          >
            undo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            // 
            flexWrap: 'wrap',
            padding: 5,

            borderWidth: .5, borderColor: 'blue', borderRadius: 20,
            marginVertical: 5,
            alignSelf: 'center',
            alignItems: 'center',
          }}
          onPress={() => correctAndSaveThisTransaction()}
        >
          <Text
            style={{
              color: 'green',
              fontWeight: 'bold',
              textAlign: 'center',
              marginHorizontal: 5,
              fontSize: 28,
              fontStyle: 'italic',
            }}
          >
            save
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            // 
            flexWrap: 'wrap',
            padding: 5,

            borderWidth: .5, borderColor: 'blue', borderRadius: 20,
            marginVertical: 5,
            alignSelf: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.pop();
          }}
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
            back
          </Text>
        </TouchableOpacity>
      </View>}
    </SafeAreaView>

  );
};


