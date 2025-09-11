import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import "../global.css";
import { useState, useEffect } from 'react';
import { getDiningHalls, DiningHall } from './api';

export default function App() {
    const [halls, setHalls] = useState<DiningHall[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const halls = await getDiningHalls({});
                setHalls(halls);
            } catch (err) {
                console.log(err);
            }
        }

        load();
    }, []);

    return ( 
        <View className="flex-1 bg-white items-center justify-center">
            {halls.map((hall, index) => ( 
                <Text className="font-bold text-blue-500" key={index}>{hall.name}</Text>
            ))}
            <StatusBar style="auto" />
        </View>
    );
}
