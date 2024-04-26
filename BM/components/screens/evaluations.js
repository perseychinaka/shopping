import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements'
import { Authentication, Authorisation } from '../../context';
import * as DB from './database';
import { TabsStackScreen } from '../../App'
import * as deviceinfo from 'react-native-device-info';
import { ScreenContainer, styles } from '../styles/styles';
// import {Icon} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
export const EVALUATIONS = ({ navigation }) => {
  const [activated, setactivated] = useState(false);
  const [trialexpired, settrialexpired] = useState(false);
  const { signOut } = useContext(Authentication)
  const { userroles, currentuser } = useContext(Authorisation)

  useEffect(() => {
    // userroles.reduce((prev, { name }) => { if ('Can approve' == name) setIsAuthorised(true) }, 0);
  }, []);


  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', margin: 5 }}>
       <TouchableOpacity
          style={styles.homebutton}
          onPress={() => navigation.push('Sold Products')}
        ><Avatar
            size={50}
            ImageComponent={() => <Image
              style={styles.stretch}
              source={require('../assets/receipt.png')}
            />}
          />
          <Text style={styles.heading}>Reciepts</Text>
        </TouchableOpacity>

       

      
        <TouchableOpacity
          style={styles.homebutton}
          onPress={() => navigation.push('Profit and Loss account')}
        >
          <Avatar
            size={50}
            ImageComponent={() => <Image
              style={styles.stretch}
              source={require('../assets/pnl.png')}
            />}
          /><Text style={styles.heading}>Profit & Loss </Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ flexDirection: 'row', margin: 5 }}>

        <TouchableOpacity
          style={styles.homebutton}
          onPress={() =>
            navigation.push('Server')
          }
        >
          <Text style={styles.heading}>Server</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homebutton}
          onPress={() =>
            navigation.push('Client')
          }
        >
          <Text style={styles.heading}>Client</Text>
        </TouchableOpacity>
      </View> */}
    </ScreenContainer>
  );
};
