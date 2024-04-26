import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, View, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { styles, ScreenContainer } from '../styles/styles';
import { sign, decode } from "react-native-pure-jwt";
import * as deviceinfo from 'react-native-device-info';
import * as FaIcon from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Authentication } from '../../context';
import * as DB from './database';
import AesGcmCrypto from 'react-native-aes-gcm-crypto';
import { Splash } from './splash'
const db = DB.db;
export const Registration = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [havetoken, sethavetoken] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [FullName, setFullName] = useState('');
  const { authorise } = useContext(Authentication)
  const [Try, setTry] = useState(true);

  const [tocken, setTocken] = useState();
  const key = 'YzZjkNTk5MOMRlzg1zFkMWExOGJmNGQyDhmNDYmVNzk=';
  useEffect(() => {

    DB.updateTrial(setFullName, setPhoneNumber, setIsLoading, setTry).then(
      (r) => {
        setIsLoading(false); authorise(r);
      });
    setIsLoading(false);
  }, []);

  const tokenToData = () => {
    return new Promise((resolve) => {
      decode(tocken, deviceinfo.getUniqueId(), { skipValidation: false }).then(t => {
        AesGcmCrypto.decrypt(t.payload.data.content, key, t.payload.data.iv, t.payload.data.tag, false)
          .then((decryptedData) => { resolve(decryptedData); })
      }).catch(t => { if (t.toString().includes('expired')) alert('Activation key has expired'); else alert('Wrong activation key.\n make sure you enter activation key as received\n') });
    })
  };


  const sendWa = () => getToken().then((data) => {
    Linking.openURL('whatsapp://send?text=' + data + '&phone=+263771266323');
  });
  const sendSms = () => getToken().then((data) => {
    Linking.openURL('sms:+263771266323?body=' + data);
  }
  );
  const activate = () => tokenToData().then((data) => {
    const { FullName, PhoneNumber, deviceName, UniqueId, activated, paid, date, period } = JSON.parse(data);
    if (activated)
      DB.Register(JSON.parse(data)).then((owner) => {
        DB.AddDevice(JSON.parse(data), owner.id).then((id) => {
          alert("Thank you for activating." + data);
          if (paid == "Fully Paid") authorise(true);
          else if (paid == "Partly Paid") authorise(true);
          else Alert.alert("activaion failed", " Invalid activaion key ")
        });
      });
    else alert('Invalid activaion key');
  }).catch((e) => alert('make sure you enter activation key as received'));


  const getToken = () => {
    return new Promise((resolve) => {

      deviceinfo.getDeviceName().then((deviceName) => {
        let dvc = { 'UniqueId': deviceinfo.getUniqueId(), FullName: FullName, PhoneNumber: PhoneNumber, 'deviceName': deviceName }
        AesGcmCrypto.encrypt(JSON.stringify(dvc), false, key).then((result) => {
          sign(
            {
              exp: new Date().getTime() + 10368000, // expiration date, required, in ms, absolute to 1/1/1970
              data: result
            }, // body
            "tony", // secret
            {
              alg: "HS256"
            }
          ).then(t => {
            setTocken(t);
            resolve(t)
            // Linking.openURL('smsto:+2637719266323')
          })// token as the only argument
            .catch(t => console.log(t)); // possible errors

        });
      });
    });
  };
  const tryapp = () => {
    deviceinfo.getDeviceName().then((deviceName) => {
      let dvc = { 'UniqueId': deviceinfo.getUniqueId(), FullName: FullName, activated: false, paid: null, date: new Date(), period: 7, PhoneNumber: PhoneNumber, 'deviceName': deviceName }
      DB.Register(dvc).then((id) => {
        authorise(true);
      })
    })
  };
  // if (isLoading) { return <Splash />; }
  return <ScreenContainer>
    {havetoken ? <ScreenContainer>
      {/* <Text>{JSON.stringify(deviceData)}</Text><Text>{JSON.stringify(tocken)}</Text> */}
      <View ></View>
      <View style={{ alignContent: 'center', flexDirection: 'column', width: '90%', borderColor: 'green', borderRadius: 5, borderWidth: .5, padding: 5, justifyContent: 'center' }}>
        <View >
          <Text style={{ fontWeight: 'bold', marginBottom: 14, borderBottomColor: 'blue', borderBottomWidth: .5 }}>It is recommended to copy token and paste it as received</Text>
          <TextInput
            underlineColorAndroid={'blue'} multiline={true}
            placeholderTextColor="#0dcaf0"  placeholder='Enter your token'
            onChangeText={(name) => setTocken(name)}
          />
        </View>
        <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center', justifyContent: 'center' }} >
          <TouchableOpacity onPress={() => activate()} style={{
            flex: .6,
            padding: 5,
            borderWidth: .5,
            borderColor: 'blue',
            borderRadius: 20,
            alignItems: 'center',
          }} >
            <Icon size={30} color="blue" >Submit</Icon>
          </TouchableOpacity></View></View>
      <View style={{ flexDirection: 'row', margin: 20 }} >
        <TouchableOpacity style={{ flex: 1, borderRadius: 28, marginHorizontal: 5, paddingHorizontal: 5, alignItems: 'center' }}
          onPress={() => sethavetoken(false)} >
          <Text style={{ fontSize: 18, color: "blue" }}>Request for a token</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer> : <ScreenContainer>
      <View ></View>
      <View style={{ alignContent: 'center',backgroundColor:'white', flexDirection: 'column', width: '90%', borderColor: 'green', borderRadius: 5, borderWidth: .5, padding: 5, justifyContent: 'center' }}>
        <View >
          <Text style={{ fontWeight: 'bold' }}>We will have to send this information via whatsapp or SMS message.</Text>
          <Text style={{ fontWeight: 'bold' }}> Please do not edit the message </Text>
          {/* <Text style={{ fontWeight: 'bold', marginBottom: 14, borderBottomColor: 'blue', borderBottomWidth: .5 }}>
            You will be required to make a payment </Text> */}
            <TextInput
            placeholderTextColor="#0dcaf0"  placeholder='Enter your full name'
            value={FullName} underlineColorAndroid={'blue'}
            onChangeText={(name) => setFullName(name)}
           /><TextInput
            underlineColorAndroid={'blue'}
            keyboardType="numeric"
            placeholderTextColor="#0dcaf0"  placeholder='Enter your phone number' value={PhoneNumber}
            onChangeText={(name) => { if (name == '0') { setPhoneNumber('+263'); } else { setPhoneNumber(name); } }}
          />
        </View>
        <View style={{ flexDirection: 'row', margin: 20 }} >
          <TouchableOpacity style={{
            flex: 1, borderRadius: 28,
            marginHorizontal: 5, padding: 5, alignItems: 'center', borderWidth: .5, borderColor: 'green'
          }}
            onPress={() => sendWa()} >
            <Icon name="whatsapp" size={48} color="green" />
          </TouchableOpacity>
          <TouchableOpacity style={{
            flex: 1, borderRadius: 28,
            marginHorizontal: 5, padding: 5, borderWidth: .5, borderColor: 'green'
          }}
            onPress={() => sendSms()} >
            <FaIcon.Icon name="sms" size={48} color="green" />
          </TouchableOpacity>

        </View>
      </View>
      <View style={{ flexDirection: 'row', margin: 40 }} >
        <TouchableOpacity style={{ flex: 1, borderRadius: 28,backgroundColor:'white', marginHorizontal: 5, paddingHorizontal: 5, alignItems: 'center' }}
          onPress={() => sethavetoken(true)} >
          <Text style={{ color: 'blue', fontSize: 18 }}>I have activation token</Text></TouchableOpacity>
      </View>
    {/* nolonger required since trial is now entered atomatically */}
      {/* {Try &&       <View style={{ flexDirection: 'row', margin: 40 }} >
        <TouchableOpacity style={{ flex: 1, borderRadius: 28,backgroundColor:'white', marginHorizontal: 5, paddingHorizontal: 5, alignItems: 'center' }}
          onPress={() => { if (PhoneNumber && FullName) tryapp(); else alert("fill in your name and phone number") }} >
          <Text style={styles.heading}>I want to try it first</Text>
        </TouchableOpacity>
      </View>} */}
    </ScreenContainer>}
  </ScreenContainer>
};
