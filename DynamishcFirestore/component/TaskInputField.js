import React, {useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, View, TextInput, TouchableOpacity, } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 

export default TaskInputField = (props) => {
    const [task, setTask] = useState();

    const handleAddTask = (value) => {
        props.addTask(value);
        setTask(null);
    }

    return (
       <View>
        <TextInput style={styles.inputField} value={task} onChangeText={text => setTask(text)} placeholder={'Write a task'} placeholderTextColor={'#fff'}/>
        <TouchableOpacity onPress={() => handleAddTask(task)}>
          
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
   
    inputField: {
        
        color: 'red',
        height: 50,
        flex: 1,
        backgroundColor:'white',
        marginBottom:50,
        width:250,
        height:50,   
     },
    button: {
        height: 30,
        width: 30,
        borderRadius: 5,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
});