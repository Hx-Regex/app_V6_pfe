import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ResetScreen from './screens/ResetScreen';
import RegisterScreen from './screens/RegisterScreen';
import 'react-native-gesture-handler';
import UserdataScreen from './screens/UserdataScreen';
import LogsScreen from './screens/LogsScreen';





const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown : false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown : false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown : false}} name="Reset" component={ResetScreen} />
        <Stack.Screen options={{ headerShown : false}} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown : false}} name="Users" component={UserdataScreen} />
        <Stack.Screen options={{ headerShown : false}} name="Logs" component={LogsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
