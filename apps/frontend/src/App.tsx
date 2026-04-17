import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import Home from "./Screens/Home";
import Hall from "./Screens/Hall";
import Nutrition from "./Screens/Nutrition";
import MenuMatch from "./Screens/MenuMatch/MenuMatch";
import { useFonts } from "expo-font";
import "../global.css";


const Stack = createNativeStackNavigator();
const APP_BACKGROUND = "#232323";
const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: APP_BACKGROUND,
        card: APP_BACKGROUND,
    },
};

export default function App() {
    // Load font
    const [ready] = useFonts({
        Museo: require("./assets/fonts/MuseoSans-500.otf"),
        Gotham: require("./assets/fonts/Gotham-Light.otf"),
        Lexend: require("./assets/fonts/Lexend-VariableFont_wght.ttf")
    });

    return (
        <View style={{ flex: 1, backgroundColor: APP_BACKGROUND }}>
            <SafeAreaProvider style={{ backgroundColor: APP_BACKGROUND }}>
                <NavigationContainer theme={navigationTheme}>
                    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: APP_BACKGROUND } }} initialRouteName="Home">
                        <Stack.Screen name="Home" component={Home} options={{ animation: "none", gestureEnabled: false }}/>
                        <Stack.Screen name="Hall" component={Hall}/>
                        <Stack.Screen name="Nutrition" component={Nutrition}/>
                        <Stack.Screen name="MenuMatch" component={MenuMatch} options={{ animation: "none", gestureEnabled: false }}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </View>
    );
}
