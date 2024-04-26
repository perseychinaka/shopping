import React, { useState, useContext, useEffect } from 'react';
import { ScreenContainer } from '../styles/styles';
import { Authentication,Authorisation } from '../../context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, ToastAndroid, View } from 'react-native';

export const MyHeaderRight = ({ navigation }) => {
  const { signOut } = useContext(Authentication)
  const {  currentuser } = useContext(Authorisation);
  return (<View style={{flexDirection:'row'}}><Text  style={{ color:'#fff' ,fontWeight:'bold',fontSize:18 }}>{currentuser.name}</Text><Icon name="power-off" color={'red'}
          onPress={() => {ToastAndroid.showWithGravity('Signing out',
          ToastAndroid.LONG,
          ToastAndroid.CENTER);signOut()}}
          style={{ borderRadius: 9, padding: 5, marginHorizontal: 12, }}
          size={25} />
          {/* <Text  style={{ color:'#fff' }}>{JSON.stringify(currentuser)}</Text> */}
          </View>);
}
// export const Auth = (expected) => {
//   return (<ScreenContainer>
//       <Text>You are not authorised to go to the this screen. {'\n'} You are required to have permissions so that you {expected} </Text>
//   </ScreenContainer>);
// }

