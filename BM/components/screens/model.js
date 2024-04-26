import * as DB from './database';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert, Modal,
  Text, TextInput,
  TouchableOpacity,
  FlatList, Dimensions,
  Image,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Splash } from './splash'
import { ScreenContainer, styles } from '../styles/styles';
import React, { useState, useContext, useEffect } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useIsFocused } from "@react-navigation/native";
import { Authorisation } from '../../context';
import { FAB } from 'react-native-paper';
const db = DB.db;

export const Products = ({ navigation }) => {
  const [totalcost, setTotal] = useState(null);
  const [scan, setScan] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [name, setName] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [choice, setChoice] = useState('usd');
  const [u, setu] = useState('green');
  const [b, setb] = useState('blue');
  const [e, sete] = useState('blue');
  const [product, setProduct] = useState('');
  const [scanned, setScanned] = useState(false);
  const [popup, setPopup] = useState(false);
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const { userroles, client } = useContext(Authorisation);
  const [locked, Lock] = useState(false);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused)
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
        userroles.reduce((prev, { name }) => { if ('Can approve' == name) setIsAuthorised(true) }, 0);
        DB.getAllProducts(setDataSource);
        // .then((data=>setDataSource(data)));
      })();
  }, [{}, isFocused]);

  const getdata = (k, v) => {
    (async () => {
      if (k == 'name') {
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
          tx.executeSql(
            'SELECT * FROM Products where ' +
            k +
            ' LIKE "%' +
            v +
            '%" OR size LIKE "%' +
            v +
            '%"  ORDER BY name ASC ;',
            [],
            (_, { rows }) => {
              let len = rows.length;
              let rws = []
              for (let i = 0; i < len; i++) {
                let row = rows.item(i);
                rws.push(row);
              }


              setDataSource(rws);
              let tc = rws.reduce((prev, { price, remaining }) => {
                return prev + parseFloat(price) * parseFloat(remaining);
              }, 0);
              // let etc = tc * parseFloat(Ecocash);
              // let btc = tc * parseFloat(Bond);
              setTotal({ utc: tc });
            },
          );
        });
      } else {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM Products where ' + k + ' LIKE "%' + v + '%" ;',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                setScan(true);
                setScanned(false);
              } else {
                setPrdct(rows.item(0));
                setPopup(true);
              }
            },
          );
        });
      }
    })();
  };
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScan(false);
    setBarcode(data);
    getdata('barcode', data);
  };
  if (!dataSource) {
    return <Splash />;
  }
  const { width, height } = Dimensions.get('screen');
  return (
    <ScreenContainer><View style={[styles.flexcontainer, { flex: 0.9, width: width, height: height, marginTop: -40 }]}>
      {scan ? (
        <View style={(styles.lcontainer, { flex: 1 })}>
          <QRCodeScanner
            onRead={scanned ? undefined : handleBarCodeScanned}
            flashMode={RNCamera.Constants.FlashMode.torch}
            bottomContent={
              <View style={(styles.flexRow, {
                alignItems: 'center',
                marginTop: 55,
              })}>
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
                      color: 'black',
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
        </View>
      ) : (<SafeAreaView style={styles.lcontainer}>
        <Modal
          animationType="fade"
          transparent={true}
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          visible={modalVisible}
          onRequestClose={() => {
            setPopup(false);
          }}
        ><ScreenContainer><View
          style={{
            flex: .41,
            borderColor: 'green',
            borderRadius: 5,
            borderWidth: .5,
            backgroundColor: 'white',
            alignContent: 'center',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        ><View
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '90%',
          }}
        ><View style={[styles.flexRow, { justifyContent: 'center' }]}>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Name</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{product.name}</Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Size</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{product.size}</Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Cost</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{product.cost}</Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Remaining</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{product.remaining}</Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Price</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{product.price}</Text>
            </View>
            <View style={styles.flexRow}>
              <Text onPress={() => setModalVisible(!modalVisible)} style={[styles.homebutton, { color: 'blue', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Cancel</Text>
              <Text onPress={() => {
                setModalVisible(!modalVisible); if (isAuthorised) {
                  if (client) {
                    let data = { function: 'deleteProduct', data: { name: product.name, id: product.id } };
                    client.write(JSON.stringify(data));
                  }
                  else DB.deleteProduct(product.name, product.id);
                }
                else alert('You are not authorised to do this.\n You need permission so that you can Aprove');
                DB.getAllProducts(setDataSource);
                // navigation.pop();
                // navigation.push('view products');
              }} style={[styles.homebutton, { color: 'blue', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Delete</Text>
              <Text onPress={() => {
                setModalVisible(!modalVisible); navigation.pop();
                navigation.push('edit product', {
                  item: product
                });
              }} style={[styles.homebutton, { color: 'blue', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Edit</Text>
            </View>

          </View>
        </View></ScreenContainer>
        </Modal>
        <View style={{ backgroundColor: 'white', borderTopEndRadius: 15, borderTopLeftRadius: 15 }}>


          <View style={styles.flexRow}>

            <TextInput
              onChangeText={(name) => {
                setName(name);
                getdata('name', name);
              }}
              placeholderTextColor="#0dcaf0" placeholder="search here or just scan"
              value={name}
              underlineColorAndroid="#0dcaf0"
              style={styles.input}
            />

            {!barcode ? (
              <TouchableOpacity
                style={styles.barcode}

                onPress={() => setScan(true)}
              >
                <Text
                  style={{
                    color: 'black',
                    // marginLeft: 5,
                    fontWeight: 'bold',
                    fontSize: 18,
                    fontStyle: 'italic',
                  }}
                >Scan</Text>
              </TouchableOpacity>
            ) : null}
          </View>
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
                  color: 'black',
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
                  color: 'black',
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
                  color: 'black',
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
          </View></View>
        {dataSource && (
          <FlatList
            style={{
              flex: 1,

              marginTop: 5,
              // paddingHorizontal: 3,
            }} data={dataSource}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setProduct(item); setModalVisible(true)  // Alert.alert('Product', '' + item.name, [
                  //   {
                  //     text: 'Cancel',
                  //     onPress: () => console.log('Cancel Pressed'),
                  //     style: 'cancel',
                  //   },
                  //   {
                  //     text: 'delete', style: 'destructive',
                  //     onPress: () => {

                  //       if (isAuthorised) {
                  //         if (client) {
                  //           let data = { function: 'deleteProduct', data: { name: item.name, id: item.id } };
                  //           client.write(JSON.stringify(data));
                  //         }
                  //         else DB.deleteProduct(item.name, item.id);
                  //       }
                  //       else alert('You are not authorised to do this.\n You need permission so that you can Aprove');
                  //       DB.getAllProducts(setDataSource);
                  //       // navigation.pop();
                  //       // navigation.push('view products');
                  //     },
                  //   },
                  //   {
                  //     text: 'change',
                  //     onPress: () => {
                  //       //  alert(JSON.stringify(item) ) ;
                  // navigation.pop();
                  // navigation.push('edit product', {
                  //   item: item
                  // });
                  //     },
                  //   },
                  // ]);
                }}
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  flexDirection: 'column',
                  borderColor: 'blue',
                  borderWidth: 1,
                  borderRadius: 5,
                  margin: 2,
                  paddingHorizontal: 3,
                }}
              >
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',

                  }}
                >
                  Name:  {item.name}
                </Text>

                {item.size !== '' && (
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',

                    }}
                  >
                    Size:    {item.size}
                  </Text>
                )}
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',

                  }}
                >
                  {item.quantity} ordered
                </Text>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',

                  }}
                >
                  {item.remaining} remaining
                </Text>
                {choice === 'usd' && (
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',

                    }}
                  >
                    ${item.price} usd
                  </Text>
                )}
                {choice === 'bond' && (
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',

                    }}
                  >
                    ${(parseFloat(item.price) * parseFloat(bond)).toFixed(2)} bond
                  </Text>
                )}
                {choice === 'rtgs' && (
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',

                    }}
                  >
                    ${(parseFloat(item.price) * parseFloat(ecocash)).toFixed(2)} rtgs
                  </Text>
                )}
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={2}
            keyExtractor={(item, index) => index}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {totalcost && (
            <Text
              style={{
                flex: 0.65,
                fontWeight: 'bold',
                fontSize: 18,
                color: 'black',
                textAlign: 'center',

                alignSelf: 'center',
              }}
            >
              Stock value :
              {choice === 'usd' && (
                <Text
                  style={{
                    fontWeight: 'bold',
                    flex: 1,
                    color: 'black',
                    textAlign: 'center',

                  }}
                >
                  ${totalcost.utc.toFixed(2)} usd
                </Text>
              )}
              {choice === 'bond' && (
                <Text
                  style={{
                    flex: 1,
                    color: 'black',
                    textAlign: 'center',

                  }}
                >
                  ${(parseFloat(totalcost.utc) * parseFloat(bond)).toFixed(2)} bond
                </Text>
              )}
              {choice === 'rtgs' && (
                <Text
                  style={{
                    flex: 1,
                    color: 'black',
                    textAlign: 'center',

                  }}
                >
                  ${(parseFloat(totalcost.utc) * parseFloat(ecocash)).toFixed(2)} rtgs
                </Text>
              )}
            </Text>
          )}
        </View>
      </SafeAreaView>
      )}
      <View style={[styles.flexRow, { justifyContent: 'center', marginBottom: 15 }]}>
        <TouchableOpacity onPress={() => navigation.push('new product')}>
          <FAB icon='plus' />
        </TouchableOpacity>
      </View>
    </View>
    </ScreenContainer>
  );
};
