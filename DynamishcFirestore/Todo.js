import React from "react";
import { useState } from "react";
import { View,Text,StyleSheet, Alert,TouchableOpacity,Button,TextInput} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { Task } from "./Component/Task";
import TaskItem from "./component/TaskItem";
export const Todo=()=>
{
    const [todo, setTodo ] = useState('');
    const ref = firestore().collection('todos');

    async function addTodo() {
        await ref.add({
          title: todo,
          complete: false,
        });
        setTodo('');
      }
      // ...
   
    return (
        <>
          <View>
        
            <TouchableOpacity style={styles.getbtn} onPress={addTodo}>
            <Text style={styles.gettxt}>AddToDo</Text>
            </TouchableOpacity>
            <TextInput style={styles.textinput} value={todo} onChangeText={setTodo}/>
            </View>
        </>
      );
}

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    getbtn:{
      backgroundColor:'#008CBA',
      width:100,
      height:30,
      marginLeft:20,
      marginTop:25,
      display:'flex',
      
    },
    gettxt:{
      marginLeft:20,
      marginTop:5,
      color:'white'
    },
    textinput:{
        width:100,
        height:40,
        borderBottomWidth:2,
        borderColor:'red',
       
        marginTop:20,
        marginLeft:20
    }
  });

