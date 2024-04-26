import React, { useState, useContext, useEffect } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import * as DB from './database';
import { Authorisation } from '../../context';
import uuid from "react-native-uuid"
import moment from 'moment';
import { Text, TextInput, View, TouchableOpacity, } from 'react-native';
import { ScreenContainer, styles } from '../styles/styles';
const db = DB.db;
export const Product = ({ navigation, route }) => {
  const [quantity, setQuantity] = useState(1);
  const [barcode, setBarcode] = useState(null);
  const [price, setuPrice] = useState(0.0);
  const [bprice, setBPrice] = useState(0.0);
  const [choice, setChoice] = useState('usd');
  const [eprice, setEPrice] = useState(0.0);
  const [size, setSize] = useState('');
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
  const [profitmargin, setProfitmargin] = useState(0);
  const [cost, setCost] = useState(0);
  const [ecost, seteCost] = useState(0);
  const [bcost, setbCost] = useState(0);
  const [tcost, settCost] = useState(0);
  const [etcost, setetCost] = useState(0);
  const [btcost, setbtCost] = useState(0);
  const [u, setu] = useState('green');
  const [b, setb] = useState('blue');
  const [e, sete] = useState('blue');
  const [scanned, setScanned] = useState(false);
  const [name, setName] = useState(null);
  const [scan, setScan] = useState(false);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const { userroles, currentuser, client } = useContext(Authorisation);

  useEffect(() => {
    (async () => {
      // deviceinfo.getBuildId().then((deviceToken) => {
      //   // iOS: "a2Jqsd0kanz..."
      //   deviceinfo.getDeviceName().then((androidId) => {
      //     alert(deviceinfo.getUniqueId() + '\n' + androidId + '\n' + deviceToken + '\n' + deviceinfo.getDeviceId())
      //     // androidId here
      //   });
      // });
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Settings ORDER BY id DESC LIMIT 1;',
          [],
          (_, { rows }) => {
            // console.log(rows.item(0));
            setEco(rows.item(0).ecocash.toString());
            setBond(rows.item(0).bond.toString());
            setProfitmargin(rows.item(0).profitmargin);
          }, e => alert(JSON.stringify(e))
        );
      }, null);
      userroles.reduce((prev, { name }) => { if ('Can add new product' == name) setIsAuthorised(true) }, 0);
      DB.updateOpeningStock();
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScan(false);
    setBarcode(data);
  };

  const saveProduct = async () => {
    let date = moment(new Date()).format('DD MMMM YYYY');

    let data = { function: 'AddProduct', data: { barcode, name, quantity, size, cost, price, date,id:uuid.v4(), user: currentuser.name } };
    if (client) { client.write(JSON.stringify(data)); }
    else {
      DB.AddProduct({ barcode, name, quantity, size, cost, price, date,id:uuid.v4(), user: currentuser.name });
    }
    navigation.goBack();

  };
  return (
    <View style={{ flex: 1 }} >{isAuthorised ?
      <ScreenContainer>

        {scan ?
          <View style={{
            justifyContent: 'center', alignItems: 'center', width: '98%', alignSelf: 'center',
            borderColor: 'green', borderRadius: 5, borderWidth: .5, backgroundColor: 'white'
          }}><QRCodeScanner
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
            />
          </View> :
          <View style={{
            width: '98%', alignSelf: 'center',
            borderColor: 'green', borderRadius: 5, borderWidth: .5, backgroundColor: 'white'
          }}><View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
              <Text
                style={styles.label}

              >
                Barcode :
              </Text>
              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row-reverse',
                  flex: 1,
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
                      <Text style={{ color: 'green', color: 'blue', fontStyle: 'italic' }}>
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
                      Scan bar-code
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
              <Text
                style={styles.label}

              >
                Name :
              </Text>
              <TextInput
                onChangeText={(name) => setName(name)}
                placeholderTextColor="#0dcaf0" placeholder="product discription"
                value={name}
                underlineColorAndroid="#0dcaf0"
                style={styles.input}
              />
            </View>
            <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
              <Text
                style={styles.label}

              >
                Quantity :
              </Text>
              <TextInput
                onChangeText={(Quantity) => {
                  if (Quantity) {
                    setQuantity(Quantity);
                    if (tcost > 0) {
                      settCost(
                        (parseFloat(tcost) * parseInt(Quantity))
                          .toFixed(2)
                          .toString(),
                      );
                      setbtCost(
                        (parseFloat(tcost) * parseFloat(bond) * parseInt(Quantity))
                          .toFixed(2)
                          .toString(),
                      );
                      //  alert(etcost)
                      setetCost(
                        (parseFloat(tcost) * parseFloat(ecocash) * parseInt(Quantity))
                          .toFixed(2)
                          .toString(),
                      );
                    }
                  } else {
                    settCost(0);
                    setetCost(0);
                    setbtCost(0);
                    setQuantity(Quantity);
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor="#0dcaf0" placeholder="sum of products "
                underlineColorAndroid="#0dcaf0"
                                 style={styles.input}

                value={quantity.toString()}
              />
            </View>
            <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
              <Text
                style={styles.label}

              >
                Size :
              </Text>
              <TextInput
                onChangeText={(size) => setSize(size)}
                placeholderTextColor="#0dcaf0" placeholder="size"
                value={size}
                underlineColorAndroid="#0dcaf0"
                style={styles.input}
              />
            </View>
            <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
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

            <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
              <Text
                style={styles.label}

              >
                Total cost :
              </Text>
              {choice === 'usd' && (
                <TextInput
                  onChangeText={(tcost) => {
                    if (tcost) {
                      let ucost = parseFloat(tcost) / quantity;
                      let bcost = parseFloat(bond) * ucost;
                      let ecost = parseFloat(ecocash) * ucost;
                      settCost(tcost);
                      setetCost(parseFloat(tcost) * ecocash);
                      setbtCost(parseFloat(tcost) * bond);
                      setCost(ucost.toFixed(2).toString());
                      seteCost(ecost.toFixed(2).toString());
                      setbCost(bcost.toFixed(2).toString());
                      let price = parseFloat(ucost * (1 + profitmargin / 100));

                      setuPrice(price.toFixed(2).toString());
                      setBPrice((price * parseFloat(bond)).toFixed(2).toString());
                      setEPrice(
                        (price * parseFloat(ecocash)).toFixed(2).toString(),
                      );
                    } else {
                      settCost(tcost);
                      setbCost(tcost);
                      seteCost(tcost);
                      setetCost(tcost);
                      setbtCost(tcost);
                      setuPrice(tcost);
                      setEPrice(tcost);
                      setBPrice(tcost);
                      setCost(tcost);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="ordering price"
                  underlineColorAndroid="#0dcaf0"
                                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

                  value={tcost.toString()}
                />
              )}
              {choice === 'bond' && (
                <TextInput
                  onChangeText={(btcost) => {
                    setbtCost(btcost);
                    if (btcost) {
                      //  unit costs
                      let bcost = parseFloat(btcost) / quantity;
                      let ucost = parseFloat(bcost) / bond;
                      let ecost = ucost * ecocash;
                      setCost(ucost.toFixed(2).toString());
                      seteCost(ecost.toFixed(2).toString());
                      setbCost(bcost.toFixed(2).toString());
                      // total costs
                      let utcost = parseFloat(btcost) / bond;
                      let etcost = utcost * ecocash;
                      settCost(utcost.toFixed(2).toString());
                      setetCost(etcost.toFixed(2).toString());
                      // prices
                      let price = parseFloat(ucost * (1 + profitmargin / 100));

                      setuPrice(price.toFixed(2).toString());
                      setBPrice((price * parseFloat(bond)).toFixed(2).toString());
                      setEPrice(
                        (price * parseFloat(ecocash)).toFixed(2).toString(),
                      );
                    } else {
                      settCost(btcost);
                      setbCost(btcost);
                      seteCost(btcost);
                      setetCost(btcost);
                      setbtCost(btcost);
                      setuPrice(btcost);
                      setEPrice(btcost);
                      setBPrice(btcost);
                      setCost(btcost);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="ordering price"
                  underlineColorAndroid="#0dcaf0"
                                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

                  value={btcost.toString()}
                />
              )}
              {choice === 'rtgs' && (
                <TextInput
                  onChangeText={(tcost) => {
                    setetCost(tcost);
                    if (tcost) {
                      let ucost =
                        parseFloat(tcost) / quantity / parseFloat(ecocash);
                      let bcost = ucost * parseFloat(bond);
                      let ecost = ucost * parseFloat(ecocash);
                      let btcost = (parseFloat(tcost) * ecocash) / bond;
                      let utcost = parseFloat(tcost) / ecocash;
                      settCost(utcost.toFixed(2).toString());
                      setbtCost(btcost.toFixed(2).toString());
                      setCost(ucost.toFixed(2).toString());

                      seteCost(ecost.toFixed(2).toString());
                      setbCost(bcost.toFixed(2).toString());
                      let price = parseFloat(ucost * (1 + profitmargin / 100));
                      setuPrice(price.toFixed(2).toString());
                      setBPrice((price * parseFloat(bond)).toFixed(2).toString());
                      setEPrice(
                        (price * parseFloat(ecocash)).toFixed(2).toString(),
                      );
                    } else {
                      settCost(tcost);
                      setbCost(tcost);
                      seteCost(tcost);
                      setetCost(tcost);
                      setbtCost(tcost);
                      setuPrice(tcost);
                      setEPrice(tcost);
                      setBPrice(tcost);
                      setCost(tcost);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="ordering price"
                  underlineColorAndroid="#0dcaf0"
                                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

                  value={etcost.toString()}
                />
              )}
              <Text
                style={styles.label}

              >
                unit cost :
              </Text>
              {choice === 'usd' && (
                <TextInput
                  onChangeText={(cost) => {
                    setCost(cost);
                    if (cost) {
                      let bcst = parseFloat(cost) * parseFloat(bond);
                      let ecst = parseFloat(cost) * parseFloat(ecocash);
                      seteCost(ecst.toFixed(2));
                      setbCost(bcst.toFixed(2));
                      let tcst = parseFloat(cost) * quantity;
                      let btcst = tcst * parseFloat(bond);
                      let etcst = tcst * parseFloat(ecocash);
                      setetCost(etcst.toFixed(2));
                      setbtCost(btcst.toFixed(2));

                      settCost(tcst.toFixed(2).toString());
                      let price = parseFloat(cost * (1 + profitmargin / 100));
                      setuPrice(price.toFixed(2).toString());
                      setBPrice((price * parseFloat(bond)).toFixed(2).toString());
                      setEPrice(
                        (price * parseFloat(ecocash)).toFixed(2).toString(),
                      );
                    } else {
                      settCost(cost);
                      setbCost(cost);
                      seteCost(cost);
                      setetCost(cost);
                      setbtCost(cost);
                      setuPrice(cost);
                      setEPrice(cost);
                      setBPrice(cost);
                      setCost(cost);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="ordering price"
                  underlineColorAndroid="#0dcaf0"
                                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

                  value={cost.toString()}
                />
              )}
              {choice === 'bond' && (
                <TextInput
                  onChangeText={(cost) => {
                    setbCost(cost);
                    if (cost) {
                      let ucst = parseFloat(cost) / parseFloat(bond);
                      let ecst = ucst * parseFloat(ecocash);
                      seteCost(ecst.toFixed(2));
                      setCost(ucst.toFixed(2));

                      let tbcst = parseFloat(cost) * quantity;
                      let tcst = tbcst / parseFloat(bond);
                      let tecst = tcst * parseFloat(ecocash);
                      settCost(tcst.toFixed(2).toString());
                      setbtCost(tbcst.toFixed(2).toString());
                      setetCost(tecst.toFixed(2).toString());
                      cost = cost / parseFloat(bond);
                      let price = parseFloat(cost * (1 + profitmargin / 100));
                      setuPrice(price.toFixed(2).toString());
                      setBPrice((price * parseFloat(bond)).toFixed(2).toString());
                      setEPrice(
                        (price * parseFloat(ecocash)).toFixed(2).toString(),
                      );
                    } else {
                      settCost(cost);
                      setbCost(cost);
                      seteCost(cost);
                      setetCost(cost);
                      setbtCost(cost);
                      setuPrice(cost);
                      setEPrice(cost);
                      setBPrice(cost);
                      setCost(cost);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="ordering price"
                  underlineColorAndroid="#0dcaf0"
                                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

                  value={bcost.toString()}
                />
              )}
              {choice === 'rtgs' && (
                <TextInput
                  onChangeText={(cost) => {
                    seteCost(cost);
                    if (cost) {
                      setbCost(
                        (
                          (parseFloat(cost) / parseFloat(ecocash)) *
                          parseFloat(bond)
                        ).toFixed(2),
                      );
                      setCost(
                        (parseFloat(cost) / parseFloat(ecocash)).toFixed(2),
                      );
                      // set total costs
                      let etcost = parseFloat(cost) * quantity;
                      let utcost = etcost / parseFloat(ecocash);
                      let btcost = utcost * parseFloat(bond);
                      setetCost(etcost.toFixed(2).toString());
                      setbtCost(btcost.toFixed(2).toString());
                      settCost(utcost.toFixed(2).toString());

                      let eprice = parseFloat(cost * (1 + profitmargin / 100));
                      setEPrice(parseFloat(eprice).toFixed(2).toString());
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
                    } else {
                      settCost(cost);
                      setbCost(cost);
                      seteCost(cost);
                      setetCost(cost);
                      setbtCost(cost);
                      setuPrice(cost);
                      setEPrice(cost);
                      setBPrice(cost);
                      setCost(cost);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="ordering price"
                  underlineColorAndroid="#0dcaf0"
                                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

                  value={ecost.toString()}
                />
              )}
            </View>
            <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
              <Text
                style={styles.label}

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
                    if (price) {
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
                    } else {
                      setuPrice(price);
                      setEPrice(0);
                      setBPrice(0);
                    }
                  }}
                  underlineColorAndroid="#0dcaf0"
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="price of product "
                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

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
                    if (bprice) {
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
                    } else {
                      setuPrice(0);
                      setEPrice(0);
                      setBPrice(bprice);
                    }
                  }}
                  keyboardType="numeric"
                  underlineColorAndroid="#0dcaf0"
                  placeholderTextColor="#0dcaf0" placeholder="price of product "
                  style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}
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
                    if (eprice) {
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
                    } else {
                      setuPrice(0);
                      setEPrice(eprice);
                      setBPrice(0);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#0dcaf0" placeholder="price of product "
                                   style={ {color:'black', textAlign: 'center', paddingBottom: 5 }}

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
            <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  flexWrap: 'wrap',
                  padding: 5,
                  borderWidth: .5,
                  borderColor: 'blue',
                  borderRadius: 20,
                  marginVertical: 5,
                  alignItems: 'center',
                }}
                onPress={() => saveProduct()}
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
        }
      </ScreenContainer> : <ScreenContainer>
        <Text style={{
          color: 'green',
          backgroundColor: 'yellow', borderRadius: 5, margin: 5, padding: 5
        }}>You are not authorised to go to the this screen. {'\n'}
          You are required to have permissions so that you {'can add and edit product'} </Text>
      </ScreenContainer>}
    </View>
  );
};
