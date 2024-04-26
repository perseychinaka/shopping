import React, { useState, useContext, useEffect } from 'react';
import { Text, TextInput, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Authorisation } from '../../context';
import { ScreenContainer } from '../styles/styles';
import * as DB from './database';
import { styles } from '../styles/styles';

export const ChangePassword = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const { currentuser } = useContext(Authorisation);
  const [locked, Lock] = useState(false);

  useEffect(() => {
  }, []);
  const checkans = () => {
    if (password == currentuser.password) {
      if (password1 == password2) {
        DB.ChangePassword(currentuser.id, password1);
      } else {
        alert('New passwords are mismatching ');
      }
    } 
    if (isAuthorised) {
      if (client) {
        let data={function:'ChangePassword' ,data:{user:currentuser.id, password1}};
        if (!locked) { Lock(true); client.write(JSON.stringify(data)); }
      }
      else   DB.ChangePassword(currentuser.id, password1);
    }else {
      alert('Wrong password for ' + currentuser.name);
    }
    setPassword(null);
    setPassword1(null);
    setPassword2(null);
  };

  return (<ScreenContainer>
    <View style={{
      marginHorizontal: 5, flex: 0.7, flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <View style={styles.flexxcontainer}>

        <View>
          <Text style={{
            fontWeight: 'bold',
             marginHorizontal: 5,
            fontSize: 18,
            fontStyle: 'italic',
          }}>Username:  {currentuser.name} </Text>
          <TextInput
            placeholderTextColor="#0dcaf0"  placeholder="Enter your current password"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
            value={password}
            underlineColorAndroid="#0dcaf0"
           
          />
          <TextInput
            placeholderTextColor="#0dcaf0"  placeholder="Enter your new password"
            onChangeText={(password) => setPassword1(password)}
            secureTextEntry={true}
            value={password1}
            underlineColorAndroid="#0dcaf0"
           
          /><TextInput
            placeholderTextColor="#0dcaf0"  placeholder="Confirm your new password"
            onChangeText={(password) => setPassword2(password)}
            secureTextEntry={true}
            value={password2}
            underlineColorAndroid="#0dcaf0"
          
          />
          <View style={{ marginHorizontal: 5, padding: 5, justifyContent: "space-around", alignContent: 'space-around', flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                
                flexWrap: 'wrap',
                padding: 5,
               
             borderWidth: .5, borderColor: 'blue',   borderRadius: 20,
                marginVertical: 5,
                alignItems: 'center',
              }}
              onPress={() =>checkans()}
            >
              <Text
                style={{
                  color: 'blue',
                  fontWeight: 'bold',
                  
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
          </View>

    </View>

  </ScreenContainer>);
}