import { openDatabase } from 'react-native-sqlite-storage';
export const db = openDatabase({ name: 'shop.db', createFromLocation: '~data.sqlite' });
import React, { useState, useContext, useEffect } from 'react';
import { Authorisation } from '../../context';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  FlatList,
  Button,
  Image,
  Modal,
  TouchableOpacity,
  PickerIOSComponent,
} from 'react-native';
import { ScreenContainer, styles } from '../styles/styles';

export const Sale = ({ navigation, route }) => {
  const [barcode, setBarcode] = useState(null);
  const [choice, setChoice] = useState('usd');
  const [u, setu] = useState('green');
  const [b, setb] = useState('blue');
  const [ecocash, setEco] = useState(0);
  const [bond, setBond] = useState(0);
  const [e, sete] = useState('blue');
  const [Q, setQ] = useState(1);
  const [showQ, setshowQ] = useState(true);
  const [popup, setPopup] = useState(false);
  const [showtotal, setshowTotal] = useState(false);
  const [prdct, setPrdct] = useState(null);
  const [totalprice, setTotal] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scan, setScan] = useState(false);
  const [name, setName] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const { userroles } = useContext(Authorisation);

  useEffect(() => {
    (async () => {

      userroles.reduce((prev, { name }) => { if ('Can sale products' == name) setIsAuthorised(true) }, 0);

      if (route.params) {
        setProductList(route.params.dataSource);
        setTotal(route.params.totalprice);
        setshowTotal(true);
        setPrdct(route.params.item);
        setPopup(true);
      }
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
  }, []);

  const getdata = (k, v) => {
    (async () => {
      if (k == 'name') {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM productStatus Left Join products On productId=products.id where ' +
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
            }, e => alert(JSON.stringify(e))
          );
        });
      } else {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM productStatus Left Join products On productId=products.id where ' +
            k + ' LIKE "%' + v + '%" ;',
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
  const handleModal = () => {
    if (Q < 1) {
      setBarcode(null);
      setPrdct(null);
      setScan(false);
      setScanned(false);
      setPopup(false);
    } else {
      const newdata = productList.map((item) => {
        if (prdct.id === item.id) {
          item.q = Q;
          return item;
        }
        return item;
      });
      setProductList(newdata);
      const index = productList.findIndex((i) => i.id === prdct.id);

      if (index === -1) {
        prdct.q = Q;
        productList.push(prdct);
        setProductList(productList);
        const utotal = productList.reduce((prev, { price, id, q }) => {
          return prev + price * q;
        }, 0);

        let totalprice = parseFloat(utotal).toFixed(2);
        setTotal(totalprice);
        setshowTotal(true);
      }
      else {
        prdct.q = Q;
        productList[index] = prdct;
        setProductList(productList);
        const utotal = productList.reduce((prev, { price, id, q }) => {
          return prev + price * q;
        }, 0);

        let totalprice = parseFloat(utotal).toFixed(2);
        setTotal(totalprice);
        setshowTotal(true);
      }

      setQ(1);
      setPrdct('');
      setBarcode(null);
      setPrdct(null);
      setScan(false);
      setScanned(false);
      setPopup(false);
    }
  };
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }} >{isAuthorised ?
      <View style={(styles.flexcontainer, { flex: .95 })}>
        {scan ? (
          <View style={(styles.container, { flex: 1 })}>
            <QRCodeScanner
              cameraStyle={{ width: '100%', justifyContent: 'center' }} onRead={scanned ? undefined : handleBarCodeScanned}
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
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {popup ?
              <Modal
                animationType="fade"
                transparent={true}
                style={{
                  flex: 1,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                visible={popup}
                onRequestClose={() => {
                  setPopup(false);
                }}
              >
                <ScreenContainer><View
                  style={{
                    flex: .51,
                    borderColor: 'green',
                    borderRadius: 5,
                    borderWidth: .5,
                  backgroundColor: 'white',
                  alignContent: 'center',
                    justifyContent:'space-evenly',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      width: '90%',
                    }}
                  >
                    {prdct && (
                      <Text style={{
                        fontSize: 20, fontWeight: 'bold',
                        marginBottom: 3
                      }}>
                        how many units of {prdct.name} {prdct.size} do you want ?
                      </Text>
                    )}
                    {showQ && (
                      <View
                        style={(styles.flexRow, { alignContent: 'space-around' })}
                      >
                        <Text style={{
                          fontSize: 15, fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                        >
                          $
                          {(parseFloat(prdct.price) * parseFloat(Q))
                            .toFixed(2)
                            .toString()}
                          usd
                        </Text>
                        <Text style={{
                          fontSize: 15, fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                        >
                          $
                          {(
                            parseFloat(prdct.price * parseFloat(bond)) *
                            parseFloat(Q)
                          )
                            .toFixed(2)
                            .toString()}
                          bond
                        </Text>
                        <Text style={{
                          fontSize: 15, fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                        >
                          $
                          {(
                            parseFloat(prdct.price * parseFloat(ecocash)) *
                            parseFloat(Q)
                          )
                            .toFixed(2)
                            .toString()}
                          rtgs
                        </Text>
                      </View>
                    )}
                   <View  style={{ width: '75%', marginVertical: 16,flexDirection:'row',  }} >
                    <TextInput
                      style={{  flex:.61,color:'black', textAlign: 'center' }}
                      underlineColorAndroid="#0dcaf0"
                      keyboardType="number-pad"
                      value={Q.toString()}
                      onChangeText={(t) => {
                        if (t && t >= 0) {
                          if (t > parseInt(prdct.remaining)) {
                            alert(
                              'Sorry there is insufficient stock.\n' +
                              JSON.stringify(prdct.remaining) +
                              ' units remaining',
                            );
                            setshowQ(true);
                            setQ(parseInt(prdct.remaining));
                          } else {
                            setshowQ(true);
                            setQ(t);
                          }
                        } else {
                          setQ(t);
                          setshowQ(false);
                        }
                      }}
                    /></View>
                    <View style={styles.flexRow}>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          color: 'blue',
                          fontWeight: 'bold',
                          fontSize: 18,
                          fontStyle: 'italic',
                          flex: 1,
                        }}
                        onPress={() => {
                          setBarcode(null);
                          setPrdct(null);
                          setScan(false);
                          setScanned(false);
                          setPopup(false);
                        }}
                      >
                        <Text
                          style={{
                            color: 'blue',
                            fontWeight: 'bold',
                            fontSize: 18,
                            fontStyle: 'italic',
                          }}
                        >
                          cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          flex: 1,
                        }}
                        onPress={() => handleModal()}
                      >
                        <Text
                          style={{
                            color: 'blue',
                            fontWeight: 'bold',
                            fontSize: 18,
                            fontStyle: 'italic',
                          }}
                        >
                          next
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View></ScreenContainer>
              </Modal>
              :
              <View>
                <View style={(styles.container, styles.flexRow)}>

                  {showtotal && (
                    <Text
                      style={{
                        flex: 0.65,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        alignSelf: 'center',
                      }}
                    >
                      Total :
                      {choice === 'usd' && (
                        <Text
                          style={{
                            flex: 1,
                            textAlign: 'center',
                          }}
                        >
                          ${parseFloat(totalprice).toFixed(2)} usd
                        </Text>
                      )}
                      {choice === 'bond' && (
                        <Text
                          style={{
                            flex: 1,
                            textAlign: 'center',
                          }}
                        >
                          ${(totalprice * parseFloat(bond)).toFixed(2)}
                          bond
                        </Text>
                      )}
                      {choice === 'rtgs' && (
                        <Text
                          style={{
                            flex: 1,
                            textAlign: 'center',
                          }}
                        >
                          ${(totalprice * parseFloat(ecocash)).toFixed(2)}
                          rtgs
                        </Text>
                      )}
                    </Text>
                  )}
                </View>
                <View style={{ backgroundColor: 'white', borderRadius: 9 }}>
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
                            color: 'blue',
                            // marginLeft: 5,
                            fontWeight: 'bold',
                            fontSize: 18,
                            fontStyle: 'italic',
                          }}
                        >
                          Scan
                        </Text>
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
                </View>


                <FlatList
                  style={{
                    paddingVertical: 5,
                    marginVertical: 5,
                  }}
                  data={dataSource}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: '#d7d7d7',
                        flexDirection: 'column',
                        borderWidth: 1,
                        borderColor: 'blue',
                        borderRadius: 5,
                        margin: 1,
                      }}
                      onPress={() => {
                        setPrdct(item);
                        setPopup(true);
                      }}
                    >
                      <Text
                        style={{ textAlign: 'center', }}
                      >
                        {item.name}
                      </Text>

                      {item.size !== '' && (
                        <Text
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          {item.size}
                        </Text>
                      )}
                      {choice === 'usd' && (
                        <Text
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          ${item.price} usd
                        </Text>
                      )}
                      {choice === 'bond' && (
                        <Text
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          ${(item.price * parseFloat(bond)).toFixed(2)} bond
                        </Text>
                      )}
                      {choice === 'rtgs' && (
                        <Text
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          ${(item.price * parseFloat(ecocash)).toFixed(2)} rtgs
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                  //Setting the number of column
                  numColumns={2}
                  keyExtractor={(item, index) => index}
                />
                {showtotal && (
                  <View style={(styles.flexRow, {
                    alignItems: 'center', paddingVertical: 5,
                    marginVertical: 5,
                  })}>
                    <TouchableOpacity
                      style={{

                        flexWrap: 'wrap',
                        padding: 5,

                        borderWidth: .5, borderColor: 'blue', borderRadius: 20,
                        marginVertical: 5,
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        navigation.pop();
                        navigation.push('Cart', {
                          productList: productList,
                          totalprice: totalprice,
                        });
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
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}</View>
            }
          </View>
        )}
      </View> : <ScreenContainer>
        <Text style={{
          color: 'green',
          backgroundColor: 'yellow', borderRadius: 5, margin: 5, padding: 5
        }}>You are not authorised to go to the this screen. {'\n'}
          You are required to have permissions so that you {'can sale products'} </Text>
      </ScreenContainer>}
    </View>
  );
};
