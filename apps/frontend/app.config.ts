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
        backgroundColor: "#ffffff"
    },
    ios: {
        supportsTablet: true
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
    extra: {
        API_BASEURL: process.env.API_BASEURL,
    }
}

export default config;