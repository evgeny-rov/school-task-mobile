import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home_screen';
import { RootStackParamList } from './types/router';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: 'Главная' }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
