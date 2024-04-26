import React, { useState, useContext, useEffect } from 'react';
import { ScreenContainer, styles } from '../styles/styles';
import { View, Text, Button, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Authorisation, Authentication } from '../../context';


export const ClientScreen = ({ navigation }) => {

  const [qr, setQr] = useState();
  const { createClient } = useContext(Authentication);
  const { client, setClient } = useContext(Authorisation);

  // const createClient = async (ip) => {
  //   const client = await net.createConnection(6666, ip, () => {
  //     console.log('opened client on ' + JSON.stringify(client));
  //   });

  //   client.on('data', (data) => {
  //     data = JSON.parse(data);
  //     if (data['function'] === 'AddProduct') {
  //       let { barcode, name, quantity, size, cost, price, date, user } = data.data;
  //       DB.AddProduct(barcode, name, quantity, size, cost, price, date, user);
  //     }
  //     else if (data['function'] === 'saveTransaction') {
  //       let { dataSource, totalprice, date, user } = data.data;
  //       DB.saveTransaction(dataSource, totalprice, date, user);
  //     }
  //     else if (data['function'] === 'addOperation') {
  //       let { name, ucost, date, type, user } = data.data;
  //       DB.addOperation(name, ucost, date, type, user);
  //     }
  //     else if (data['function'] === 'correctAndSaveThisTransaction') {
  //       let { receptid, dataSource, totalprice } = data.data;
  //       DB.correctAndSaveThisTransaction(receptid, dataSource, totalprice);
  //     }
  //     else if (data['function'] === 'updateProduct') {
  //       let { barcode, name, size, cost, price, id } = data.data;
  //       DB.updateProduct(barcode, name, size, cost, price, id);
  //     }
  //     else if (data['function'] === 'saveSettings') {
  //       let { ecocash, bond, profitmargin } = data.data;
  //       DB.saveSettings(ecocash, bond, profitmargin);
  //     }
  //     else if (data['function'] === 'deleteProduct') {
  //       let { name, id } = data.data;
  //       DB.deleteProduct(name, parseInt(id));
  //     }
  //     else if (data['function'] === 'deleteExpense') {
  //       let { description, id } = data.data;
  //       DB.deleteProduct(description, parseInt(id));
  //     }
  //     else if (data['function'] === 'deleteUser') {
  //       let { name, id } = data.data;
  //       DB.deleteProduct(name, parseInt(id));
  //     }
  //   });
  //   client.on('error', (error) => {
  //     console.log('client error ' + error);
  //   });

  //   client.on('close', () => {
  //     console.log('client close');
  //   });
  //   setClient(client);
  //   return client;
  // };
  // const SyncroniseData = async (ip, chats, setChats) => {

  //   const client = await net.createConnection(6666, ip, () => {
  //     // console.log('opened client on ' + JSON.stringify(client));

  //     DB.db.transaction((s) => {
  //       s.executeSql(
  //         'Select * From networkLogs where 1 ORDER BY id DESC',
  //         [],
  //         (_, { rows }) => {
  //           let data = [];
  //           for (let i = 0; i < rows.length; i++) {
  //             data.push(rows.item(i));

  //           }
  //           // console.log('Data exists' + JSON.stringify(data));
  //           client.write({ function: "synchronise", data: data });
  //         }, (er) => {
  //           console.log(JSON.stringify(er));

  //         },
  //       );
  //     });
  //   });

  //   client.on('data', (data) => {
  //     if (chats)
  //       setChats({ ...chats, id: chats.length + 1, msg: data });
  //     console.log('Client Received:' + data);
  //     data = JSON.parse(data);
  //     if (data['function'] === 'AddProduct') {
  //       let { barcode, name, quantity, size, cost, price, date, user } = data.data;
  //       DB.AddProduct(barcode, name, quantity, size, cost, price, date, user);
  //     }
  //     else if (data['function'] === 'saveTransaction') {
  //       let { dataSource, totalprice, date, user } = data.data;
  //       DB.saveTransaction(dataSource, totalprice, date, user);
  //     }
  //     //   else if (data['function'] === 'addOperation') {
  //     // console.log("qwertyuiop0987654321`");
  //     //     let { name, ucost, date, type, user } = data.data;
  //     //     DB.addOperation(name, ucost, date, type, user);
  //     //   }
  //     else if (data['function'] === 'addOperation') {
  //       console.log("qwertyuiop0987654321`");
  //       let { name, ucost, date, type, user } = data.data;
  //       DB.addOperation(name, ucost, date, type, user);
  //       // broadcast(pdata, socket);
  //     }
  //     else if (data['function'] === 'correctAndSaveThisTransaction') {
  //       let { receptid, dataSource, totalprice } = data.data;
  //       DB.correctAndSaveThisTransaction(receptid, dataSource, totalprice);
  //     }
  //     else if (data['function'] === 'updateProduct') {
  //       let { barcode, name, size, cost, price, id } = data.data;
  //       DB.updateProduct(barcode, name, size, cost, price, id);
  //     }
  //     else if (data['function'] === 'saveSettings') {
  //       let { ecocash, bond, profitmargin } = data.data;
  //       DB.saveSettings(ecocash, bond, profitmargin);
  //     }
  //     else if (data['function'] === 'deleteProduct') {
  //       let { name, id } = data.data;
  //       DB.deleteProduct(name, parseInt(id));
  //     }
  //     else if (data['function'] === 'deleteExpense') {
  //       let { description, id } = data.data;
  //       DB.deleteProduct(description, parseInt(id));
  //     }
  //     else if (data['function'] === 'deleteUser') {
  //       let { name, id } = data.data;
  //       DB.deleteProduct(name, parseInt(id));
  //     }
  //   });
  //   client.on('error', (error) => {
  //     console.log('client error ' + error);
  //   });

  //   client.on('close', () => {
  //     console.log('client close');
  //   });
  //   setClient(client);
  //   return client;
  // };
  const getips = (async () => {
    let host = await NetworkInfo.getGatewayIPAddress();
    let guest = await NetworkInfo.getIPAddress();
    return host, guest;
  }, 45 * 1000);

  const handleBarCodeScanned = async ({ type, data }) => {
    let { serverip } = JSON.parse(data);
    alert(JSON.stringify(data));
    setClient(createClient(serverip));
    navigation.navigate('Home');

  };
  return <View style={styles.container}>
    <View style={{ borderColor: 'blue', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
      <QRCodeScanner
        cameraStyle={{ width: '100%', justifyContent: 'center' }} onRead={handleBarCodeScanned}
        //   flashMode={RNCamera.Constants.FlashMode.torch}
        bottomContent={
          <View style={(styles.flexRow, { alignItems: 'center', flex: 1, marginBottom: 10 })}>
            <TouchableOpacity
              onPress={() => {
                navigation.pop();
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
  </View>;
};
