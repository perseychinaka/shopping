import React, { useState, useContext, useEffect } from 'react';
import { CheckBox } from 'react-native-elements'
import { Authentication } from '../../context';
import { ScreenContainer } from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, TextInput, FlatList, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { styles } from '../styles/styles';
import { Authorisation } from '../../context';
import { FAB } from 'react-native-paper';
import * as DB from './database';
import { Splash } from './splash'
export const Roles = ({ navigation }) => {
  const { signUp } = useContext(Authentication)
  const [addgroup, setaddgroup] = useState(false);
  const [name, setName] = useState('');
  const [locked, Lock] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const [Roles, setRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState(null);
  const [grouproles, setGrouproles] = useState(null);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const { width } = Dimensions.get('screen');
  const { userroles, client } = useContext(Authorisation);
  const [dataSource, setDataSource] = useState(null);
  useEffect(() => {
    DB.getgroups(setDataSource, setRoles);
    // console.log(userroles);
    userroles.reduce((prev, { name }) => { if ('Can change settings' == name) setIsAuthorised(true) }, 0);
  }, []);

  const mergedroles = (g) => {
    setIsLoading(true);
    let groles = [];
    let allroles = [];
    // alert(JSON.stringify(g));
    let ln = g.roles.length;
    for (let j = 0; j < ln; j++) {
      let rw = g.roles[j];
      groles.push(rw);
    }

    for (let k = 0; k < Roles.length; k++) {
      const r = Roles[k];
      let pas = true;
      for (let i = 0; i < groles.length; i++) {
        const gr = groles[i];
        // alert(gr.id );
        if (r.id === gr.role) {
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

    setGrouproles(allroles);
    setGroup(g);
    setIsLoading(false);

  }
  if (isLoading) {
    return <Splash />;
  }
  return (
    <ScreenContainer>
      {group ?
        <ScreenContainer>
          {/* <CheckBox
  center
  title='Click Here to Remove This Item'
  iconRight
  // iconType='material'
  // // checkedIcon='clear'
  // uncheckedIcon='add'
  // checkedColor='red'
  checked={true}
/> */}

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
              {group.name}'s Roles
            </Text></View>{Roles && (
              <ScreenContainer><FlatList
                data={grouproles}
               style={{backgroundColor:'white'}} renderItem={({ item }) => (

                  <CheckBox
                    title={item.name}
                    checked={item.checked}
                    onPress={() => {
                      let newdata = [];
                      for (let i = 0; i < grouproles.length; i++) {
                        let el = grouproles[i];
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

                    backgroundColor:'white',  borderWidth: .5, borderColor: 'blue', borderRadius: 20,
                    marginVertical: 5,
                    flexDirection: 'row' // alignItems: 'center',
                  }}
                  onPress={() => DB.saveRoles(grouproles, group).then(r => { alert("Changes saved successfully"); navigation.pop(); navigation.push('roles') })}
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
                </ScreenContainer>}
              </ScreenContainer>
            )}</ScreenContainer> : <ScreenContainer>

          {modalVisible && <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            style={{
              flex: .1,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onRequestClose={() => {
            }}
          ><ScreenContainer><View
            style={{
              flex: 1,
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
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Group </Text>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{selected.name}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={{ color: 'black', fontWeight: 'bold', flex: 1, textAlign: 'center' }}>User Permissions</Text>
                {selected.name == 'Admin' ? <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>All granted</Text> :
                  <Text style={{ color: 'black', fontWeight: 'bold', flex: 1 }}>{JSON.stringify(selected.roles)}</Text>}
              </View>
              <View style={styles.flexRow}>
                <Text onPress={() => setModalVisible(!modalVisible)} style={[styles.homebutton, { color: 'green', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Cancel</Text>
                <Text
                  onPress={() => mergedroles(selected)}
                  style={[styles.homebutton, { color: 'red', fontWeight: 'bold', fontSize: 18, fontStyle: 'italic' }]}>Edit roles</Text>
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
          </Modal>}{addgroup ? <View style={styles.container}>
            <TextInput
              onChangeText={(name) => setName(name)}
              placeholderTextColor="#0dcaf0" placeholder="Enter a name of the group"
              value={name}
              underlineColorAndroid="#0dcaf0"
              style={{
                marginVertical: 5,
                backgroundColor: 'white', borderRadius: 4,
                height: 38, width: width * 0.9,
                paddingHorizontal: 4,
                marginTop: 4,
              }}
            />
            <TouchableOpacity
              style={{

                borderWidth: .5, borderColor: 'blue', borderRadius: 20,
                backgroundColor: 'white', margin: 5,
                width: width * 0.4, alignItems: 'center',
              }}
              onPress={() => { // setaddgroup(false);
                DB.saveGroup(name).then((r, _) => { alert(r) });
              }
              }>

              <Text style={{
                color: 'blue',
                fontWeight: 'bold',
                // flex: .3,
                textAlign: 'center',
                fontSize: 28,
                fontStyle: 'italic',
              }} >
                Save
              </Text>
            </TouchableOpacity>
          </View> : <ScreenContainer>
            {dataSource && (
              <FlatList
                data={dataSource}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={(styles.homebutton)}
                    onPress={() => {
                      setSelected(item); setModalVisible(true);
                      //    Alert.alert('User', '' + item.name, [
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
                      //       if (isAuthorised) {
                      //         if (client) {
                      //           let data = { function: 'deleteUser', data: { name: item.name, id: item.id } };
                      //           if (!locked) { Lock(true); client.write(JSON.stringify(data)); }
                      //         }
                      //         else  DB.deleteUser(item.name, parseInt(item.id));
                      //       }
                      //       getgroups();
                      //     },
                      //   },
                      // ])
                      //   navigation.push('change password')
                    }}>

                    <Text style={{ margin: 4, fontSize: 18 }} >{item.name} group</Text>
                    {/* <Text style={{ margin: 4,fontSize:18  }} >{JSON.stringify(item)}</Text> */}
                  </TouchableOpacity>
                )}
                //Setting the number of column
                numColumns={1}
                keyExtractor={(item, index) => index}
              />
            )}
            <View style={[styles.flexRow, { flexDirection: 'row-reverse', marginBottom: 55 }]}>
              <TouchableOpacity onPress={() => setaddgroup(true)}>
                <FAB icon='plus' />
              </TouchableOpacity>
            </View>
          </ScreenContainer>}
        </ScreenContainer>
      }</ScreenContainer>
  );
};