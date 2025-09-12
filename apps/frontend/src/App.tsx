import "../global.css";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Screens/Home";

// Set default font
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [{ fontFamily: "Roboto" }],
};

const Stack = createNativeStackNavigator();

export default function App() {
    // Load font
    const [ready] = useFonts({
        Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    });

    return ( 
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
