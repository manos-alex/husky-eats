import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { checkAPI } from './api';

export default function App() {
    const [status, setStatus] = useState("Not connected");

    useEffect(() => {
        checkAPI()
            .then((json) => {
                if (json.ok) setStatus("Connected to API");
            })
            .catch((err) => setStatus(`Error: ${err.message}`))
    }, []);

    return ( 
        <View style={styles.container}>
            <Text>{status}</Text>
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
