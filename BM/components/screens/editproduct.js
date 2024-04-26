import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Authorisation } from '../../context';
import * as DB from './database';
import {
  StyleSheet,
  Text,
  TextInput,
  View,ToastAndroid,
  Image,
  TouchableOpacity,
  PickerIOSComponent,
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });

import { ScreenContainer, styles } from '../styles/styles';

export const Editproduct = ({ navigation, route }) => {
  const [quantity, setQuantity] = useState(0);
  const [barcode, setBarcode] = useState(null);
  const [price, setuPrice] = useState(0.0);
  const [bprice, setBPrice] = useState(0.0);
  const [eprice, setEPrice] = useState(0.0);
  const [size, setSize] = useState('');
  const [id, setId] = useState('');
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
  const [profitmargin, setProfitmargin] = useState(0);
  const [prevQ, setprevQ] = useState(0);
  const [remaining, setremaining] = useState(0);
  const [qd, setqd] = useState(0);
  const [cost, setCost] = useState(0);
  const [pcost, setpCost] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [name, setName] = useState(null);
  const [scan, setScan] = useState(false);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const { userroles, client } = useContext(Authorisation);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        userroles.reduce((prev, { name }) => { if ('Can add new product' == name) setIsAuthorised(true) }, 0);
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM Settings ORDER BY id DESC LIMIT 1;',
            [],
            (_, { rows }) => {

              setEco(rows.item(0).ecocash.toString());
              setBond(rows.item(0).bond.toString());
              setProfitmargin(rows.item(0).profitmargin);
              // alert(JSON.stringify(route.params) );
              // console.log(route.params.item.);
              setBarcode(route.params.item.barcode);
              setName(route.params.item.name);
              setuPrice(route.params.item.price);
              setBPrice(parseFloat(route.params.item.price) * parseFloat(rows.item(0).bond));
              setQuantity(route.params.item.remaining);
              setremaining(route.params.item.remaining);
              setCost(route.params.item.cost);
              setEPrice(parseFloat(route.params.item.price) * parseFloat(rows.item(0).ecocash));
              setSize(route.params.item.size);
              setId(route.params.item.id);
              setprevQ(route.params.item.remaining);
            }, e => alert(JSON.stringify(e))
          );
          tx.executeSql(
            'SELECT * FROM Purchases ORDER BY id DESC LIMIT 1;',
            [],
            (_, { rows }) => {
              setpCost(rows.item(0).cost.toString());
            },
          );
        }, null);

        userroles.reduce((prev, { name }) => { if ('Can add new product' == name) setIsAuthorised(true) }, 0);

      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScan(false);
    setBarcode(data);
    // console.log(barcode);
  };

  const saveProduct = async () => {
    // console.log(route.params.item);
    // DB.updateProduct(
    //   barcode,
    //   name,
    //   size,
    //   cost,
    //   price,
    //   id,
    // ).then(r => {
    //   ;
    let data = { function: 'updateProduct', data: { barcode, name, size, cost, price, id, } };
    if (client) { client.write(JSON.stringify(data)); }
    else {
      DB.updateProduct(barcode, name, size, cost, price, id).then((r) => {
        ToastAndroid.showWithGravity(r,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER);}
      );
    }
    navigation.goBack();
  };
  return (
    <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'center', flex: 1 }} >{isAuthorised ?
      <View style={{
        flex: .65, justifyContent: 'center', alignItems: 'center', width: '98%', alignSelf: 'center',
        borderColor: 'green', borderRadius: 5, borderWidth: .5
      }}>
        {scan && (
          <View style={(styles.container, { flex: 1 })}>
            <QRCodeScanner
              onRead={scanned ? undefined : handleBarCodeScanned}
              flashMode={RNCamera.Constants.FlashMode.torch}
              bottomContent={
                <View style={(styles.flexRow, { alignItems: 'center' })}>
                  <TouchableOpacity
                    onPress={() => {
                      setScan(false);
                      setScanned(false);
                    }}
                    style={{

                      flexWrap: 'wrap',
                      padding: 5,

                      borderWidth: .5, borderColor: 'blue', borderRadius: 20,
                      margin: 5,
                      alignItems: 'center',
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
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            /> </View>
        )}
        {!scan && (
          <View>
            <View style={(styles.container, styles.flexRow)}>
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                Barcode :
              </Text>
              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row-reverse',
                  // flex: 1,
                }}
              >
                {barcode && (
                  <View
                    style={
                      (styles.flexRow,
                      {
                        flexDirection: 'row',
                        flex: 1,
                      })
                    }
                  >
                    <Text
                      style={{
                        //  fontWeight: 'bold',
                        borderBottomColor: 'blue',
                        borderBottomWidth: 1,
                        alignSelf: 'flex-start',
                        flex: 1,
                      }}
                    >
                      {barcode}
                    </Text>
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                        flex: 1,
                      }}
                      onPress={() => {
                        setScan(true);
                        setScanned(false);
                      }}
                    >
                      <Text style={{ color: 'blue', fontStyle: 'italic' }}>
                        Rescan
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {!barcode && (
                  <TouchableOpacity
                    style={{
                      paddingTop: 5,
                      flex: 0.73,
                      alignItems: 'center',
                    }}
                    onPress={() => setScan(true)}
                  >
                    <Text
                      style={{
                        color: 'blue',
                        // marginLeft: 5,
                        fontWeight: 'bold',
                        fontSize: 18,
                        fontStyle: 'italic',
                      }}
                    >
                      Scan barcode
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.flexRow}>
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                Name :
              </Text>
              <TextInput
                onChangeText={(name) => setName(name)}
                placeholderTextColor="#0dcaf0" placeholder="product discription"
                value={name}
                underlineColorAndroid="#0dcaf0"
                style={[styles.input, {}]}
              />
            </View>
            <View style={styles.flexRow}>
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                Quantity :
              </Text>
              <TextInput
                onChangeText={(Quantity) => {
                  setQuantity(Quantity);
                  setqd(Quantity - parseFloat(route.params.item.remaining));
                }}
                keyboardType="numeric"
                placeholderTextColor="#0dcaf0" placeholder="sum of products "
                underlineColorAndroid="#0dcaf0"
                editable={false}
                style={[styles.input,]}
                value={quantity.toString()}
              />
            </View>
            <View style={styles.flexRow}>
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                Size :
              </Text>
              <TextInput
                onChangeText={(size) => setSize(size)}
                placeholderTextColor="#0dcaf0" placeholder="size"
                value={size}
                underlineColorAndroid="#0dcaf0"
                style={[styles.input,]}
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
              <TextInput
                onChangeText={(cost) => {
                  setCost(cost);
                  let newprice = parseFloat(cost * (1 + profitmargin / 100));
                  setuPrice(newprice.toFixed(2).toString());
                  setBPrice((newprice * parseFloat(bond)).toFixed(2).toString());
                  setEPrice((newprice * parseFloat(ecocash)).toFixed(2).toString());
                }}
                keyboardType="numeric"
                placeholderTextColor="#0dcaf0" placeholder="ordering price"
                underlineColorAndroid="#0dcaf0"
                style={[styles.input,]}
                value={cost.toString()}
              />
            </View>
            <View style={styles.flexRow}>
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                Price :
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
                  onChangeText={(price) => {
                    setuPrice(price);
                    setBPrice(
                      (parseFloat(price) * parseFloat(bond))
                        .toFixed(2)
                        .toString(),
                    );
                    setEPrice(
                      (parseFloat(price) * parseFloat(ecocash))
                        .toFixed(2)
                        .toString(),
                    );
                  }}
                  underlineColorAndroid="#0dcaf0"
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="price of product "
                  style={(styles.input, { paddingBottom: 5, textAlign: 'center', color: 'black' })}

                  value={price.toString()}
                />
                <Text
                  style={{
                    textAlign: 'center',
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
                  onChangeText={(bprice) => {
                    setBPrice(bprice);
                    setuPrice(
                      (parseFloat(bprice) / parseFloat(bond))
                        .toFixed(2)
                        .toString(),
                    );
                    setEPrice(
                      (
                        (parseFloat(bprice) / parseFloat(bond)) *
                        parseFloat(ecocash)
                      )
                        .toFixed(2)
                        .toString(),
                    );
                  }}
                  keyboardType="numeric"
                  underlineColorAndroid="#0dcaf0"
                  placeholderTextColor="#0dcaf0" placeholder="newprice of product "
                  style={(styles.input, { paddingBottom: 5, textAlign: 'center', color: 'black' })}
                  value={bprice.toString()}
                />
                <Text
                  style={{
                    textAlign: 'center',
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
                  onChangeText={(eprice) => {
                    setEPrice(eprice);
                    setuPrice(
                      (parseFloat(eprice) / parseFloat(ecocash))
                        .toFixed(2)
                        .toString(),
                    );
                    setBPrice(
                      (
                        (parseFloat(eprice) / parseFloat(ecocash)) *
                        parseFloat(bond)
                      )
                        .toFixed(2)
                        .toString(),
                    );
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="price of product "
                  style={(styles.input, { paddingBottom: 5, textAlign: 'center', color: 'black' })}

                  underlineColorAndroid="#0dcaf0"
                  value={eprice.toString()}
                />
                <Text
                  style={{
                    textAlign: 'center',
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
                onPress={() => saveProduct()}
              >
                <Text
                  style={{
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
        )}
      </View> : <ScreenContainer>
        <Text style={{
          backgroundColor: 'yellow', borderRadius: 5, margin: 5, padding: 5
        }}>You are not authorised to go to the this screen. {'\n'}
          You are required to have permissions so that you {'can add and edit product'} </Text>
      </ScreenContainer>}
    </View>
  );
};
