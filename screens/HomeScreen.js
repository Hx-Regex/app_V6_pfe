import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
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
      Window: false,
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
        Window: !windowMGR
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
  getDataFromDb()
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
    const WindState = ref(db, 'All/Window');
    onValue(WindState, (snapshot) => {
      const data = snapshot.val();
      setWindowMGR(data)
    });


  }, 1000);

  return () => clearInterval(interval);
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



   
    const stocknotifbg = stocknotif ? '#848cf9' : '#b5b5b5'
    const windowbg = windowMGR ? '#848cf9' : '#b5b5b5'
    const temponotifbg = tempNotif ? '#848cf9' : '#b5b5b5'
    const homebg = !infopage && !stockpage  ? '#848cf9' : '#b5b5b5'
    const infobg = infopage && !stockpage ? '#848cf9' : '#b5b5b5'
   


   
    

  
    
    
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


    <View style={styles.container}>
              {
          !infopage && !stockpage ? (
            <>
              <View style={styles.statscontainer}>
                <View style={styles.stats}>
                  <View
                    style={{
                      width: scale(50),
                      height: scale(50),
                      borderRadius: 100,
                      backgroundColor: "#9ca2ff",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="fire" size={scale(23)} color="white" />
                  </View>
                  <View
                    style={{ flexDirection: "column", justifyContent: "space-evenly" }}
                  >
                    <Text
                      style={{ color: "#5b60ac", fontSize: scale(11), fontWeight: "bold" }}
                    >
                      Temperature
                    </Text>
                    <Text style={{ color: "#fff", fontSize: scale(25), fontWeight: "bold" }}>
                      {Temperature}'C
                    </Text>
                  </View>
                </View>
                <View style={styles.stats}>
                  <View
                    style={{
                      width: scale(50),
                      height: scale(50),
                      borderRadius: 100,
                      backgroundColor: "#9ca2ff",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconX name="waves" size={scale(23)} color="white" />
                  </View>
                  <View
                    style={{ flexDirection: "column", justifyContent: "space-evenly" }}
                  >
                    <Text
                      style={{ color: "#5b60ac", fontSize: scale(11), fontWeight: "bold" }}
                    >
                      Humidity
                    </Text>
                    <Text style={{ color: "#fff", fontSize: scale(25), fontWeight: "bold" }}>
                      {Humidity}%
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.cubecontainer}>
                <View
                  style={{
                    width: "100%",
                    height: "65%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: "48%",
                      height: "100%",
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "78%",
                        borderRadius: 20,
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: "60%",
                          padding: 8,
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <View
                          style={{
                            width: verticalScale(60),
                            height: verticalScale(60),
                            backgroundColor: "#ffdec2",
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Icon name="window-restore" size={verticalScale(24)} color="#f5ab2f" />
                        </View>
                        <View style={{ flexDirection: "column" }}>
                          <Text style={{ fontSize: scale(18), fontWeight: "bold" }}>
                            Window
                          </Text>
                          <Text
                            style={{ fontSize: scale(9), fontWeight: "bold", color: "gray" }}
                          >
                            {windowAuto ? "Automatic" : "Manual"} Mode
                          </Text>
                        </View>
                      </View>

                      <View style={{ height: "100%", width: "40%", padding: 8 }}>
                        <Switch
                          trackColor={{ false: "#b5b5b5", true: "#848cf7" }}
                          thumbColor={"#fff"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={writeAutoWind}
                          value={windowAuto}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "24%",
                        backgroundColor: windowbg,
                        marginTop: "auto",
                        borderBottomStartRadius: 20,
                        borderBottomEndRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity onPress={writeOpenWindow}>
                        <Text
                          style={{ fontWeight: "bold", fontSize: scale(14), color: "#fff" }}
                        >
                          Click to is {windowMGR ? "Close" : "Open"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "48%",
                      height: "100%",
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "78%",
                        borderRadius: 20,
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: "100%",
                          padding: 8,
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <View
                          style={{
                            width: verticalScale(60),
                            height: verticalScale(60),
                            backgroundColor: "#ffd4d4",
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Icon name="fire-alt" size={verticalScale(25)} color="#fa6c6c" />
                        </View>
                        <View style={{ flexDirection: "column" }}>
                          <Text style={{ fontSize: scale(18), fontWeight: "bold" }}>
                            Temperature
                          </Text>
                          <Text
                            style={{ fontSize: scale(8), fontWeight: "bold", color: "gray" }}
                          >
                            Notification
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "25%",
                        backgroundColor: temponotifbg,
                        marginTop: "auto",
                        borderBottomStartRadius: 20,
                        borderBottomEndRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity onPress={() => setTempNotif(!tempNotif)}>
                        <Text
                          style={{ fontWeight: "bold", fontSize: scale(14), color: "#fff" }}
                        >
                          Notification {tempNotif ? "ON" : "OFF"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                      <TouchableOpacity onPress={() => setStockpage(true)} style={{ width : '100%' , height : '100%' }}>
                      <View
                  style={{
                    width: "100%",
                    height: "65%",
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    flexDirection: "column",
                  }}
                >
                  <View style={{ width: "100%", height: "80%", flexDirection: "row" }}>
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 20,
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: "80%",
                          borderRadius: 20,
                          padding: 10,
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            width: scale(70),
                            height: scale(70),
                            backgroundColor: "#eafae8",
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Icon name="database" size={scale(27)} color="#6dfe66" />
                        </View>
                        <Text style={{ fontSize: scale(20), fontWeight: "bold" }}>
                          Coffe Stock{" "}
                        </Text>
                        <Text
                          style={{ fontSize: scale(10), fontWeight: "bold", color: "gray" }}
                        >
                          {" "}
                          Notification{" "}
                        </Text>
                      </View>
                    </View>
                    {/* <View
                      style={{
                        width: "50%",
                        height: "100%",
                        borderBottomRightRadius: 20,
                        padding: 10,
                        borderTopRightRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor: "#6dfe66",
                          borderWidth: 3,
                          borderRadius: 20,
                        }}
                      >
                        <Text style={{ fontSize: 60, color: "#6dfe66" }}>{Stock}</Text>
                        <Text
                          style={{ fontSize: 20, fontWeight: "bold", color: "#6dfe66" }}
                        >
                          Capsules
                        </Text>
                      </View>
                    </View> */}
                  </View>

                  <View
                    style={{
                      width: "100%",
                      height: "20%",
                      backgroundColor: stocknotifbg,
                      marginTop: "auto",
                      borderBottomStartRadius: 20,
                      borderBottomEndRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => setStocknotif(!stocknotif)}>
                      <Text style={{ fontWeight: "bold", fontSize: scale(14), color: "#fff" }}>
                        Notification {stocknotif ? "ON" : "OFF"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                      </TouchableOpacity>
                
              </View>
            </>
          ) : '' }





       
       
                {
                  infopage && !stockpage ?     <View
                  style={{
                    width: "100%",
                    height: "75%",
                    padding: 30,
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                      Welcome {userData?.username}
                    </Text>
                    <Text style={{ fontSize: 16, flexDirection: "row", marginBottom: 20 }}>
                      You're a{" "}
                      <Text style={{ fontWeight: "bold", color: "#848afa" }}>
                        {userData?.role}
                      </Text>
                    </Text>
                  </View>

                  <TouchableOpacity onPress={handlereset}>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        height: 60,
                        gap: 20,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="user-lock" size={27} color="black" />
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Reset Password
                      </Text>
                    </View>
                  </TouchableOpacity>
                      { userData?.role == 'Admin' ?   
                      <TouchableOpacity onPress={handleDeleteUser}>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        height: 60,
                        gap: 20,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="users-cog" size={27} color="black" />
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Check Users</Text>
                    </View>
                  </TouchableOpacity> : ''}
                

                  <TouchableOpacity onPress={handleSignOut} style={{ marginTop: "auto" }}>
                    <View
                      style={{
                        width: "100%",
                        height: 60,
                        flexDirection: "row",
                        gap: 20,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="sign-out-alt" size={27} color="black" />
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Log Out</Text>
                    </View>
                  </TouchableOpacity>
                </View> :  '' }


        {stockpage ?
        <View style= {{ width : '96%', height : '75%' , backgroundColor : 'white', borderRadius : 20 , flexDirection : 'column', paddingVertical : 30, gap : 20 }}>
        <View style= {{ width : '100%', height : 90 , justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10 }}>
                  <View style= {{ flexDirection : 'row' , alignItems : 'center' , gap : 10 }}> 
                        <Icon name="coffee" size={20} color="black" />
                        <Text style= {{ fontSize : 18 , fontWeight : 'bold'}}>Coffee Capsules</Text>                                             
                  </View>
                  <View style= {{ width : '90%', height : '40%', backgroundColor : '#bababa', borderRadius : 40, position  : 'relative', }}>
                    <View style={{  width : '100%', height  : '100%' , position : 'absolute', borderRadius : 30  , justifyContent : 'center', alignItems : 'center' , zIndex : 999 }}>
                        <Text style= {{ fontSize : 17 , fontWeight : 'bold', color : 'white'}}>79 / 100</Text>   
                    </View>
                    <View style={{  width : '79%', height  : '100%', borderRadius : 30 , backgroundColor : '#8087fa'}}>         
                    </View>
                  </View>
        </View>

        <View style= {{ width : '100%', height : 90 , justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10 }}>
                  <View style= {{ flexDirection : 'row' , alignItems : 'center' , gap : 10 }}> 
                        <Icon name="candy-cane" size={20} color="black" />
                        <Text style= {{ fontSize : 18 , fontWeight : 'bold'}}>Sugar Packets</Text>                                             
                  </View>
                  <View style= {{ width : '90%', height : '40%', backgroundColor : '#bababa', borderRadius : 40, position  : 'relative', }}>
                    <View style={{  width : '100%', height  : '100%' , position : 'absolute', borderRadius : 30  , justifyContent : 'center', alignItems : 'center' , zIndex : 999 }}>
                        <Text style= {{ fontSize : 17 , fontWeight : 'bold', color : 'white'}}>20 / 40</Text>   
                    </View>
                    <View style={{  width : '50%', height  : '100%', borderRadius : 30,backgroundColor : '#8087fa'}}>         
                    </View>
                  </View>
        </View>

        <View style= {{ width : '100%', height : 90 , justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10 }}>
                  <View style= {{ flexDirection : 'row' , alignItems : 'center' , gap : 10 }}> 
                        <IconX name="tea" size={25} color="black" />
                        <Text style= {{ fontSize : 18 , fontWeight : 'bold'}}>Tea Packets</Text>                                             
                  </View>
                  <View style= {{ width : '90%', height : '40%', backgroundColor : '#bababa', borderRadius : 40, position  : 'relative', }}>
                    <View style={{  width : '100%', height  : '100%' , position : 'absolute', borderRadius : 30  , justifyContent : 'center', alignItems : 'center' , zIndex : 999 }}>
                        <Text style= {{ fontSize : 17 , fontWeight : 'bold', color : 'white'}}>30 / 55</Text>   
                    </View>
                    <View style={{  width : '66%', height  : '100%', borderRadius : 30 , backgroundColor : '#8087fa'}}>         
                    </View>
                  </View>
        </View>

        <View style= {{ width : '100%', height : 90 , justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10 }}>
                  <View style= {{ flexDirection : 'row' , alignItems : 'center' , gap : 10 }}> 
                        <Icon name="coffee" size={20} color="black" />
                        <Text style= {{ fontSize : 18 , fontWeight : 'bold'}}>Coffee Capsules</Text>                                             
                  </View>
                  <View style= {{ width : '90%', height : '40%', backgroundColor : '#bababa', borderRadius : 40, position  : 'relative', }}>
                    <View style={{  width : '100%', height  : '100%' , position : 'absolute', borderRadius : 30  , justifyContent : 'center', alignItems : 'center' , zIndex : 999 }}>
                        <Text style= {{ fontSize : 17 , fontWeight : 'bold', color : 'white'}}>79 / 100</Text>   
                    </View>
                    <View style={{  width : '79%', height  : '100%', borderRadius : 30 , backgroundColor : '#8087fa'}}>         
                    </View>
                  </View>
        </View>
  </View>
        : ''}

      



        <View style={styles.navBar}>
             { userData?.role == 'Admin' ? <View style={{ position: 'absolute', width : 120, height : 120 , backgroundColor : '#ededed', borderRadius : 100 , bottom : '25%', left : '35%', justifyContent : 'center', alignItems : 'center' }}>
                      <TouchableOpacity onPress={handleAddUser}>
                          <View style={{ width : 100 , height : 100 , backgroundColor : '#848cf9' , borderRadius : 100, justifyContent : 'center', alignItems : 'center' }}>
                              <Icon name="plus"  size={35} color="white"/>      
                          </View>
                      </TouchableOpacity>
                      
                  </View> : '' }

                <View style={{ width : '100%', height :'100%' , justifyContent : 'space-between' , alignItems : 'center', flexDirection : 'row' }}>

                      <View style={{ width : '35%', height : '100%' , justifyContent : 'center', alignItems : 'center' }}>
                              <TouchableOpacity onPress={() => {setInfopage(false); setStockpage(false)}}><Icon name="home"  size={30} color={homebg} /></TouchableOpacity>
                      </View>

                      <View style={{ width : '35%', height : '100%', justifyContent : 'center', alignItems : 'center'  }}>
                          <TouchableOpacity onPress={() => {setInfopage(!infopage); setStockpage(false)}} ><Icon name="user-alt"  size={30} color={infobg}/></TouchableOpacity>
                      </View>

                     

                </View>


               
        </View>

    </View>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : '100%',
    backgroundColor : '#ededed',
    flex : 1,
    marginTop : 100,
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