import React, { useState, useContext, useEffect } from 'react';
import { Text, TextInput, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Authentication } from '../../context';
import { ScreenContainer } from '../styles/styles';
import { styles } from '../styles/styles';
import * as DB from './database';

export const CreateAccount = ({ navigation, route }) => {
    const { signUp } = useContext(Authentication)
    const [question, setquestion] = useState('');
    const [answer, setanswer] = useState('');
    const [username, setusername] = useState("");
    const [newpassword1, setnewpassword1] = useState('');
    const [newpassword2, setnewpassword2] = useState('');
    const [newaccount, setnewaccount] = useState(true);
    const [PhoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        try {
            if (route.params.username) {
                // alert(JSON.stringify(route.params));
                setusername(route.params.username);
                setquestion(route.params.question);
                setanswer(route.params.answer);
                setnewaccount(route.params.setnewaccount);
            }
        }
        catch { }

    }, []);

    return <ScreenContainer>
        <View style={(styles.ncontainer)}>

            <View style={{
                borderColor: '#4630eb',
                borderRadius: 4,
                backgroundColor:'white',
                    borderWidth: .5,
                flex: .8,
                marginVertical: 5,
                marginHorizontal: 2,
                padding: 5,
                flexDirection: 'column',
            }}><TextInput
                    placeholderTextColor="#0dcaf0"  placeholder=" Username"
                    onChangeText={(name) => { setusername(name) }}
                    value={username}
                    underlineColorAndroid="#0dcaf0"

                    style={styles.input1}
                /> 
               <TextInput
            keyboardType="numeric"
            underlineColorAndroid="#0dcaf0"
                    style={styles.input1}
              placeholderTextColor="#0dcaf0"  placeholder='Enter your phone number' value={PhoneNumber}
            onChangeText={(name) => { if (name == '0') { setPhoneNumber('+263'); } else { setPhoneNumber(name); } }}
          />
          <TextInput
                    placeholderTextColor="#0dcaf0"  placeholder="password recovery question "
                    onChangeText={(name) => setquestion(name)}
                    value={question}
                    underlineColorAndroid="#0dcaf0"

                    style={styles.input1}
                />
                <TextInput
                    placeholderTextColor="#0dcaf0"  placeholder=" password recovery answer"
                    onChangeText={(name) => setanswer(name)}
                    value={answer}
                    underlineColorAndroid="#0dcaf0"

                    style={styles.input1}
                />
                <TextInput
                    placeholderTextColor="#0dcaf0"  placeholder=" Enter password "
                    onChangeText={(name) => setnewpassword1(name)}
                    value={newpassword1}
                    secureTextEntry={true}
                    underlineColorAndroid="#0dcaf0"

                    style={styles.input1}
                />
                <TextInput
                    placeholderTextColor="#0dcaf0"  placeholder=" confirm password "
                    secureTextEntry={true}
                    onChangeText={(name) => setnewpassword2(name)}
                    value={newpassword2}
                    underlineColorAndroid="#0dcaf0"

                    style={styles.input1}
                />
                <View
                    style={{ flexDirection: "row", marginHorizontal: 5, padding: 5 }}>
                    <TouchableOpacity
                        style={{
                            // backgroundColor: 'green',
                            flex: 1, marginLeft: 4, padding: 5,

                            borderWidth: .5, borderColor: 'blue', borderRadius: 20,
                            borderWidth: 1,
                            borderColor: 'green', marginVertical: 5,
                            alignSelf: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => signUp(question, answer, newpassword1, newpassword2, username, newaccount)}
                    >
                        <Text
                            style={{
                                color: 'blue',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginHorizontal: 5,
                                fontSize: 18,
                                fontStyle: 'italic',
                            }}

                        >
                            Create Account
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row',justifyContent:'center', marginVertical: 6 }}><Text> If you have an account, </Text>
                    <TouchableOpacity

                        onPress={() => navigation.navigate("sign-in")}
                    >
                        <Text
                            style={{
                                color: '#0dcaf0',
                                // fontWeight: 'bold',
                                textAlign: 'center',
                                marginHorizontal: 5,
                                // fontSize: 18,
                                fontStyle: 'italic',
                            }}>
                            logIn here
                        </Text>
                    </TouchableOpacity></View>
            </View>
        </View>
    </ScreenContainer>;
}