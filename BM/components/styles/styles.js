import React, { useState, useEffect, useMemo } from 'react';
import { Authorisation } from '../../context';
import { StyleSheet, Image ,View,Dimensions} from 'react-native';

export const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  ncontainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    // backgroundColor: 'dark',
    flex: 1,
    // 
    justifyContent: 'center',
    alignItems: 'center',
  },
  lcontainer: {
    flex: 1,
    justifyContent: 'center',
  },
  homebutton: {
    textAlign: 'center',
    borderWidth: .5,
    //  
    backgroundColor:"white",
    borderRadius: 10,
    padding: 5,
    margin: 15,
    flex: .5
  },

  homebutton1: {
    alignItems: 'center',
    borderWidth: .5,
   borderColor:'white' ,
       // backgroundColor:"white",
    borderRadius: 10,
    padding: 5,
    margin: 15,
    flex: .5
  },
   stretch: {
    width: 50,
    tintColor:'white',
     borderRadius: 10,
    height: 50,
    // tintColor:'#e32f45'

    resizeMode: 'stretch',
  },
  homebuttonlabel: {
    fontSize: 20,
  color:'white',
    // fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
    heading: {
    fontSize: 20,
    // 
  color:'black',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  flexRow: {
    margin: 5,
    flexDirection: 'row',
  },
  label: {
    // color:'green',
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    // opacity:0.75,
  },
  flexxcontainer: {
    borderColor: 'blue',
    borderRadius: 4,
    borderWidth: .5,
    flex: .8,
    backgroundColor:'white',
    margin: 4,
    padding: 5,
    flexDirection: 'column',
  },
  flexcontainer: {
    borderColor: 'blue',
    borderRadius: 4,
    borderWidth: .5,
    margin: 5,
    padding: 5,
    flexDirection: 'column',

  },

  barcode: {
    borderRadius: 4,
    flex: 2,
    alignItems: 'center',
    borderColor: 'blue',
    paddingHorizontal: 4,
    justifyContent: 'center',
    margin: 4,
    borderWidth: .5,
  },
  input: {
    borderRadius: 4,
    flex: 8,
    height: 38,
    // backgroundColor:'white',
    color:'black', 
    paddingHorizontal: 4,
    marginTop: 4
  },
  input1: {
    borderRadius: 4,
    // 
    // textAlign: 'center',
    color:'black', 
    paddingHorizontal: 4,
    marginTop: 4,
  }, input2: {
    // 
    color:'black', 
    textAlign: 'center'
  },

});
const {width, height} = Dimensions.get('screen');
export const ScreenContainer = ({ children }) => <View style={styles.container} >
  <Image   source={require('../assets/Pins/bg4.jpg')} style={{width:width, height:height,position:'absolute'}}/>
{children}</View>;
