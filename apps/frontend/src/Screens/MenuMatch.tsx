import { useState } from 'react';
import { Pressable, Text, View, Image, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import { DatePicker } from '../../components/nativewindui/DatePicker';
import * as ImagePicker from "expo-image-picker";
import { ItemMatch } from '../api';
import "../../global.css";

export default function MenuMatch() {
    const [screen, setScreen] = useState<string>("upload");

    const [hall, setHall] = useState<number | null>(null);
    const [meal, setMeal] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    const [image, setImage] = useState<string | null>(null);

    const [result, setResult] = useState<ItemMatch[]>([]);

    const pickImage = async () => {
        // Ask for media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "We need access to your photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            // In SDK 49+ the assets array is used
            const uri = result.assets[0].uri;
            setImage(uri);
            setScreen("details");
        }
    };

    const changeScreen = (screen : string) => {
        setScreen(screen);
    }

    const predict = async () => {
        try {
            if (image) {
                const img = await fetch(image);
                const blob = await img.blob();

                const res = await fetch("https://busy-outreach-virtue-lauderdale.trycloudflare.com/predict?dining_hall_id=5&meal_time=lunch&meal_date=2025-11-25", {
                    method: "POST",
                    headers: {
                        "Content-Type": "image/png",
                    },
                    body: blob,
                });

                const data = await res.json();
                console.log(data);
                setResult(data);
                setScreen("results");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const formatDate = (value: Date) => {
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        const year = value.getFullYear();
        return `${month}-${day}-${year}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-[#252525]">
            <Text className="mt-8 font-gotham text-[#DDD] text-[40px] text-center">Welcome to</Text>
            <Text className="font-lexend text-[#DDD] text-[48px] text-center">MenuMatch</Text>
            {screen === "upload" ? (
            <>
                <Text className="mt-[30%] font-lexend font-light text-[#888] text-[20px] text-center" >
                    Please provide an image of your meal...
                </Text>

                <Pressable 
                    className="mt-20 flex bg-[#455875] p-3 w-80 h-[12%] rounded-[5px] self-center justify-center"
                    onPress={pickImage}>
                    <Text className="font-lexend font-bold text-[32px] text-[#deebff] text-center">Upload Image</Text>
                </Pressable>
            </>
            ) : screen === "details" ? (
            <>
                <Text className="mt-10 font-lexend font-light text-[#888] text-[20px] text-center" >Enter the details of your meal below...</Text>

                <Picker
                    selectedValue={hall}
                    onValueChange={(value) => setHall(value)}
                    >
                    <Picker.Item label="Select a hall…" value={null} />
                    <Picker.Item label="Connecticut" value={3} />
                    <Picker.Item label="McMahon" value={5} />
                    <Picker.Item label="North" value={7} />
                    <Picker.Item label="Northwest" value={15} />
                    <Picker.Item label="Putnam" value={6} />
                    <Picker.Item label="South" value={16} />
                    <Picker.Item label="Towers" value={42} />
                    <Picker.Item label="Whitney" value={1} />
                </Picker>

                <Picker
                    selectedValue={meal}
                    onValueChange={(value) => setMeal(value)}
                    >
                    <Picker.Item label="Select a meal..." value={null} />
                    <Picker.Item label="Breakfast" value="breakfast" />
                    <Picker.Item label="Lunch" value="lunch" />
                    <Picker.Item label="Dinner" value="dinner" />
                </Picker>

                <View style={{ marginHorizontal: 125 }}>
                    <DatePicker
                        value={date}
                        mode="date"
                        style={{ width: 320, height: 120, transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        onChange={(ev) => {
                            setDate(new Date(ev.nativeEvent.timestamp));
                        }}
                    />
                </View>

                <Pressable
                    className="mt-10 bg-[#2071f5] p-3 w-40 rounded-[5px] self-center"
                    onPress={() => changeScreen("review")}>
                    <Text className="font-gotham font-bold text-[32px] text-[#deebff] text-center">Next</Text>
                </Pressable>
            </>
            ) : screen === "review" ? (
            <>
                <Text className="mt-10 font-lexend font-light text-[#888] text-[20px] text-center" >Please review your meal details...</Text>

                <View className="mt-10 flex-1 items-center">
                    {image && 
                        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} resizeMode="contain" />
                    }
                    <View className="mt-20 flex-row w-[70%] justify-between">
                        <Text className="font-lexend text-[32px] text-[#DDD]">{hall}</Text>
                        <Text className="font-lexend text-[32px] text-[#DDD]">{meal}</Text>
                    </View>
                    <Text className="mt-10 font-lexend text-[32px] text-[#DDD]">{formatDate(date)}</Text>
                    
                    <View className="flex-row w-[70%] justify-between">
                        <Pressable
                            className="mt-20 bg-[#33373d] p-3 w-auto rounded-[5px] self-center"
                            onPress={() => changeScreen("details")}>
                            <Text className="font-gotham font-bold text-[24px] text-[#deebff] text-center">Edit</Text>
                        </Pressable>
                        <Pressable
                            className="mt-20 bg-[#2071f5] p-3 w-auto rounded-[5px] self-center"
                            onPress={predict}>
                            <Text className="font-lexend font-bold text-[32px] text-[#deebff] text-center">Calculate</Text>
                        </Pressable>
                    </View>
                </View>

            </>
            ) : (
            <>
                {result.map((item, index) => (
                    <Text
                        className="font-lexend text-[24px] text-[#DDD]" 
                        key={index}>
                        {item.name} {item.servings}
                    </Text>
                ))}
            </>
            )
            }
        </SafeAreaView>
    );
}