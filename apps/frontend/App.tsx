import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
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
        <View style={styles.container}>
            {halls.map((hall, index) => (
                <View>
                    <Text style={{color: '#FFF'}} key={index}>{hall.name}</Text>
                </View>
            ))}
            <StatusBar style="auto" />
        </View>
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
