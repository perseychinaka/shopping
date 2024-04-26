import React, { useState, useContext, useEffect } from 'react';
import { Authorisation } from '../../context';
import * as DB from './database';
const db = DB.db;
import { useIsFocused } from "@react-navigation/native";
import { FAB } from 'react-native-paper';
import { ScreenContainer, styles } from '../styles/styles';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
export const Expenses = ({ navigation }) => {
  const [dataSource, setDataSource] = useState(null);
  const [expense, setExpense] = useState(null);
  const [choice, setChoice] = useState('usd');
  const [isAuthorised, setIsAuthorised] = useState(false);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const { userroles, client } = useContext(Authorisation);


  useEffect(() => {
    if (isFocused)
      (async () => {
        userroles.reduce((prev, { name }) => { if ('Can approve' == name) setIsAuthorised(true) }, 0);
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM operation where type = "Expense"  ', [], (_, { rows }) => {
            let len = rows.length;
            let rws = []
            for (let i = 0; i < len; i++) {
              let row = rows.item(i);
              rws.push(row);
            }
            // alert(JSON.stringify(rws));
            setDataSource(rws);
          });
        });
      })();
  }, [{}, isFocused]);
  return (
    <SafeAreaView style={sstyles.container}>
   {modalVisible&&   <Modal
        animationType="fade"
        transparent={true}
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onRequestClose={() => {
          // setPopup(false);
        }}
      ><ScreenContainer>
          <View
            style={{
              flex: .3,
              borderColor: 'green',
              borderRadius: 5,
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
          >
              <View style={styles.flexRow}>
                <Text style={{ color: 'blue', fontWeight: 'bold', fontSize:20, flex: .5, textAlign: 'center' }}>Expense</Text>
              </View> 
              <View style={styles.flexRow}>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Dated</Text>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{expense.date}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Amount paid</Text>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>${expense.value} usd</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Description</Text>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{expense.description}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text onPress={() => setModalVisible(!modalVisible)} style={[styles.homebutton, { color: 'green', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Cancel</Text>
                <Text onPress={() => {
                  if (isAuthorised) {
                    if (client) {
                      let data = { function: 'delOperation', data: { description: expense.description, id: expense.id } };
                      client.write(JSON.stringify(data));
                      navigation.navigate('Expenses');
                    }
                    else DB.deleteExpense(expense.description, expense.id);
                    navigation.navigate('Expenses');
                  }
                  else alert('You are not authorised to do this.\n You need permission so that you can Aprove');
                  navigation.navigate('Expenses');
                }} style={[styles.homebutton, { color: 'red', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Delete</Text>

              </View>
            </View>
          </View></ScreenContainer>
      </Modal>}
      {dataSource && (
        <FlatList
          data={dataSource}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setExpense(item);
                setModalVisible(true);
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
              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                {item.description}
              </Text>
              {choice === 'usd' && (
                <Text
                  style={{
                    textAlign: 'center',
                  }}
                >
                  ${item.value} usd
                </Text>
              )}
              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={2}
          keyExtractor={(item, index) => index}
        />
      )}<View style={[styles.flexRow, { justifyContent: 'center', alignItems: 'center', marginBottom: 15 }]}>
        <TouchableOpacity onPress={() => navigation.push('Add Expense')}>
          <FAB icon='plus' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const sstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});