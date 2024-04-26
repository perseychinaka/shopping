import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { styles, ScreenContainer } from '../styles/styles';
import { sign, decode } from "react-native-pure-jwt";
import * as deviceinfo from 'react-native-device-info';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as DB from './database';
import RadioButtonRN from 'radio-buttons-react-native';
import AesGcmCrypto from 'react-native-aes-gcm-crypto';
import { Splash } from './splash'
const db = DB.db;
export const Tockens = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activationKey, setActivationKey] = useState();
  const [period, setPeriod] = useState();
  const [showperiod, setShowPeriod] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState();
  const [tocken, setTocken] = useState();
  const [paid, setPaid] = useState();
  const key = 'YzZjkNTk5MOMRlzg1zFkMWExOGJmNGQyDhmNDYmVNzk=';
  useEffect(() => {
    setIsLoading(false);
  }, []);
  const tokenToData = () => {
    return new Promise((resolve) => {
      decode(tocken, "tony", { skipValidation: true }).then(t => {
        AesGcmCrypto.decrypt(t.payload.data.content, key, t.payload.data.iv, t.payload.data.tag, false).then((decryptedData) => { resolve(decryptedData); })
      }).catch(t => console.log(t))
    })
  };
  const activate = () => tokenToData().then((data) => {
    let now =new Date();
    const { UniqueId, FullName, PhoneNumber, deviceName } = JSON.parse(data);
    let activeperiod ="unlimited";
    if(paid==="Partly Paid"){
      let date = moment(now).add(period, 'months');
      activeperiod =  date.diff(moment(now), 'days');
      alert(activeperiod);
      }
      let userData = { FullName: FullName, PhoneNumber: PhoneNumber, deviceName: deviceName, UniqueId: UniqueId, activated: true,
       paid: paid, date: now, period: activeperiod };
    DB.Register(userData).then((owner) => DB.AddDevice(userData, owner).then((id) => {
      AesGcmCrypto.encrypt(JSON.stringify(userData), false, key).then((result) => {
        sign(
          {
            exp: new Date().getTime() + 86400000, // expiration date, required, in ms, absolute to 1/1/1970
            data: result
          }, // body
          UniqueId, // secret
          { alg: "HS256" }).then(t => {alert(data); setActivationKey(t); setPhoneNumber(PhoneNumber) })// token as the only argument
          .catch(t => console.log(t)); // possible errors
      });
    }));

  });
  if (isLoading) { return <Splash />; }
  return <ScreenContainer>
    {activationKey ? <ScreenContainer><Text>here is the activation key</Text>
      <TextInput style={{  borderWidth: .5, borderRadius: 5, margin: 5 }} multiline={true} value={activationKey} />
      <View style={{ flexDirection: 'row', margin: 20 }} >
        <TouchableOpacity style={{ flex: 1, borderRadius: 28, marginHorizontal: 5, paddingHorizontal: 5,  alignItems: 'center' }}
          onPress={() => Linking.openURL('whatsapp://send?text=' + activationKey + '&phone=' + PhoneNumber)} >
          <Icon name="whatsapp" size={48} color="#0dcaf0" ></Icon>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('sms:' + PhoneNumber + '?body=' + activationKey)} style={{ flex: 1, borderRadius: 28, marginHorizontal: 5, paddingHorizontal: 5,  alignItems: 'center' }} >
          <Icon size={48} color="blue" >sms</Icon>
        </TouchableOpacity>
      </View>
    </ScreenContainer> : <ScreenContainer>
      <View style={{ alignContent: 'center', flexDirection: 'column', width: '90%', borderColor: 'green', borderRadius: 5, borderWidth: .5, padding: 5, justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', marginVertical: 14, borderBottomColor: 'blue', borderBottomWidth: .5 }}>It is recommended to copy token and paste it as received</Text>
        <View >
       <RadioButtonRN style={{ borderBottomColor: 'blue', marginBottom: 14, paddingBottom: 14, borderBottomWidth: .5 }}
            data={[{ label: "Fully Paid", id: 1 }, { label: "Partly Paid", id: 2 }]}
            selectedBtn={(p) => {
              if (p.id == 1) { setPeriod(), setPaid(p.label); setShowPeriod(false) } else { setShowPeriod(true); setPaid(p.label) }
            }}
            // initial={1}
            textStyle={{
              fontWeight: 'bold',
              textAlign: 'center',
              padding: 5, height: 30, marginHorizontal: 5,
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
          />{showperiod && <TextInput
            style={styles.input}
            underlineColorAndroid={'blue'}
            value={period}
            placeholderTextColor="#0dcaf0"  placeholder='Enter duration in months or fraction of a month'
            keyboardType="numeric"
            onChangeText={(name) => setPeriod(name)}
          />}<TextInput
            style={styles.input}
            value={tocken}
            underlineColorAndroid={'blue'} multiline={true}
            placeholderTextColor="#0dcaf0"  placeholder='Enter token from user'
            onChangeText={(name) => {
              setTocken(name);
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center', justifyContent: 'center' }} >
          <TouchableOpacity onPress={() => {
            if ((paid == 'Partly Paid') && (!period))
              alert("please specify how many days you expect this system to be used");
            else if (!paid )
            alert("please specify payment");
          else activate()
          }} style={{ flex: .6, borderRadius: 28, marginHorizontal: 5, padding: 5,  alignItems: 'center' }} >
            <Icon size={30} color="blue" >Submit</Icon>
          </TouchableOpacity>
        </View>
      </View>

    </ScreenContainer>}
  </ScreenContainer>
};
