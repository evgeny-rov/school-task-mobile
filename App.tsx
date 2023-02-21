import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import PrivateScreen from './screens/private';
import { RootStackParamList } from './types/router';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={{ title: 'Главная' }} component={HomeScreen} />
        <Stack.Screen
          name="Private"
          options={{ title: 'Закрытый раздел' }}
          component={PrivateScreen}
        />
        <Stack.Screen name="Login" options={{ title: 'Авторизация' }} component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
