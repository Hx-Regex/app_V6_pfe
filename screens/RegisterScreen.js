import { KeyboardAvoidingView,Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,  } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'expo-checkbox';
import { firestoreDB } from '../firebase';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import moment from 'moment';
import { doc, setDoc, getDocs,getDoc , collection, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';


const RegisterScreen = () => {
    const navigation = useNavigation()
    
    const [email , setEmail] = useState('');
    const [password , setPassword]  = useState('')
    const [username , setUsername]  = useState('')
    const [user, setUser] = useState()
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [userData , setUserData] = useState();



    const data = [
        { label: 'Adminstrator', value: 'Admin' },
        { label: 'Normal User', value: 'Normal User' },
      ];


      
      async function getDataFromDb() {
        const docRef = doc(firestoreDB, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setUserData(data);
      }
      useEffect(() => {     
        getDataFromDb();
      }, []);
      
const handleSignUp = async () => {
    if (!username || !password || !email || !value) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const signUser = await createUserWithEmailAndPassword(auth, email, password).then(() => {
        const user = auth.currentUser;
        // Add user information to Firestore
        const userRef = doc(firestoreDB, 'users', user.uid);
        setDoc(userRef, {
          email: email,
          password: password,
          username: username,
          role: value // You can set the role to a default value or ask the user to select their role during sign-up.
        });
      });

      const currentDate = moment().format('DD/MM/YYYY [at] HH:mm:ss');
      const userRef = doc(firestoreDB, 'Logs', uuidv4());
      setDoc(userRef, { 
        user: userData.username,
        date: currentDate,
        action: `Created New User Named ${username} , With ${value} Role`,
        tag : 'User',
        role : userData.role,
      });
      alert("User Added Successfully")
      navigation.replace('Login');
    } catch (error) {
      console.log(error.message)
      alert(error.code)
    }
  }
  
    const backtologin  = () =>{
        navigation.replace('Home');
    }

  
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
  const [isFocused3, setIsFocused3] = useState(false);
  const handleFocus3 = () => {
    setIsFocused3(true);
  };

  const handleBlur3 = () => {
    setIsFocused3(false);
    };

    
    const renderLabel = () => {
        if (value || isFocus) {
          return (
            <Text style={[styles.label, isFocus && { color: 'blue' }]}>
              Dropdown label
            </Text>
          );
        }
        return null;
      };
  




 return (



    <KeyboardAvoidingView
        style={styles.container}
    >

        <View  
            style={{width : '80%' , justifyContent : "center" , alignItems : 'center'}}        
        >
            <Text style={{fontSize : 40 , fontWeight : 'bold', color : '#02c38e'}}>Add User</Text>
            {/* <TouchableOpacity onPress={backtologin}>
            <Text style={{fontSize : 16 , color : 'gray' , marginTop : 20}}>Back to /  <Text style={{fontSize : 20 , color : 'black', fontWeight : 'bold'}}>Login In</Text></Text>
            </TouchableOpacity> */}
           
        </View>
        


      <View style={styles.inputContainer}>
                     <TextInput
                        
                        placeholder="Username"
                        placeholderTextColor='white'
                        value={username}
                        onChangeText={text => setUsername(text)}
                        style={[styles.input, isFocused3 && { backgroundColor: '#02c38e' , fontSize : 20}]}
                        onFocus={handleFocus3}
                        onBlur={handleBlur3}
                    />
 
                    <TextInput
                        
                        placeholder="Email"
                        value={email}
                        placeholderTextColor='white'
                        onChangeText={text => setEmail(text)}
                        style={[styles.input, isFocused && { backgroundColor: '#02c38e' , fontSize : 20}]}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />

           
            <TextInput
                placeholder="Password"
                value={password}
                placeholderTextColor='white'
                onChangeText={text => setPassword(text)}
                style={[styles.input, isFocused2 && { backgroundColor: '#02c38e' , fontSize : 20}]}
                        onFocus={handleFocus2}
                        onBlur={handleBlur2}
                secureTextEntry
            />
                <View style={{ width : '100%'}}>
                        <Dropdown
                                style={ { padding : 10, backgroundColor : '#2e2e2e', borderRadius : 5 , color : 'white', borderBottomWidth : 3, marginTop : 15, borderColor : '#02c38e'  } }
                                placeholderStyle={ { color : 'white' , fontWeight : 'bold' }}
                                selectedTextStyle={{ color : `${value == 'Admin' ? 'red' : '#02c38e'}` , marginLeft : 8, fontWeight : 'bold' }}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={{}}
                                data={data}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? '  Select Privilege' : '  ...'}
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue(item.value);
                                    setIsFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                    style={styles.icon}
                                    color={value == 'Admin' ? 'red' : '#02c38e'}
                                    name="Safety"
                                    size={20}
                                    />
                                )}
                        />

                </View>
              <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleSignUp}
                style={styles.button}
            >   

                <Text style={styles.buttonText}>Register </Text>
            </TouchableOpacity>
        
      </View>
            <TouchableOpacity style={{justifyContent : 'center', width : '100%' , alignItems : 'center'}} onPress={backtologin}>
                <Text style={{fontSize : 16 , color : 'gray' , marginTop : 20}}>Back to/ <Text style={{fontSize : 19 , color : 'black', fontWeight : 'bold' , marginTop : 20, color : '#02c38e'}}>Home</Text></Text>
            </TouchableOpacity>
        
        
      </View>
    

    

    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

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
        backgroundColor : '#1c1c1c',
    },

    inputContainer : {
        width: '80%'
    },

    input : {
        backgroundColor: '#2e2e2e',
        paddingHorizontal : 15,
        color : 'white',
        height : 60,
        fontWeight : 'bold',
        fontSize : 17,
        paddingVertical : 10,
        borderRadius : 5,
        borderBottomWidth : 3,
        backgroundColor : '#2e2e2e',
        borderBottomColor : '#02c38e',
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
        backgroundColor : '#02c38e',
        height : 60,
        width : '100%',
        padding : 10,
        borderRadius : 5,
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