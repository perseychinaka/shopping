
import React, { useState, useEffect } from 'react';
import * as DB from './database';
const db = DB.db;

// import all the components we are going to use
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

export const Sales = ({ navigation }) => {
  const [dataSource, setDataSource] = useState(null);
  const [data, setData] = useState(null);
  const [choice, setChoice] = useState('usd');
  const [u, setu] = useState('green');
  const [b, setb] = useState('blue');
  const [e, sete] = useState('blue');
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
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
          (e) => alert('err' + JSON.stringify(e))
        );
      
      }, null);
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT name,price,remaining,size,sales.quantity as q,receipt.id,sales.total as stotal,receipt.total as total,doneby,time'
          + ' FROM activitylog inner join receipt on activityId=activitylog.id inner join sales on receiptId=receipt.id Inner Join productStatus on prdStatusId = productStatus.id inner join products on productId= products.id',
          [],
          (_, { rows }) => {
            let data = [];
            let len = rows.length;
            let rws = []
            for (let i = 0; i < len; i++) {
              let row = rows.item(i);
              rws.push(row);
            }
            setDataSource(rws);
          });
      });
    })();
  }, []);
  const getDetails = (item) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT *,sales.quantity as q FROM receipt inner join sales on receiptId=receipt.id  Inner Join productStatus on prdStatusId = productStatus.id inner join products on productId= products.id where receipt.id=?',
        [item.id],
        (_, { rows }) => {
          let len = rows.length;
          let rws = []
          for (let i = 0; i < len; i++) {
            let row = rows.item(i);
            rws.push(row);
          }
          // alert(JSON.stringify(item))
          navigation.push('Edit Cart', {
            receptid: item.id,
            productList: rws,
            total:item.total,
          });
         
        }, e => alert(JSON.stringify(e)))
    });
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
                getDetails(item);
              }}
              style={{
                flex: 1,
                flexDirection: 'column',
                // borderColor: 'blue',
                borderWidth: 1,
                borderRadius: 5,
                margin: 2,
                paddingHorizontal: 3,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                {item.time}
              </Text>
              {choice === 'usd' && (
                <Text
                  style={{
                    textAlign: 'center',
                  }}
                >
                  ${item.total} usd
                </Text>
              )}
              {choice === 'bond' && (
                <Text
                  style={{
                    textAlign: 'center',
                  }}
                >
                  ${(parseFloat(item.total) * parseFloat(bond)).toFixed(2)} bond
                </Text>
              )}
              {choice === 'rtgs' && (
                <Text
                  style={{
                    textAlign: 'center',
                  }}
                >
                  ${(parseFloat(item.total) * parseFloat(ecocash)).toFixed(2)} rtgs
                </Text>
              )}
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={2}
          keyExtractor={(item, index) => index}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'white',
  },
});
