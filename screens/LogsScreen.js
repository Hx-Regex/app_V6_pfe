import { StyleSheet, Switch, Text, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState} from 'react'
import { ref , set , get , update, remove , child , onValue} from 'firebase/database'
import { auth, db, firestoreDB } from '../firebase'
import { deleteUser } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconX from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react'
import { doc, setDoc, getDocs,getDoc , collection, query, where, deleteDoc, orderBy , limit} from "firebase/firestore";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const LoginScreen =   () => {

  const navigation = useNavigation()

  const [userData, setUserData] = useState(null)
  const [Logs , setLogs] = useState([])
  const [reloadbitch , setReloadbitch] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filterby , setFilterby] = useState(null);
    

  async function getLogs() {
    setLoading(true);
  
    try {
      const docRef = collection(firestoreDB, "Logs");
      const q = query(docRef, orderBy("date", "desc") , limit(20));
      const docSnap = await getDocs(q);
  
      const userList = [];
      docSnap.forEach((user) => {
        userList.push(user.data());
      });
      setLogs(userList);
    } catch (error) {
      console.warn("Error:", error);
    }
  
    setLoading(false);
  }

  const handleWindowFilter = () =>{
        if(filterby == 'Window') {
            setFilterby(null)
           
        }else{
            setFilterby('Window')
        }
  }
  const handleUserFilter = () =>{
    if(filterby == 'User') {
        setFilterby(null)
       
    }else{
        setFilterby('User')
    }
}

  



useEffect(() => {
    getLogs()

}, [reloadbitch]);

const goBackHome = () => {
    navigation.replace("Home")
  }

    
  return (

<>

    
          <View style={{ position : 'absolute', width : '100%', height : '100%' , justifyContent : 'center', alignItems : 'center' , zIndex: 999, display : `${loading ? 'flex' : 'none'}`,backgroundColor : 'rgba(0, 0, 0, 0.42)' }}>
                <View style={{ flexDirection : 'row', borderRadius : 5, width : 180, backgroundColor : 'white', height : 60, justifyContent : 'space-evenly', alignItems : 'center' }}>
                      <ActivityIndicator style={{}} size={50} color='#02c38e' />
                      <Text style={{ fontWeight : 'bold', fontSize : 15, color : '#02c38e'}}>Fetching Users..</Text>
                </View>
          </View>
    <View style={styles.container}>


            

            <Text style={{fontSize : 30 , fontWeight : 'bold' , marginTop : 0, color : "#02c38e"}}> <IconX name="notebook-edit-outline" size={35} color="#02c38e" /> App Logs</Text>
                <View style={{ height : 70, width : '100%', paddingHorizontal : 15 , flexDirection : 'row', justifyContent : 'space-evenly'}}>
                    
                <TouchableOpacity onPress={handleWindowFilter} style={{ width : '45%', height : '100%' , backgroundColor : `${filterby == 'Window' ? '#02c38e' : '#2e2e2e'}`, borderRadius : 3, borderWidth : 3, borderColor : `${filterby == 'Window' ? '#2e2e2e' : '#02c38e'}`, alignItems : 'center', justifyContent : 'center' }}>
                            <Text style={{ fontSize : 16 , fontWeight : 'bold', color : `${filterby == 'Window' ? '#2e2e2e' : '#02c38e'}`}}>Window Manager</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUserFilter} style={{ width : '45%', height : '100%' , backgroundColor : `${filterby == 'User' ? '#02c38e' : '#2e2e2e'}`, borderRadius : 3, borderWidth : 3, borderColor : `${filterby == 'User' ? '#2e2e2e' : '#02c38e'}`, alignItems : 'center', justifyContent : 'center' }}>
                            <Text style={{ fontSize : 16 , fontWeight : 'bold', color : `${filterby == 'User' ? '#2e2e2e' : '#02c38e'}`}}>User Manager</Text>
                    </TouchableOpacity>
                    
                </View>

            <View style={{ height : '65%' , width : '100%' }}>
                <ScrollView contentContainerStyle={{ alignItems : 'center'}} style={{paddingHorizontal : 10 , paddingVertical : 20 , borderRadius : 7,}}>
                          {Logs.filter((log) =>{
                            if(filterby === null){
                                return true
                            }else if (filterby === 'User'){
                                return log.tag === "User";
                            }else if (filterby === "Window"){
                                return log.tag === "Window";
                            }
                          }).map((log) => (
                          

                        <View key={log.date} style={{ width: '95%', height : 124, padding : 7, borderLeftWidth : 4, borderColor : `#02c38e`, borderRadius : 3 , backgroundColor : '#2e2e2e', flexDirection : 'column', gap : 2, marginBottom : 15, }}>
                            
                                    <View style={{ width: 'auto', maxWidth : 220, height : 30, backgroundColor : 'red', borderRadius : 3, backgroundColor : '#424242', alignItems : 'center', flexDirection : 'row', justifyContent : 'space-evenly', gap: 10,paddingHorizontal : 10 }}>
                                        <IconX name="clock-time-eight-outline" size={23} color={`#02c38e`}/>
                                        <Text style={{ color : 'white', fontWeight : 'bold', }}>{log.date}</Text>
                                    </View>
                                    <View style={{ flexDirection : 'row', alignItems : 'center' }}><Text style={{ fontSize : 23 , fontWeight : 'bold',marginTop : "auto", color : `${log.role == 'Admin' ? 'red': '#02c38e'}`}}>{log.user}</Text><Text style={{ fontSize : 28 , color : 'white', marginHorizontal : 4 }}>|</Text><Text style={{ fontSize : 16 , fontWeight : 'bold', color : 'gray', marginTop :'auto'}}>{log.tag == "User" ? 'User Manager' : 'Window Manager'}</Text></View>
                                    <View style={{ width : '100%', marginTop : 2 }}><Text style={{ fontWeight: 'regular', fontSize : 16, color : 'white' }}>{log.action}</Text></View>


                  
                          </View>
                          ))} 
                          
                         
                </ScrollView>
            </View>
            <TouchableOpacity style={{justifyContent : 'center', width : '100%' , alignItems : 'center'}} onPress={goBackHome}>
                <Text style={{fontSize : 16 , color : 'gray' , marginTop : 20}}>Back to/ <Text style={{fontSize : 19 , color : 'black', fontWeight : 'bold' , marginTop : 20, color : "#02c38e"}}>Home</Text></Text>
            </TouchableOpacity>
            

 

    </View>
    </>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : '100%',
    backgroundColor : '#1c1c1c',
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    gap : 15,
  },
  statscontainer : {
    width : '90%',
    height : '15%',
    backgroundColor : '#02c38e',
    borderRadius : 20,
    flexDirection : 'row',

  },
  cubecontainer : {
   width : '90%' ,
   height : '45%',
   borderRadius : 15,
   flexDirection : 'column',
   gap : 14,

  },
  navBar : {
    
    width : '100%',
    height : "10%",
    backgroundColor : '#ffffff',
    position : 'absolute',
    bottom : '0%',
  },
  stats : {
    width : '50%',
    height : '100%',
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-evenly',
  }
  
})