import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const Task2 = (props) => {
     const [newitem,setnewitem]= useState();
  const DeleteTask=(deleteitem)=>
  {
    Alert.alert('hello');
    firestore()
    .collection('LatestDocument')
    .doc(deleteitem)
    .delete()
    .then(() => {
      console.log('User deleted!');
    });

  }

  const UpdateTask=(UpdateItem)=>
  {
    
    firestore()
  .collection('LatestDocument')
  .doc(UpdateItem)
  .update({
    name:'NewOrange',
  })
  .then(() => {
    console.log('User updated!');
  });
  }
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <Text style={styles.itemText}>{props.text}</Text>
      </View>
      <TouchableOpacity style={styles.circular} onPress={()=>DeleteTask(props.text)}><Text>D</Text></TouchableOpacity>
      <TouchableOpacity style={styles.circular2} onPress={()=>UpdateTask(props.text)}><Text>U</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 20,
    height: 20,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  circular2: {
    width: 20,
    height: 20,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft:-140
  },
});

