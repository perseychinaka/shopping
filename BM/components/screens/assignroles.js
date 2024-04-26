import React, { useState, useContext, useEffect } from 'react';
import { Authentication } from '../../context';
import { ScreenContainer } from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, TextInput,FlatList,  View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import * as DB from './database';

export const AsignRoles = ({ navigation }) => {
    const { signUp } = useContext(Authentication)
    const [dataSource, setDataSource] = useState(null);
     useEffect(() => {
      getgroups();
    }, []);
    const getgroups=()=>{
        let rws = []
        DB.db.executeSql(
          'SELECT * FROM group WHERE 1;',
          [],
          (_, { rows }) => {
              let len = rows.length;
              for (let i = 0; i < len; i++) {
                let row = rows.item(i);
                DB.db.executeSql(
                    'SELECT * FROM grouproles WHERE group=?;',
                    [row.group],
                    (_, { roles }) => {
                       row["roles"]=roles
                    },
                    (er) => {
                        alert(JSON.stringify(er));
                    },
                ); 
                 rws.push(row);
              }
              setDataSource(rws);
          },
          (er) => {
              alert(JSON.stringify(er));
          },
      );
    } 
    return (
        <ScreenContainer>
                          <TouchableOpacity
                              style={(styles.homebutton, {  borderColor: 'blue',
                               borderWidth: .5,borderRadius:5 ,marginTop: 4  ,alignItems: 'center',margin: 5, flexDirection: 'row'})}
                              onPress={() => 
                                 navigation.push('assignroles')
                              }> 
              <Icon name="plus" style={{ margin: 4,fontSize:18 }} color="#0dcaf0" />
                              
                              <Text style={{ margin: 4,fontSize:18  }} >
   add roles
                              </Text>
                              {/* <Text style={{ margin: 4,fontSize:18  }} >{JSON.stringify(item)}</Text> */}
                            </TouchableOpacity>
            {dataSource && (
                <FlatList 
                    data={dataSource}
                    renderItem={({ item }) => (
                         <TouchableOpacity
                              style={(styles.homebutton, {  borderBottomColor: 'blue',
                               borderBottomWidth: .5,marginTop: 4  ,alignItems: 'center',margin: 5, flexDirection: 'row'})}
                              onPress={() =>    Alert.alert('User', '' + item.name, [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {
                                  text: 'delete',
                                  onPress: () => {
                                    DB.deleteUser(item.name, parseInt(item.id));
                                    getgroups();
                                  },
                                },
                              ])
                            //   navigation.push('change password')
                              }> 
                              
                              <Text style={{ margin: 4,fontSize:18  }} >{item.name}</Text>
                              {/* <Text style={{ margin: 4,fontSize:18  }} >{JSON.stringify(item)}</Text> */}
                            </TouchableOpacity>
                         )}
                    //Setting the number of column
                    numColumns={1}
                    keyExtractor={(item, index) => index}
                />
            )}
        </ScreenContainer>
    );
};


