
import React, {useState,useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Alert, FlatList,RefreshControl } from 'react-native';
import { Task2 } from './component/Task2';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import messaging from "@react-native-firebase/messaging";

export const GoogleIn =()=>
{

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
  
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }
  
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []);

    GoogleSignin.configure({
        webClientId:'398954140264-qf9hh1f76ailokvgtpns5kuc04omjlq6.apps.googleusercontent.com',
      });

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
      
  
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log(token);
    } catch (e) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFCMToken();
    messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });
    
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("onNotificationOpenedApp: ", JSON.stringify(remoteMessage));
    });
    
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            JSON.stringify(remoteMessage)
          );
        }
      });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

  }, []);

 const NotiPermission = async()=>
{
  firebase.messaging().requestPermission()
  .then(()=>
  {
    console.log("user authorised");
  })
  .catch(error=>{
    console.log("permission rejected");
  })  
}


firebase.messaging().hasPermission()
.then(enabled=>{
    if(enabled)
    {
        console.log("user has permission");
    }
else{
console.log('user doesnt have permissions');
NotiPermission();
}})

const SendNotification= async()=>
{
    const FIREBASE_API_KEY='AAAAXOOFEmg:APA91bFiwEXa9LHmgKmS4eeLt6zp23DJxUAijn1lP40SAoS0oKJS0MKFgeRs-qWyltWSSvBcYSPuwomTQDOeGvxtYrdLmogb9dGhyc1Xm9TJiABQOysDoWmQmZbvd9iyhTHem_-AXPJB';
    const message = {
        registration_ids:['d87BZWVYQ4Oa7KUJZ0cOri:APA91bGJEf1hfRP7h1ZvagLL3SyfXLo_r1a22U4o8pTczWSbiuSJlbdgVQpuuO2BvhX1g2Uyq6C71UMTpGKAJpyBzWaYL6TySP7kJ1HpxMYOv_RnmWa_JcWwfxE_vDYQvKsw1eGJZpgh'],
        notification: {
          title: 'TodoApplication',
          body: 'New ToDo Added.',
          "vibrate":1,
          "sound":1,
          "show_in_foreground":true,
          "priority":"high",
          "content_available":true,
        },
    }
    let headers = new Headers({
        "Content-Type":"application/json",
        "Authorization":"key=" + FIREBASE_API_KEY
    });

    let response = await fetch("https://fcm.googleapis.com/fcm/send",{method:"POST",headers,body:JSON.stringify(message)});
    response = await response.JSON();
    console.log(response);
}
      return(
        <TouchableOpacity
         onPress={() => onGoogleButtonPress().then(() => Alert.alert("LogIn Succssfully!."))}
        // onPress={()=>SendNotification()}
         style={styles.Loginbtn} >
          <Text style={styles.logintxt}>LOGIN</Text>
        </TouchableOpacity>
      )
}
 
const styles = StyleSheet.create({
    
    Loginbtn: {
       width:200,
       height:50,
       justifyContent:'center',
       alignItems:'center',
       borderWidth:0.5,
       alignSelf :'center',
       marginTop:50,
      backgroundColor:'#24a0ed',
      borderRadius:30
      
     },
     Logoutbtn: {
       width:200,
       height:50,
       justifyContent:'center',
       alignItems:'center',
       borderWidth:0.5,
       alignSelf :'center',
       marginTop:50,
      backgroundColor:'#24a0ed',
      borderRadius:30
     },
     logintxt:{
       color:'white',
       fontSize:20
     },
     logouttxt:{
       color:'white',
       fontSize:18
     }
   });
