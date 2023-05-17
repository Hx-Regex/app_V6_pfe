import { StyleSheet, Switch, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState} from 'react'
import { ref , set , get , update, remove , child , onValue} from 'firebase/database'
import { auth, db, firestoreDB } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconX from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react'
import { doc, setDoc, getDocs,getDoc , collection, query, where } from "firebase/firestore";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const HomeScreen = () => {
      

  const navigation = useNavigation()
  const [LEDValue, setLEDValue] = useState(false)
  const [stocknotif , setStocknotif] = useState(false)


  const [Temperature, setTemperature] = useState(0)
  const [Stock , setStock] = useState(0)
  const [Humidity, setHumidity] = useState(0)
  const [windowMGR, setWindowMGR] = useState(false)
  const [windowAuto, setWindowAuto] = useState(false)
  const [windowState, setWindowState] = useState(false)
  const [loading, setLoading] = useState(false)



  const [tempNotif, setTempNotif] = useState(false)
  const [testauth , setTestauth] = useState('')
  const [userData, setUserData] = useState(null)
  const [infopage, setInfopage ] = useState(false)
  const [stockpage , setStockpage] = useState(false)


  async function getDataFromDb() {
    const docRef = doc(firestoreDB, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    setUserData(data);
  }



  const handleSignOut  = () => {
     async function clearUserData(){
      try {
        await AsyncStorage.removeItem('smartemail');
        await AsyncStorage.removeItem('smartpassword');
      } catch (error) {
        console.log(error);
      }
    };
    clearUserData()
    auth.signOut().then(() => {
      navigation.replace("Login")
    }).catch(error => alert(error.message))
  }
  


  const handlereset =  async () =>{
    
      await sendPasswordResetEmail(auth ,auth.currentUser.email).then(() =>{
        alert("Password reset email send check spam folder")
      }).catch((error) => {
        alert(error)
      })
    
  }

  const handleAddUser = () => {
    navigation.replace("Register")
  }
  const handleDeleteUser = () => {
    navigation.replace("Users")
  }

  const writeAutoWind = async () => {
    const allRef = ref(db, 'All');
    const allSnapshot = await get(allRef);
    const allValue = allSnapshot.val();
    
    const updatedAllValue = {
      ...allValue,
      Auto: !windowAuto,
      Window : windowState,
    };
    
    set(allRef, updatedAllValue);
    
  };
  const writeOpenWindow = async () => {
    if(!windowAuto){
      const allRef = ref(db, 'All');
      const allSnapshot = await get(allRef);
      const allValue = allSnapshot.val();
      
      const updatedAllValue = {
        ...allValue,
        Window: !windowMGR,
        State : !windowMGR
      };
      
      set(allRef, updatedAllValue);

    }
  
  };

  


   

    // useEffect(() => {
    //   const Humiddir = ref(db, 'Air/Humid'); // Accessing the LED1 child node
    //   onValue(Humiddir, (snapshot) => {
    //     const data = snapshot.val();
    //     updateledstate(data);
    //   });
    //   const Tempdir = ref(db, 'Air/Temp'); // Accessing the LED1 child node
    //   onValue(Tempdir, (snapshot) => {
    //     const data = snapshot.val();
    //     updateTemp(data);
    //   });
      
    // }, []);
//      const handletest = () => {
// -
//         setLEDValue(!LEDValue)
//         set(ref(db, 'Air'),{
//           Temp : Temprature + 1,
//         })
//      }
useEffect(() => {
  setLoading(true);

  getDataFromDb();
  const interval = setInterval(() => {
    const Tempdir = ref(db, 'All/Temp');
    onValue(Tempdir, (snapshot) => {
      const data = snapshot.val();
      setTemperature(data);
    });

    const Stockdir = ref(db, 'All/Coffee');
    onValue(Stockdir, (snapshot) => {
      const data = snapshot.val();
      setStock(data)
    });

    const Humiddir = ref(db, 'All/Humid');
    onValue(Humiddir, (snapshot) => {
      const data = snapshot.val();
      setHumidity(data)
    });
    const AutoWind = ref(db, 'All/Auto');
    onValue(AutoWind, (snapshot) => {
      const data = snapshot.val();
      setWindowAuto(data)
    });
    const WindCMD = ref(db, 'All/Window');
    onValue(WindCMD, (snapshot) => {
      const data = snapshot.val();
      setWindowMGR(data)
    });
    const WindState = ref(db, 'All/State');
    onValue(WindState, (snapshot) => {
      const data = snapshot.val();
      setWindowState(data)
      if (data !== null) {
        setLoading(false);
      }
    });
    
  }, 1000);

  return () => {
    clearInterval(interval);
  };
}, []);






// let Temperature = 0;
// let Stock = 0;
// let Humidity = 0;

// function getData() {
//   return new Promise((resolve, reject) => {
//     const Tempdir = ref(db, 'Air/Temp');
//     onValue(Tempdir, (snapshot) => {
//       const data = snapshot.val();
//       Temperature = data;
//       resolve();
//     });


  // });
// }

// setInterval(() => {
//   getData().then(() => {
//     console.log(Temperature, Stock, Humidity); // You can use the variables here
//   });
// }, 2000);



   
    const stocknotifbg = stocknotif ? '#2b79d5' : '#b5b5b5'
    const windowbg = windowMGR ? '#2b79d5' : '#b5b5b5'
    const temponotifbg = tempNotif ? '#2b79d5' : '#b5b5b5'
    const homebg = !infopage && !stockpage  ? '#02c38e' : '#424242'
    const infobg = infopage && !stockpage ? '#02c38e' : '#424242'
    const  windowbtn = windowAuto ? '#2e2e2e' : `${windowMGR ? 'red' : '#02c38e'}`


   
    

  
    
    
  return (
    // <View style={styles.container}>
    //     <Text>U sername : { auth.currentUser?.displayName} </Text>
    //     <Text>Temprature : {Temprature} C </Text>
    //     <Text>Humidity : {Humidity} % </Text>


    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={handleSignOut}
    //     >
          
    //       <Text style={styles.buttonText}>SignOut</Text>

    //     </TouchableOpacity>
        
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={handlereset}
    //     >
          
    //       <Text style={styles.buttonText}>Reset Password</Text>

    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={handleLED}
    //     >
          
    //       <Text style={styles.buttonText}>Switch Led</Text>

    //     </TouchableOpacity>
        
    // </View>
<>  
    <View style={{ position : 'absolute', width : '100%', height : '100%' , justifyContent : 'center', alignItems : 'center' , zIndex: 999, display : `${loading ? 'flex' : 'none'}`,backgroundColor : 'rgba(0, 0, 0, 0.4)'  }}>
          <ActivityIndicator style={{}} size={60} />
    </View>

    <View style={styles.container}>
              {
          !infopage && !stockpage ? (
            <>
              <View style={styles.statscontainer}>
                <View style={{  width : '45%', height : '100%' , backgroundColor : '#2d2d2d', flexDirection : 'column', justifyContent : 'space-evenly', alignItems  : 'center' , borderRadius : 7, borderWidth : 0, borderColor : "#02c38e" }}>
                    <View style= {{ width : scale(65) , height : scale(65), borderRadius : 100, backgroundColor : '#434343', justifyContent : 'center', alignItems : 'center' }}>
                          <Icon name="temperature-high" size={scale(30)} color="#02c38e" />
                    </View>
                    <Text style={{ fontSize : scale(16), fontWeight : 'bold', color : 'white' }}>Temperature</Text>
                    <Text style={{ fontSize : scale(25), fontWeight : 'bold' , color : '#02c38e'}}>{Temperature}°C</Text>
               
               
               </View>

               <View style={{  width : '45%', height : '100%' , backgroundColor : '#2d2d2d', flexDirection : 'column', justifyContent : 'space-evenly', alignItems  : 'center' , borderRadius : 7, borderWidth : 0, borderColor : "#02c38e"   }}>
                    <View style= {{ width : scale(65) , height : scale(65), borderRadius : 100, backgroundColor : '#434343', justifyContent : 'center', alignItems : 'center' }}>
                          <IconX name="water" size={scale(40)} color="#02c38e" />
                    </View>
                    <Text style={{ fontSize : scale(16), fontWeight : 'bold', color : 'white' }}>Humidity</Text>
                    <Text style={{ fontSize : scale(25), fontWeight : 'bold' , color : '#02c38e'}}>{Humidity}%</Text>
               
               
               </View>
              </View>
              <View style={styles.cubecontainer}>
                <View
                  style={{
                    width: "100%",
                    height: "43%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderRadius : 15,

                  }}
                >
                    <View style= {{ width : '70%' , height : '100%', flexDirection : 'row' , backgroundColor  : '#2d2d2d', padding : 0, borderBottomStartRadius : 7 , borderBottomEndRadius : 0, borderTopEndRadius : 0, borderTopStartRadius : 7, borderWidth : 0, borderColor : '#02c38e'  }}>
                          <View style= {{ width : '45%' , height : '100%', alignItems : 'center', justifyContent : 'space-evenly' }}>
                                <View style={{ width : scale(75), height : scale(75), backgroundColor : '#434343', borderRadius : 100, justifyContent : 'center', alignItems : 'center' }}>
                                     <IconX name="window-closed-variant" size={verticalScale(40)} color="#02c38e" />
                                     
                                </View>
                                <Switch
                                  trackColor={{ false: "#b5b5b5", true: "#02c38e" }}
                                  thumbColor={"#fff"}
                                  ios_backgroundColor="#3e3e3e"
                                  onValueChange={writeAutoWind}
                                  value={windowAuto}
                                  style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                                />

                          </View>

                          <View style= {{ width : '55%' , height : '100%', textAlign : 'center', paddingVertical : 15 }}>
                                <View>
                                   <Text style= {{ fontSize : scale(25) , fontWeight : 'bold', color : 'white' }}>Windows</Text>
                                   <Text style= {{ fontSize : scale(17) , fontWeight : 'bold', color : 'white' }}>Manager</Text>
                                </View>
                                  
                                  <Text
                                     style={{ fontSize: scale(13), fontWeight: "bold", color: "gray" }}
                                   >
                                  {windowAuto ? "Automatic" : "Manual"} Mode
                                  </Text>
                                  <Text
                                     style={{ fontSize: scale(14), fontWeight: "bold", color: "gray", marginTop : 'auto' }}
                                   >
                                     Window is {windowState ? "Opened" : "Closed"} 
                                  </Text>
                          </View>
                    </View>
                    {/* {windowMGR ? "Close" : "Open"} */}

                    <TouchableOpacity onPress={writeOpenWindow} style= {{ width : '28%' , height : '100%', justifyContent : 'center', alignItems : 'center' , backgroundColor  :windowbtn   , borderBottomStartRadius : 0 , borderBottomEndRadius : 7, borderTopEndRadius : 7, borderTopStartRadius : 0 }}>
                              <Text style={{ fontSize : scale(22), fontWeight : 'bold', color : 'white' }}>{windowAuto ? "Auto" : `${windowMGR ? "Close" : "Open"}`}</Text>
                    </TouchableOpacity>
                    

                
                </View>

                        <TouchableOpacity
                          onPress={() => setStockpage(true)}
                          style={{
                            width: "100%",
                            height: "43%",
                            backgroundColor: "#2e2e2e",
                            borderRadius: 7,
                            flexDirection: "row",
                            borderWidth : 0,
                            borderColor : '#02c38e'
                          }}
                        >
                            <View style= {{ width : '35%' , height : '100%', padding : 8, flexDirection : 'column', alignItems : 'center' , justifyContent : 'center' }}>
                                  <View style={{ width : scale(75), height : scale(75), backgroundColor : '#424242', borderRadius : 100, justifyContent : 'center', alignItems : 'center' }}>
                                        <IconX name="food" size={verticalScale(40)} color="#02c38e" />
                                  </View>
                            </View>
                            <View style= {{ paddingVertical : 8, justifyContent : 'center' }}>
                              <Text style= {{ fontSize : scale(25), fontWeight : 'bold', color : 'white' }}>Inventory</Text>
                              <Text style= {{ fontSize : scale(20), fontWeight : 'bold', color : 'white' }}>System</Text>
                            </View>
                            <View style= {{ justifyContent : 'center', alignitems : 'center' , width : '30%' }}>
                               <View style={{ justifyContent : 'center', alignItems : 'center', marginLeft : 'auto' , marginRight : 15 }}>
                                   <Icon name="external-link-alt" size={verticalScale(25)} color="#02c38e" />
                               </View>
                            </View>
                          
                        </TouchableOpacity>

                
              </View>
            </>
          ) : '' }





       
       
                {
                  infopage && !stockpage ?     
                //   <View
                //   style={{
                //     width: "100%",
                //     height: "75%",
                //     padding: 30,
                //     flexDirection: "column",
                //     gap: 5,
                //   }}
                // >
                //   <View>
                //     <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                //       Welcome {userData?.username}
                //     </Text>
                //     <Text style={{ fontSize: 16, flexDirection: "row", marginBottom: 20 }}>
                //       You're a{" "}
                //       <Text style={{ fontWeight: "bold", color: "#2b79d5" }}>
                //         {userData?.role}
                //       </Text>
                //     </Text>
                //   </View>

                //   <TouchableOpacity onPress={handlereset}>
                //     <View
                //       style={{
                //         flexDirection: "row",
                //         width: "100%",
                //         height: 60,
                //         gap: 20,
                //         alignItems: "center",
                //       }}
                //     >
                //       <Icon name="user-lock" size={27} color="black" />
                //       <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                //         Reset Password
                //       </Text>
                //     </View>
                //   </TouchableOpacity>
                //       { userData?.role == 'Admin' ?   
                //       <TouchableOpacity onPress={handleDeleteUser}>
                //     <View
                //       style={{
                //         flexDirection: "row",
                //         width: "100%",
                //         height: 60,
                //         gap: 20,
                //         alignItems: "center",
                //       }}
                //     >
                //       <Icon name="users-cog" size={27} color="black" />
                //       <Text style={{ fontSize: 18, fontWeight: "bold" }}>Check Users</Text>
                //     </View>
                //   </TouchableOpacity> : ''}
                

                //   <TouchableOpacity onPress={handleSignOut} style={{ marginTop: "auto" }}>
                //     <View
                //       style={{
                //         width: "100%",
                //         height: 60,
                //         flexDirection: "row",
                //         gap: 20,
                //         alignItems: "center",
                //       }}
                //     >
                //       <Icon name="sign-out-alt" size={27} color="black" />
                //       <Text style={{ fontSize: 18, fontWeight: "bold" }}>Log Out</Text>
                //     </View>
                //   </TouchableOpacity>
                // </View> 
                <>
                  <View style={{ width : '90%', height : '18%', borderWidth : 0, borderColor : '#2e2e2e' , backgroundColor : '#2e2e2e', borderRadius : 7, flexDirection : 'row', alignItems : 'center' }}>
                        <View style={{ width : '37%', height : '100%', justifyContent : 'center', alignItems : 'center', borderRadius : 15 }}>
                              <View style={{ width : scale(70), height : scale(70), backgroundColor  : '#424242', borderRadius : 100,justifyContent : 'center', alignItems : 'center' }}> 
                                  <Icon name="user-alt" size={scale(30)} color="#02c38e" />
                              </View>

                        </View>
                        <View style= {{ width : '63%', height : '100%', justifyContent : 'center', overflow : 'hidden' }}>
                             <Text style={{ fontSize  : scale(18), color : 'gray'  }}>Username : <Text style={{ fontWeight  : 'bold', color : 'white'  }}>{userData?.username}</Text></Text>
                             <Text style={{ fontSize  : scale(15), color : 'gray'  }}>Role : <Text style={{ fontWeight  : 'bold', color  : `${userData?.role == 'Admin' ? 'red': '#02c38e'}` }}>{userData?.role}</Text></Text>
                             <Text style={{ fontSize  : scale(13), color : 'gray'  }}>Email : <Text style={{ fontWeight  : 'bold', color : 'white' }}>{userData?.email}</Text></Text>
                        </View>
                  </View>

                  <View style={{ width : '90%', height : '40%',borderWidth : 0, borderColor : '#2b78d5', backgroundColor : '#2e2e2e', borderRadius : 7 }}>
                    <TouchableOpacity onPress={handlereset} style={{ width : '100%', height  : 'auto', padding : 19,borderColor : '#424242', borderBottomWidth : 2, alignItems : 'center', flexDirection  :'row', gap : 10 }}>
                                <Icon name="user-lock" size={27} color="#8d8d8d" />
                                <Text style={{ fontWeight  : 'bold', fontSize : scale(15), color : '#8d8d8d'  }}>Reset Password</Text>
                    </TouchableOpacity>
                    { userData?.role == 'Admin' ?  <TouchableOpacity onPress={handleDeleteUser} style={{ width : '100%', height  : 'auto',borderColor : '#424242', padding : 19, borderBottomWidth : 2, alignItems : 'center', flexDirection  :'row', gap : 10 }}>
                                <Icon name="users" size={27} color="#8d8d8d" />
                                <Text style={{ fontWeight  : 'bold', fontSize : scale(15), color : '#8d8d8d'  }}>Users List</Text>
                    </TouchableOpacity> : ''}
                    <TouchableOpacity onPress={handleSignOut} style={{ width : '100%', height  : 'auto', marginTop  : 'auto',padding : 19, borderTopWidth : 2,borderColor : '#424242', alignItems : 'center', flexDirection  :'row', gap : 10 }}>
                                <Icon name="sign-out-alt" size={27} color="#8d8d8d" />
                                <Text style={{ fontWeight  : 'bold', fontSize : scale(15), color : '#8d8d8d' }}>Log Out</Text>
                    </TouchableOpacity>

                  </View>
                </>
                :  '' }


        {stockpage ?
        <View style= {{ width : '96%', height : 'auto' , backgroundColor : '#2e2e2e', borderWidth : 0, borderColor : '#2b79d5', borderRadius : 7 , flexDirection : 'column', paddingVertical : 30, gap : 20 }}>
        <View style= {{ width : '100%', height : 90 , justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10 }}>
                  <View style= {{ flexDirection : 'row' , alignItems : 'center' , gap : 10 }}> 
                        <Icon name="coffee" size={20} color="#02c38e" />
                        <Text style= {{ fontSize : 18 , fontWeight : 'bold', color : 'white'}}>Coffee Capsules</Text>                                             
                  </View>
                  <View style= {{ width : '90%', height : '40%', padding : 0, backgroundColor : '#424242', borderRadius : 40, position  : 'relative', }}>
                    <View style={{  width : '100%', height  : '100%' , position : 'absolute', borderRadius : 30  , justifyContent : 'center', alignItems : 'center' , zIndex : 999 }}>
                        <Text style= {{ fontSize : 17 , fontWeight : 'bold', color : 'white'}}>{Stock} / 100</Text>   
                    </View>
                    <View style={{  width : `${Stock}%`, height  : '100%', borderRadius : 30 , backgroundColor : '#02c38e'}}>         
                    </View>
                  </View>
        </View>

        <View style= {{ width : '100%', height : 90 , justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10 }}>
                  <View style= {{ flexDirection : 'row' , alignItems : 'center' , gap : 10 }}> 
                        <Icon name="candy-cane" size={20} color="#02c38e" />
                        <Text style= {{ fontSize : 18 , fontWeight : 'bold', color : 'white'}}>Sugar Packets</Text>                                             
                  </View>
                  <View style= {{ width : '90%', height : '40%', padding : 0, backgroundColor : '#424242', borderRadius : 40, position  : 'relative', }}>
                    <View style={{  width : '100%', height  : '100%' , position : 'absolute', borderRadius : 30  , justifyContent : 'center', alignItems : 'center' , zIndex : 999 }}>
                        <Text style= {{ fontSize : 17 , fontWeight : 'bold', color : 'white'}}>20 / 40</Text>   
                    </View>
                    <View style={{  width : '50%', height  : '100%', borderRadius : 30,backgroundColor : '#02c38e'}}>         
                    </View>
                  </View>
        </View>

        <View style= {{ width : '100%', height : 90 , justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10 }}>
                  <View style= {{ flexDirection : 'row' , alignItems : 'center' , gap : 10 }}> 
                        <IconX name="tea" size={25} color="#02c38e" />
                        <Text style= {{ fontSize : 18 , fontWeight : 'bold', color : 'white'}}>Tea Packets</Text>                                             
                  </View>
                  <View style= {{ width : '90%', height : '40%', padding : 0, backgroundColor : '#424242', borderRadius : 40, position  : 'relative', }}>
                    <View style={{  width : '100%', height  : '100%' , position : 'absolute', borderRadius : 30  , justifyContent : 'center', alignItems : 'center' , zIndex : 999 }}>
                        <Text style= {{ fontSize : 17 , fontWeight : 'bold', color : 'white'}}>30 / 55</Text>   
                    </View>
                    <View style={{  width : '66%', height  : '100%', borderRadius : 30 , backgroundColor : '#02c38e'}}>         
                    </View>
                  </View>
        </View>

       
  </View>
        : ''}

      



        <View style={styles.navBar}>
         

                <View style={{ width : '100%', height :'100%' , justifyContent : 'space-between' , alignItems : 'center', flexDirection : 'row' }}>

                      <View style={{ width : '35%', height : '100%' , justifyContent : 'center', alignItems : 'center' }}>
                              <TouchableOpacity onPress={() => {setInfopage(false); setStockpage(false)}}><Icon name="home"  size={verticalScale(30)} color={homebg} /></TouchableOpacity>
                      </View>
                      { userData?.role == 'Admin' ?    
                         <TouchableOpacity onPress={handleAddUser} style={{ width : "30%", height : '100%', backgroundColor : '#02c38e', borderRadius : 10, justifyContent : 'center', alignItems : 'center' }}>
                              <Icon name="user-plus"  size={verticalScale(30)} color='white'/>
                        </TouchableOpacity>
                         : '' }

                      <View style={{ width : '35%', height : '100%', justifyContent : 'center', alignItems : 'center'  }}>
                          <TouchableOpacity onPress={() => {setInfopage(!infopage); setStockpage(false)}} ><Icon name="user-alt"  size={verticalScale(30)} color={infobg}/></TouchableOpacity>
                      </View>

                     

                </View>


               
        </View>

    </View>
    </>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : '100%',
    backgroundColor : '#1e1e1e',
    flex : 1,
    marginTop : 0,
    alignItems : 'center',
    justifyContent : 'center',
    gap : 15,
  },
  statscontainer : {
    width : '90%',
    height : '25%',
    borderRadius : 20,
    flexDirection : 'row',
    justifyContent : 'space-between'

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
    height : "8%",
    backgroundColor : '#2d2d2d',
    position : 'absolute',
    bottom : '0%',
    borderRadius : 0
  },
  stats : {
    width : '50%',
    height : '100%',
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-evenly',
  }
  
})