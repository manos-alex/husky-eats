import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Screens/Home";
import Hall from "./Screens/Hall";
import Nutrition from "./Screens/Nutrition";
import { useFonts } from "expo-font";
import "../global.css";


const Stack = createNativeStackNavigator();

export default function App() {
    // Load font
    const [ready] = useFonts({
        Museo: require("./assets/fonts/MuseoSans-500.otf"),
        Gotham: require("./assets/fonts/Gotham-Light.otf"),
        Lexend: require("./assets/fonts/Lexend-VariableFont_wght.ttf")
    });

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
                    <Stack.Screen name="Home" component={Home}/>
                    <Stack.Screen name="Hall" component={Hall}/>
                    <Stack.Screen name="Nutrition" component={Nutrition}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
