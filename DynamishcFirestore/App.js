


import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Alert, FlatList, RefreshControl } from 'react-native';
import { Task2 } from './component/Task2';
import firestore from '@react-native-firebase/firestore';
import { GoogleIn } from './GoogleIn';
import { Button } from 'react-native-paper';
export default function App() {

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    Alert.alert('resfreshing the screen.');
    fetchMoredata();


    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);



  let newarr = [];
  const [arr, setarr] = useState([]);
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [lastDocument, setLastDocument] = useState();
  const [userData, setUserData] = useState([]);
  const [post,setpost]=useState([]);
  const [postsPerLoad]=useState(10);
  const [StartAfter,setStartAfter]=useState({});
  const ref = firestore().collection('LatestDocument');
 
  useEffect(() => {
   
    fetchdata();
  }, []);

async function fetchdata()
{
  const postData = await GetData(postsPerLoad);
  setpost([...arr, ...postData.arr]);
  setStartAfter(postData.lastvisible);
}

async function fetchMoredata()
{
  const postData = await  Getmoreposts(StartAfter,postsPerLoad);
  setpost([...arr, ...postData.arr]);
  setStartAfter(postData.lastvisible);
}


  const GetData = async (postsPerLoad) => {
  let lastvisible;
   const snapshot=await firestore()
      .collection('LatestDocument')
      .orderBy('name','desc')
      .limit(postsPerLoad)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        let lastvisible =querySnapshot.docs[querySnapshot.docs.length-1];
        console.log("lastitem",lastvisible);
        querySnapshot.forEach(documentSnapshot => {
          console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          let documentdata = documentSnapshot.data();
          //  setarr(documentdata.name);
          newarr.push(documentdata.name);
          console.log('newarr', newarr)
          setarr(newarr);
        });
       
      });
      return {arr,lastvisible}
  }


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

  const DeleteTask = (deleteitem) => {

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
    async function updateTodo() {
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
  const UpdateTask = (UpdateItem) => {
    console.log('update button');
    firestore()
      .collection('LatestDocument')
      .doc(UpdateItem)
      .update({
        name: task,
      })
      .then(() => {
        console.log('User updated!');
      });
    setTask(null);
    Alert.alert('Updated');
  }
  function MakeUserData(docs) {
    let templist = [];
    docs.forEach((doc, i) => {
      console.log(doc._data);
      let temp = (
        <View key={i} style={{ margin: 10 }}>
          <Text>{doc._data.name}</Text>
          <Text>{doc._data.age}</Text>
        </View>
      );
      templist.push(temp);
    });
    setUserData(templist);
  }

  const Getmoreposts=async(StartAfter,postsPerLoad)=>
  {
 const snapshot=await firestore()
   .collection('LatestDocument')
   .orderBy('name','desc')
   .startAfter(StartAfter)
   .limit(postsPerLoad)
   .get()
   .then(querySnapshot => {
     console.log('Total users: ', querySnapshot.size);
     let lastvisible =querySnapshot.docs[querySnapshot.docs.length-1];
     console.log("lastitem",lastvisible);
     querySnapshot.forEach(documentSnapshot => {
       console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
       let documentdata = documentSnapshot.data();
       //  setarr(documentdata.name);
       newarr.push(documentdata.name);
       console.log('newarr', newarr)
       setarr(newarr);
     });
    
   });
   return {arr,lastvisible}
 }

  return (

    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.Paging} onPress={() => LoadData()}><Text style={styles.deltext}>ClikButton</Text></TouchableOpacity> */}
      {/* <GoogleIn/> */}

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          <FlatList
           vertical
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
           

            data={arr}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <TouchableOpacity onPress={() => setTask(item)}>
                  <Text style={styles.textstyle}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => DeleteTask(item)} style={styles.deletebtn}><Text style={styles.deltext}>DELETE</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => UpdateTask(item)} style={styles.updatebtn}><Text style={styles.upltext}>UPDATE</Text></TouchableOpacity>
              </TouchableOpacity>
            )}
            // onEndReached={Getmoreposts}
            // onEndReachedThreshold ={0.01}
            // scrollEventThrottle ={150}
          />
        </View>
      </View>
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
    color: 'white'
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
    alignItems: 'center',
  
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
    // marginTop:100,
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
    // marginTop:900,
  },
  circular2: {
    width: 20,
    height: 20,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: -140,
   
  },
  textstyle: {
    color: 'white',
    margin: 3,
    padding: 3,
    fontSize: 16
  },
  deletebtn: {
    width: 60,
    height: 25,
    backgroundColor: 'red',
    marginLeft: 150,
    marginTop: -25,
    borderWidth: 1,
    borderColor: 'white'
  },
  updatebtn: {
    width: 60,
    height: 25,
    backgroundColor: 'red',
    marginLeft: 220,
    marginTop: -25,
    borderWidth: 1,
    borderColor: 'white'
  },
  deltext:
  {
    color: 'white',
    marginLeft: 5
  },
  upltext:
  {
    color: 'white',
    margin: 'auto',
    marginLeft: 2
  },
  Paging: {
    width: 60,
    height: 25,
    backgroundColor: 'red',
    marginLeft: 220,

    borderWidth: 1,
    borderColor: 'white'
  },
  addText: {},
});


