import React, { useState, useContext, useEffect } from 'react';
import { Authentication } from '../../context';
import { ScreenContainer } from '../styles/styles';
import { Text, TextInput, View, ImageBackground, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
export const SignIn = ({ navigation }) => {
    const { signIn } = useContext(Authentication)
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    return (<ScreenContainer>
        <View style={{
            marginHorizontal: 5, flex: 0.7, flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

        }}>
            <View
                style={
                    [styles.flexxcontainer
                        , { backgroundColor: 'white', }]
                }
            >
                <TextInput
                    style={styles.input1}
                    placeholderTextColor="#0dcaf0"  placeholder="Enter your username"
                    onChangeText={(username) => setusername(username)}
                    value={username}
                    underlineColorAndroid="#0dcaf0"


                />
                <TextInput
                    style={styles.input1}
                    placeholderTextColor="#0dcaf0"  placeholder="Enter your password"
                    onChangeText={(password) => setpassword(password)}
                    secureTextEntry={true}
                    value={password}
                    underlineColorAndroid="#0dcaf0"


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
                        onPress={() => signIn(username, password)}
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
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', justifyContent:'center',alignItems:'center', marginVertical: 6 }}><Text> If you don't have an account </Text>
                    <TouchableOpacity

                        onPress={() => navigation.navigate("createAccount")}
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
                            Create Account here
                        </Text>
                    </TouchableOpacity></View>
            </View>

        </View>

    </ScreenContainer>);
}