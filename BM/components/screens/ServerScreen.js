import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import { styles } from '../styles/styles';
import * as DB from './database';
let net = require('react-native-tcp');
import { Authorisation, Authentication } from '../../context';


export const ServerScreen = ({ navigation }) => {
  const [server, setServer] = useState(null);
  const { Host, setHost, setClient } = useContext(Authorisation);
  const { createClient } = useContext(Authentication);

  let sockets = [];
  const createServer = () => {
    const server = net.createServer((socket) => {
      if (socket.address().address == '127.0.0.1') {
        console.log('host Client connected on ' + socket.address().address);;
      }
      else console.log('Client connected on ' + socket.address().address);
      sockets.push(socket);
      socket.on('data', (pdata) => {
        const data = JSON.parse(pdata);
        console.log('Server Received : ' + JSON.stringify(data.data));

        if (data['function'] === 'AddProduct') {
          DB.AddProduct(data.data);
          broadcast(pdata);
        }

        else if (data['function'] === 'delOperation') {
          let { description, id } = data.data;
          DB.deleteExpense(description, id);
          broadcast(pdata);
        }
        else if (data['function'] === 'addOperation') {
          let { name, ucost, date, type, user, id } = data.data;
          DB.addOperation(name, ucost, date, type, user, id);
          broadcast(pdata);
        }
        else if (data['function'] === 'cancelThisTransaction') {
          let { receptid } = data.data;
          // alert("qwqwertyuierty" + receptid);
          DB.cancelThisTransaction(receptid);
          broadcast(pdata);
        }
        else if (data['function'] === 'correctAndSaveThisTransaction') {
          let { receptid, dataSource, totalprice } = data.data;
          DB.correctAndSaveThisTransaction(receptid, dataSource, totalprice);
          broadcast(pdata);
        }
        else if (data['function'] === 'saveTransaction') {
          let { dataSource, totalprice, date, rid, user } = data.data;
          DB.saveTransaction(dataSource, totalprice, date, rid, user);
          broadcast(pdata);
        }
        else if (data['function'] === 'updateProduct') {
          let { barcode, name, size, cost, price, id } = data.data;
          DB.updateProduct(data.data);
          broadcast(pdata);
        }
        else if (data['function'] === 'saveSettings') {
          let { ecocash, bond, profitmargin } = data.data;
          DB.saveSettings(ecocash, bond, profitmargin);
          broadcast(pdata);
        }
        else if (data['function'] === 'deleteProduct') {
          let { name, id } = data.data;
          DB.deleteProduct(name, id);
          broadcast(pdata);
        }
        else if (data['function'] === 'deleteUser') {
          let { name, id } = data.data;
          DB.deleteProduct(name, parseInt(id));
          broadcast(pdata);
        }
        else if (data['function'] === 'ChangePassword') {
          let { user, password1 } = data.data;
          DB.deleteProduct(user, password1);
          broadcast(pdata);
        }
      });
      socket.on('error', (error) => {
        console.log('error ' + error);
      });

      socket.on('close', (error) => {
        console.log('server client closed ' + (error ? error : ''));
      });
    }).listen(6666, () => {
      console.log('opened server on ' + JSON.stringify(server.address()));
    });

    server.on('error', (error) => {
      console.log('error ' + error);
    });

    server.on('close', () => {
      console.log('server close');
    });

    return server;
  };
  function broadcast(message) {
    sockets.slice(1).forEach(socket => { socket.write(message);
    });
  }

  return <View style={styles.container}>
    {Host ?
      <View style={{ borderColor: 'blue', marginVertical: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
        {/* <QRCode
          style={styles.container}
          value={Host}
        /> */}
        <TouchableOpacity
          style={{ marginVertical: 44, borderColor: 'blue', borderWidth: 1, borderRadius: 15, padding: 15 }}
          onPress={() => {
            // turning off hotspot
            try {
              server.close(); setServer(null);
            } catch (error) { }

          }} >
          <Text>stop Server {JSON.stringify(Host)}</Text>
        </TouchableOpacity>
      </View> :
      <View style={{ borderColor: 'blue', marginVertical: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
        <TouchableOpacity style={{ marginVertical: 44, borderColor: 'blue', borderWidth: 1, borderRadius: 15, padding: 15 }}
          onPress={async () => {
            let serverip = await NetworkInfo.getIPAddress();// await NetworkInfo.getIPV4Address();
            await createServer();
            let lclient = await createClient(serverip);
            await setHost(JSON.stringify({ serverip }));
            await setClient(lclient);
            setHostClient(lclient);
            navigation.goBack();
          }}
        >
          <Text>Start Server</Text>
        </TouchableOpacity>

      </View>
    }
  </View >;
};

// const styles = StyleSheet.create({button:{marginTop:25}});
