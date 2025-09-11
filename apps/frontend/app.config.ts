import 'dotenv/config';
import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
    name: "Husky Eats",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/bruger.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    ios: {
        supportsTablet: true
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        edgeToEdgeEnabled: true
    },
    web: {
        favicon: "./assets/favicon.png",
        bundler: "metro",
    },
    extra: {
        API_BASEURL: process.env.API_BASEURL,
    }
}

export default config;