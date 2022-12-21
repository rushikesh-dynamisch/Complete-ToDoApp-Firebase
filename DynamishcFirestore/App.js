// import React from "react";
// import { View,Text,StyleSheet, Touchable, TouchableOpacity } from "react-native";
// import firestore from '@react-native-firebase/firestore';
// import { Todo } from "./Todo";
// import TaskItem from "./component/TaskItem";
// const App= () => {
//   const GetData=()=>
//   {
//   firestore()
//   .collection('users')
//   .doc('mydatabase')
//   .get()
//   .then(documentSnapshot => {
//     console.log('User exists: ', documentSnapshot.exists);

//     if (documentSnapshot.exists) {
//       console.log('User data: ', documentSnapshot.data());
//       const data = documentSnapshot.data();
//       console.log("New data",data.name)
//     }
//   });
// }

//   // return (
//   //   <View>
     
//   //     <TouchableOpacity style={styles.getbtn} onPress={GetData}>
//   //       <Text style={styles.gettxt}>GetData</Text>
//   //     </TouchableOpacity>
//   //     <Todo/>
//   //   </View>
//   // )


//   return (
//     <View>
//       <Todo/>
//     </View>
//   )


// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   getbtn:{
  
//     backgroundColor:'#008CBA',
//     width:100,
//     height:30,
//     marginLeft:130,
//     marginTop:50,
//     display:'flex',
    
//   },
//   gettxt:{
//     marginLeft:20,
//     marginTop:5,
//     color:'white'
//   }
// });
// export default App;

import React, {useState,useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Alert, FlatList,RefreshControl } from 'react-native';
import { Task2 } from './component/Task2';
import firestore from '@react-native-firebase/firestore';
import { GoogleIn } from './GoogleIn';
export default function App() 
{

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    Alert.alert('resfreshing the screen.');
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);



  let newarr =[];
 const[arr,setarr]=useState([]);
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const ref = firestore().collection('LatestDocument');
  
  useEffect(() => {
    const GetData=()=>
      {
      // firestore()
      // .collection('LatestDocument')
      // .get()
      // .then(documentSnapshot => {
      //   console.log('User exists1: ', documentSnapshot.exists);
    
      //   if (documentSnapshot.exists) {
      //     console.log('User data1: ', documentSnapshot.data());
      //     const data = documentSnapshot.data();
      //     console.log("New data1",data.name)
      //     setarr([data.name]);
      //     console.log('new array1',arr);
      //   }
      // });
      firestore()
  .collection('LatestDocument')
  .get()
  .then(querySnapshot => {
    console.log('Total users: ', querySnapshot.size);

    querySnapshot.forEach(documentSnapshot => {
      console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      let documentdata = documentSnapshot.data();
      //  setarr(documentdata.name);
       newarr.push(documentdata.name);
       console.log('newarr',newarr)
       setarr(newarr);
    });
    
  });
      }
    GetData();
  }, []);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    async function addTodo() {
      ref.doc(task)
      .set({
        name: task,
      })
      .then(() => {
        console.log('User added!');
      });
    
    }

    addTodo();
    
  }

  const DeleteTask=(deleteitem)=>
  {
    
    firestore()
    .collection('LatestDocument')
    .doc(deleteitem)
    .delete()
    .then(() => {
      console.log('User deleted!');
    });
    Alert.alert('Deleted');
  }

  const completeTask = (item) => {
    
    // let itemsCopy = [...taskItems];
    // itemsCopy.splice(index, 1);
    // setTaskItems(itemsCopy)
    async function updateTodo()
    {
    ref.doc('item1')
  .update({
    name: 'latestupdate',
  })
  .then(() => {
    console.log('User updated!');
  });
    }
    
    updateTodo();
  }
  // const Taskset=(task)=>
  // {
  //  setTask(task);
  // }
  
  const UpdateTask=(UpdateItem)=>
  {
    console.log('update button');
    firestore()
  .collection('LatestDocument')
  .doc(UpdateItem)
  .update({
    name:task,
  })
  .then(() => {
    console.log('User updated!');
  });
  setTask(null);
  Alert.alert('Updated');
  }
  return (
    
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
     <GoogleIn/>
      
      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
      <FlatList
        refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
       }
     
    
      data={arr}
      renderItem={({ item }) => (
        
        // <TouchableOpacity  onPress={() => DeleteTask(item)}>
        // <TouchableOpacity>
        // <Task2 text={item} /> 
        // </TouchableOpacity>


        <TouchableOpacity>
        <TouchableOpacity onPress={()=>setTask(item)}>
        <Text style={styles.textstyle}>{item}</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=>DeleteTask(item)} style={styles.deletebtn}><Text style={styles.deltext}>DELETE</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>UpdateTask(item)} style={styles.updatebtn}><Text style={styles.upltext}>UPDATE</Text></TouchableOpacity>
        </TouchableOpacity>
      
      )}
      
    />

        </View>
      </View>
    

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1A3C',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'white'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  circular2: {
    width: 20,
    height: 20,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft:-140
  },
  textstyle:{
  color:'white',
  margin:3,
  padding:3,
  fontSize:16
  },
  deletebtn:{
  width:60,
 height:25,
 backgroundColor:'red',
 marginLeft:150,
 marginTop:-25,
 borderWidth:1,
 borderColor:'white'
  },
  updatebtn:{
    width:60,
   height:25,
   backgroundColor:'red',
   marginLeft:220,
   marginTop:-25,
   borderWidth:1,
   borderColor:'white'
    },
    deltext:
    {
      color:'white',
      marginLeft:5
    },
    upltext:
    {
      color:'white',
      margin:'auto',
      marginLeft:2
    },
  addText: {},
}); 




