import { KeyboardAvoidingView,Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestoreDB } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'expo-checkbox';
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

const LoginScreen = () => {
    const [password , setPassword]  = useState('')
    const [username , SetUsername] = useState('')
    const [rememberMe , setRememberMe] = useState(false)
    const [smartEmail , setSmartEmail] = useState('')
    const [user, setUser] = useState()
    const navigation = useNavigation()


    useEffect(() => {
        async function fetchData() {
        
          const etest = await AsyncStorage.getItem('smartemail');
          const ptest = await AsyncStorage.getItem('smartpassword');
          console.log(etest,ptest)
          if (etest && ptest) {
            try {
              const userCredential = await signInWithEmailAndPassword(auth, etest, ptest);
              const user = userCredential.user;
              setUser(user); // store the user data in state or global context
              navigation.replace('Home');
            } catch (error) {
              console.log(error.message);
            }
          }
        }
      
        fetchData();
      }, []);
      


    const handleLogin = async () => {
      const userSearch = collection(firestoreDB, "users");
      console.log(username);
    
      // Query Firestore for the user document with the matching username
      const searchQ = query(userSearch, where("username", "==", username));
      const querySnapshot = await getDocs(searchQ);
    
      let email = null; // Initialize email to null
    
      const doc = querySnapshot.docs[0];
        setSmartEmail(doc.data().email)
        email = doc.data().email; // Update email value
    
    
      // Check if email value is not null before logging in
      if (email !== null) {
        console.log(email);
        try {
          const logUser = await signInWithEmailAndPassword(auth, email, password);
    
          // rememberMe is a boolean value indicating whether the user wants to be remembered
          await AsyncStorage.setItem("smartemail", email); // save the user's email to local storage
          await AsyncStorage.setItem("smartpassword", password); // save the user's password to local storage
    
          console.log("Logged in successfully" + logUser.user.email + logUser.user.password);
          navigation.replace("Home");
        } catch (error) {
          console.log(error.message);
        }
      } else {
        alert("USER Doesn't exist");
      }
    };
    


  
 const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  const [isFocused2, setIsFocused2] = useState(false);
  const handleFocus2 = () => {
    setIsFocused2(true);
  };

  const handleBlur2 = () => {
    setIsFocused2(false);
  };

  const handleforgot = () =>{
    navigation.replace('Reset');
  };
  const handleregister = () =>{
    navigation.replace('Register');
  }

 return (



    <KeyboardAvoidingView
        style={styles.container}
    >

        <View  
            style={{width : '80%', justifyContent :'center', alignItems : 'center'}}        
        >
            {/* <Text style={{fontSize : 40 , fontWeight : 'bold'}}>Welcome</Text> */}
            <Text style={{fontSize : 40 , fontWeight : 'bold'}}>Login Now</Text>
           
        </View>
        


      <View style={styles.inputContainer}>
 
                    <TextInput
                        
                        placeholder="Username"
                        value={username}
                        onChangeText={text => SetUsername(text)}
                        style={[styles.input, isFocused && { backgroundColor: '#bababa' , fontSize : 20}]}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />

           
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                style={[styles.input, isFocused2 && { backgroundColor: '#bababa' , fontSize : 20}]}
                        onFocus={handleFocus2}
                        onBlur={handleBlur2}
                secureTextEntry
            />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent : 'space-between', width: '100%',  marginTop : 20,}}>

        
                <TouchableOpacity onPress={handleforgot} >
                <Text  style={{  color : 'gray',  }}>Forgot password ?/ <Text style={{fontSize : 18 , color : 'black', fontWeight : 'bold'}}>  Reset</Text> </Text>
                </TouchableOpacity>
               
                

                
                

                
                </View>

              <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
            >   

                <Text style={styles.buttonText}>Login </Text>
            </TouchableOpacity>
          
      </View>
        
      </View>
    

    

    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

    image : {
        width : '100%',
        height: '30%'
    },  
    container:{
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        gap : 60,
        backgroundColor : '#fff',
    },

    inputContainer : {
        width: '80%'
    },

    input : {
        backgroundColor: 'white',
        paddingHorizontal : 15,
        height : 60,
        fontWeight : 'bold',
        fontSize : 17,
        paddingVertical : 10,
        borderRadius : 10,
        borderBottomWidth : 1,
        backgroundColor : '#f5f5f5',
        borderBottomColor : 'gray',
        marginTop : 20 ,
    },

    buttonContainer : {
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 20, 
    },

    button : {
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#848cf9',
        height : 60,
        width : '100%',
        padding : 10,
        borderRadius : 10,
        alignItems : 'center'
    },

    buttonOutline : {
        backgroundColor : 'white',
        marginTop : 5,
        borderColor: '#0782F9',
        borderWidth : 2,
    },

    buttonText : {
        color : 'white',
        fontWeight : '700',
        fontSize : 20,
    },

    buttonOutlineText : {
        color : '#b12242',
        fontWeight : '700',
        fontSize : 16,
    },


})