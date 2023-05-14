import { KeyboardAvoidingView,StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';


const ResetScreen = () => {
    const [email , setEmail] = useState('');
    const [user, setUser] = useState()
    const navigation = useNavigation()


    const handleForgot =  async () => {
        console.log(email)
        await sendPasswordResetEmail(auth ,email).then(() =>{
            alert("Email sent to reset your password (check spam) ")
            navigation.replace('Login');
          }).catch((error) => {
            if(error.code === 'auth/invalid-email'){
                alert('please enter a valid email')
            }else if(error.code === 'auth/user-not-found'){
                alert("Email Adress Doesn't Exist")
            }else{
                alert(error.code)
            }
          })
          

    }
    const backtologin  = () =>{
        navigation.replace('Login');
    }

 const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

 return (



    <KeyboardAvoidingView
        style={styles.container}
    >

        <View  
            style={{width : '80%'}}        
        >
            <Text style={{fontSize : 40 , fontWeight : 'bold', color : '#8cdb4e'}}>Reset</Text>
            <Text style={{fontSize : 40 , fontWeight : 'bold', color : '#8cdb4e'}}>Password</Text>

            <Text style={{fontSize : 18 , color : 'gray' , marginTop : 20}}>We will send you a reset password email</Text>

           
        </View>
        


      <View style={styles.inputContainer}>
 
                    <TextInput
                        
                        placeholder="Email"
                        placeholderTextColor='#424242'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={[styles.input, isFocused && { backgroundColor: '#b9b9b9' , fontSize : 20}]}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />

           
         
      

              <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleForgot}
                style={styles.button}
            >   

                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
      </View>
      <TouchableOpacity style={{justifyContent : 'center', width : '100%' , alignItems : 'center'}} onPress={backtologin}>
            <Text style={{fontSize : 16 , color : 'gray' , marginTop : 20}}>Back to/ <Text style={{fontSize : 19 , color : '#8cdb4e', fontWeight : 'bold' , marginTop : 20}}>Login</Text></Text>
            </TouchableOpacity>
        
      </View>
    

    

    </KeyboardAvoidingView>
  )
}

export default ResetScreen

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
        backgroundColor: 'white',
        paddingHorizontal : 15,
        color : 'white',
        height : 60,
        fontWeight : 'bold',
        fontSize : 17,
        paddingVertical : 10,
        borderRadius : 10,
        borderBottomWidth : 1,
        backgroundColor : '#2e2e2e',
        borderBottomColor : 'gray',
        marginTop : 0 ,
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
        backgroundColor : '#8cdb4e',
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