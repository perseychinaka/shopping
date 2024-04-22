import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
  
    },
    plus: {
      fontSize: 34,
      color: '#000',
      fontWeight: 'bold',
  
    },
  });

export const AddFab = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('newProduct')}
        >
            <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
    );
};

export const EditFab = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('editProduct')}
        >
            <Text style={styles.plus}>✎</Text>
        </TouchableOpacity>
    );
};

export const DeleteFab = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('deleteProduct')}
        >
            <Text style={styles.plus}>-</Text>
        </TouchableOpacity>
    );
};