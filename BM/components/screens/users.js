import React, { useState, useContext, useEffect } from 'react';
import { CheckBox } from 'react-native-elements'
import { Authentication } from '../../context';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ScreenContainer } from '../styles/styles';
import { Text, FlatList, ScrollView, View, Modal, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import * as DB from './database';
import { Splash } from './splash'
import { Authorisation } from '../../context';

export const Users = ({ navigation }) => {
  const { signOut } = useContext(Authentication)
  const [dataSource, setDataSource] = useState(null);
  const [Roles, setRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [user, setuser] = useState(null);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const { userroles, currentuser } = useContext(Authorisation);
  const [userRoles, setuserroles] = useState(null);
  useEffect(() => {
    DB.Groups(setGroups);
    DB.getUsers(setDataSource, setRoles);
    userroles.reduce((prev, { name }) => { if ('Can change settings' == name) setIsAuthorised(true) }, 0);
  }, []);
  const mergedroles = (g) => {
    // alert(JSON.stringify(g));
    setIsLoading(true);
    let uroles = [];
    let allroles = [];
    let ln = g.roles.length;
    for (let j = 0; j < ln; j++) {
      let rw = g.roles.item(j);
      uroles.push(rw);
    }
    // alert(JSON.stringify(g));

    for (let k = 0; k < Roles.length; k++) {
      const r = Roles[k];
      let pas = true;
      for (let i = 0; i < uroles.length; i++) {
        const ur = uroles[i];
        if (r.id === ur.role) {
          pas = false;
          r.checked = true;
          allroles.push(r);
          break;
        }
      }
      if (pas) {
        r.checked = false;
        allroles.push(r);
      }
    }

    setuserroles(allroles);
    setuser(g);
    setIsLoading(false);

  }
  if (isLoading) {
    return <Splash />;
  }
  return (
    <ScreenContainer>
      {modalVisible && <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onRequestClose={() => {
              // setPopup(false);
            }}
          ><ScreenContainer><View
            style={{
              flex: .21,
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
          >
              <View style={styles.flexRow}>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>Usernane</Text>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{selected.name}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: .5, textAlign: 'center' }}>role</Text>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{selected.gname}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text onPress={() => setModalVisible(!modalVisible)} style={[styles.homebutton, { color: 'green', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Cancel</Text>
                <Text onPress={() => {
                  DB.deleteUser(item.name, parseInt(item.id));
                  try {
                    DB.Groups(setGroups);
                    DB.getUsers(setDataSource, setRoles);
                    if (dataSource) { } else signOut();
                  } catch (error) {
                    signOut();
                  }
                }} style={[styles.homebutton, { color: 'red', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Delete</Text>
               </View>

            </View>
          </View></ScreenContainer>
          </Modal>}{user ?
        <ScreenContainer>
         <View
            style={{ flexDirection: 'row' }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                flex: .6, textAlign: 'center',
                marginHorizontal: 5,
                fontSize: 28,
                fontStyle: 'italic',
              }}
            >
              {user.name}'s Roles
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{
              color: 'blue',
              fontWeight: 'bold',
              textAlign: 'center',
              width: 100, marginHorizontal: 5,
              // fontSize: 28,
              fontStyle: 'italic',
            }}
            >
              {user.name}`s  {'\n'}group
            </Text>
            <RadioButtonRN style={{ width: 120, paddingHorizontal: 0 }}
              data={groups}
              selectedBtn={(group) => setGroup(group)}
              initial={user.group}
              textStyle={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginHorizontal: 5,
                fontStyle: 'italic',
              }}


              boxStyle={{
                marginVertical: 0,
                paddingVertical: 0,
              }}
              deactiveColor={'grey'}
              circleSize={8} icon={
                <Icon
                  name="check-circle"
                  size={15}
                  color="#2c9dd1"
                />
              }
            />
          </View>
          {Roles && (
            <ScreenContainer style={{ flex: .5 }}>
              <FlatList
                data={userRoles}
                renderItem={({ item }) => (

                  <CheckBox
                    title={item.name}
                    checked={item.checked}
                    onPress={() => {
                      let newdata = [];
                      for (let i = 0; i < userRoles.length; i++) {
                        let el = userRoles[i];
                        if (el.id === item.id) {
                          el.checked = !(el.checked);
                        }
                        newdata.push(el);
                      }
                      // alert(JSON.stringify(newdata));
                      setRoles(newdata);
                    }}
                  />
                )}
                numColumns={1}
                keyExtractor={(item, index) => index}
              />
              {isAuthorised ? <TouchableOpacity
                style={{

                  // flexWrap: 'wrap',
                  // padding: 5,

                  borderWidth: .5, borderColor: 'blue', borderRadius: 20,
                  marginVertical: 5,
                  flexDirection: 'row' // alignItems: 'center',
                }}
                onPress={() => DB.saveUserRoles(userRoles, user, group).
                  then(r => {
                    alert("Changes saved successfully");
                    navigation.pop(); navigation.push('Users')
                  })}
              >
                <Text
                  style={{
                    color: 'blue',
                    fontWeight: 'bold',
                    flex: .6, textAlign: 'center',
                    marginHorizontal: 5,
                    fontSize: 28,
                    fontStyle: 'italic',
                  }}
                >
                  Save Changes
                </Text>
              </TouchableOpacity> : <ScreenContainer>
                <Text style={{
                  backgroundColor: 'yellow', borderRadius: 5, margin: 5, padding: 5
                }}>You are not authorised to change anything here ! {'\n'}
                  You are required to have permissions so that you {'can change settings'} </Text>
              </ScreenContainer>}</ScreenContainer>
          )}</ScreenContainer> : <ScreenContainer>

          <ScreenContainer>
            {dataSource && (
              <FlatList
                data={dataSource}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={(styles.homebutton)}
                    onPress={() => {
                      setSelected(item); setModalVisible(true);
                      // Alert.alert('User', '' + item.name, [
                      //   {
                      //     text: 'Cancel',
                      //     onPress: () => console.log('Cancel Pressed'),
                      //     style: 'cancel',
                      //   },
                      //   {
                      //     text: 'edit roles',
                      //     onPress: () => mergedroles(item),
                      //   },
                      //   {
                      //     text: 'delete',
                      //     onPress: () => {
                      //       DB.deleteUser(item.name, parseInt(item.id));
                      //       try {
                      //         DB.Groups(setGroups);
                      //         DB.getUsers(setDataSource, setRoles);
                      //         if (dataSource) { } else signOut();
                      //       } catch (error) {
                      //         signOut();
                      //       }
                      //     },
                      //   },
                      // ])
                    }
                      //   navigation.push('change password')
                    }>

                    <Text style={{ margin: 4, fontSize: 18 }} > Usernane: {item.name}</Text>
                    {/* <Text style={{ margin: 4,fontSize:18  }} >{JSON.stringify(item)}</Text> */}
                  </TouchableOpacity>
                )}
                //Setting the number of column
                numColumns={1}
              />
            )}</ScreenContainer>
        </ScreenContainer>
      }
    </ScreenContainer>
  );
};


