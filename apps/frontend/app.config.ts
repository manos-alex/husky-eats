import 'dotenv/config';
import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
    name: "Husky Eats",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/bruger.png",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
        image: "./src/assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#232323"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.alexman.huskyeats",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./src/assets/adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        edgeToEdgeEnabled: true
    },
    web: {
        favicon: "./src/assets/favicon.png",
        bundler: "metro",
    },
    plugins: [
        [
            "expo-camera",
            {
                cameraPermission: "Allow Husky Eats to access your camera so you can photograph your plate."
            }
        ]
    ],
    extra: {
        API_BASEURL: process.env.API_BASEURL,
        PREDICT_API_URL: process.env.PREDICT_API_URL,
        eas: {
            projectId: "6afe1512-c4a8-4f3c-8f42-1c9e291016a3",
        }
    }
}

export default config;
