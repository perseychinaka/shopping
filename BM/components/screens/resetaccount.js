import React, { useState, useContext, useEffect } from 'react';
import { Text, TextInput, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Authentication } from '../../context';
import { ScreenContainer } from '../styles/styles';
import * as DB from './database';
import { styles } from '../styles/styles';

export const ResetAccount = ({ navigation }) => {
  const [question, setquestion] = useState('');
  const [answer, setanswer] = useState('');
  const [danswer, setdanswer] = useState('');
  const [usernamegiven, setusernamegiven] = useState(false);
  const [username, setusername] = useState("");
  
  const checkans = () => {
    if (danswer == answer) {
      // setresetpassword(false);
      // setnewpassword(true);
      // setnewaccount(false);
      navigation.navigate("createAccount",{setnewaccount:false,question:question,answer:answer,username:username}
      )
    } else {
      alert('password did not match or you gave wrong answer');
    }
  }; return (<ScreenContainer>
    <View style={{
      marginHorizontal: 5, flex: 0.7, flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={styles.flexxcontainer}>

        {usernamegiven ?
          <View>
            <TextInput
            style={styles.input}
              placeholderTextColor="#0dcaf0"  placeholder="Enter your username "
              onChangeText={(name) => setusername(name)}
              value={username}
               underlineColorAndroid="#0dcaf0"
              
              
            />

            <TextInput
              placeholderTextColor="#0dcaf0"  placeholder="password recovery question "
              onChangeText={(name) => setquestion(name)}
              value={question}
               underlineColorAndroid="#0dcaf0"
              
              
            />
            <TextInput
            style={styles.input}
              placeholderTextColor="#0dcaf0"  placeholder="Enter password recovery answer"
              onChangeText={(name) => setanswer(name)}
              value={answer}
               underlineColorAndroid="#0dcaf0"
              
              
            />
            <View
              style={{ flexDirection: "row", marginHorizontal: 5, padding: 5 }}>
              <TouchableOpacity
                style={{
                  // backgroundColor: 'green',
                  flex: 1, marginLeft: 4, padding: 5,
                 
             borderWidth: .5, borderColor: 'blue',   borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'green', marginVertical: 5,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
                onPress={() => checkans()}
              >
                <Text
                  style={{
                    color: 'blue',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginHorizontal: 5,
                    // fontSize: 18,
                    fontStyle: 'italic',
                  }}
                >
                  submit

                </Text>
              </TouchableOpacity>
            </View>
          </View> : <View>
            <TextInput
              placeholderTextColor="#0dcaf0"  placeholder="Enter your username "
              onChangeText={(name) => setusername(name)}
              value={username}
               underlineColorAndroid="#0dcaf0"
              
              
            />

            <View
              style={{ flexDirection: "row", marginHorizontal: 5, padding: 5 }}>
              <TouchableOpacity
                style={{
                  flex: 1, marginLeft: 4, padding: 5,
                 
             borderWidth: .5, borderColor: 'blue',   borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'green', marginVertical: 5,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {

                  DB.checkuser(username).then(r => {
                    if (!r.key) {
                      setusername(r.data.name);
                      setquestion(r.data.question);
                      setdanswer(r.data.answer)
                      setusernamegiven(true);
                    }

                  }
                  );
                }
                }
              >
                <Text
                  style={{
                    color: 'blue',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginHorizontal: 5,
                    // fontSize: 18,
                    fontStyle: 'italic',
                  }}
                >
                  submit

                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>

    </View>

  </ScreenContainer>);
}