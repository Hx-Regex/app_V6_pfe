import { StyleSheet, Switch, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState} from 'react'
import { ref , set , get , update, remove , child , onValue} from 'firebase/database'
import { auth, db, firestoreDB } from '../firebase'
import { reload, sendPasswordResetEmail } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconX from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react'
import { doc, setDoc, getDocs,getDoc , collection, query, where, deleteDoc } from "firebase/firestore";

const Userdatascreen =   () => {
    
   



 
      

  const navigation = useNavigation()

  const [userData, setUserData] = useState(null)
  const [infopage, setInfopage ] = useState(false)
  const [stockpage , setStockpage] = useState(false)
  const [Users , setUsers] = useState([])
  const [reloadbitch , setReloadbitch] = useState(0)

    

  async function getDataFromDb() {
    const docRef = doc(firestoreDB, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    setUserData(data);
  }
  async function getUsers() {
    const docRef = collection(firestoreDB, "users");
    const docSnap = await getDocs(docRef);
    const userList = [];
    docSnap.forEach((user) => {
      userList.push(user.data());
    });
    setUsers(userList)
  }

  async function deleteUser(id){
    await deleteDoc(doc(firestoreDB, "users", id))
    setReloadbitch(reloadbitch + 1)

  }
  async function getbyUsername(username){
    const usersRef = collection(firestoreDB, 'users')
    const q = query(usersRef, where('username', "==", username))
    const qdata = await getDocs(q)  
    qdata.forEach((user) => {
       deleteUser(user.id)
    })  
  }
  


useEffect(() => {
    getDataFromDb()
    getUsers()

}, [reloadbitch]);

const goBackHome = () => {
    navigation.replace("Home")
  }



    const homebg = !infopage && !stockpage  ? '#848cf9' : '#b5b5b5'
    const infobg = infopage && !stockpage ? '#848cf9' : '#b5b5b5'

    
    
  return (



    <View style={styles.container}>


            

<Text style={{fontSize : 30 , fontWeight : 'bold' , marginTop : 20}}> <Icon name="users-cog" size={30} color="black" />  Users List</Text>

            <View style={{ height : '60%' , width : '95%' }}>
                <ScrollView style={{paddingHorizontal : 10 , paddingVertical : 20, backgroundColor : 'white' , borderRadius : 20}}>
                          {Users.map((user) => (
                             <View key={user.username} style = {{backgroundColor : 'white',  width : '100%' , height : 100,borderWidth : 2, borderRadius : 10, padding : 5, flexDirection : 'row', marginBottom : 15, alignItems : 'center', }}>
                             <View style={{ flexDirection : 'column', width : '65%', height : '100%', padding : 5 }}>
                                     <Text style={{ fontSize : 23, fontWeight : 'bold'}}>{user.username}</Text>
                                     <Text style={{ fontSize : 15}}><Text style={{ fontWeight : 'bold' }}>Email</Text> : {user.email}</Text>
                                     <Text style={{ fontSize : 15}}><Text style={{ fontWeight : 'bold' }}>Privilege</Text> : {user.role}</Text>
                             </View>
                             <TouchableOpacity onPress={() => getbyUsername(user.username)} style={{ width : '30%' , height : '80%', marginLeft : 'auto', borderRadius : 10 , justifyContent : 'center', alignItems  : 'center' , borderWidth : 2,  }}>
                             <Text style={{ fontSize : 17, fontWeight : 'bold', color : 'red'}}>Remove</Text>
                             </TouchableOpacity>
                         </View>
                          ))}
                         
                </ScrollView>
            </View>
            <TouchableOpacity style={{justifyContent : 'center', width : '100%' , alignItems : 'center'}} onPress={goBackHome}>
                <Text style={{fontSize : 16 , color : 'gray' , marginTop : 20}}>Back to/ <Text style={{fontSize : 19 , color : 'black', fontWeight : 'bold' , marginTop : 20}}>Home</Text></Text>
            </TouchableOpacity>
            

 

    </View>

  )
}

export default Userdatascreen

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : '100%',
    backgroundColor : '#ededed',
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    gap : 15,
  },
  statscontainer : {
    width : '90%',
    height : '15%',
    backgroundColor : '#848cf9',
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