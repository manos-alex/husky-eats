import { useState, useMemo } from 'react';
import { ScrollView, Pressable, Text, View, Image, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import { DatePicker } from '../../components/nativewindui/DatePicker';
import * as ImagePicker from "expo-image-picker";
import { getNutritionFacts, NutritionFacts, ItemMatch } from '../api';
import "../../global.css";

const halls: Record<number, string> = {
    3: "Connecticut",
    5: "McMahon",
    7: "North",
    15: "Northwest",
    6: "Putnam",
    16: "South",
    42: "Towers",
    1: "Whitney"
}

const cardColors = [
    "#F7D7A3",
    "#8FC6A9",
    "#F2A7A5",
    "#F9F3A6",
    "#7FB2D9",
    "#D6C8F5",
]

const result: ItemMatch[] = [
    {name: "Cross Trax French Fries", id: "161069", servings: 0.75},
    {name: "Fried Chicken Nuggets", id: "111037", servings: 2},
    {name: "Corn", id: "171012", servings: 1},
]

export default function MenuMatch() {
    const [screen, setScreen] = useState<string>("upload");

    const [hall, setHall] = useState<number | null>(null);
    const [meal, setMeal] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    const [image, setImage] = useState<string | null>(null);

    // const [result, setResult] = useState<ItemMatch[]>([]);
    const [nutrition, setNutrition] = useState<NutritionFacts[]>([]);

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

    const checkDetails = () => {
        if (!hall) {
            alert("You must select a dining hall");
            return;
        }
        if (!meal) {
            alert("You must select a meal time");
            return;
        }
        else {
            setScreen("review");
        }
    }

    const predict = async () => {
        // try {
        //     if (image) {
        //         const img = await fetch(image);
        //         const blob = await img.blob();

        //         const res = await fetch("https://busy-outreach-virtue-lauderdale.trycloudflare.com/predict?dining_hall_id=5&meal_time=lunch&meal_date=2025-11-25", {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "image/png",
        //             },
        //             body: blob,
        //         });

        //         const data = await res.json();
        //         console.log(data);
        //         setResult(data);
        //         setScreen("results");
        //     }
        // } catch (err) {
        //     console.error("Failed to predict items and servings.", err);
        // }

        const result: ItemMatch[] = [
            {name: "Cross Trax French Fries", id: "161069", servings: 0.75},
            {name: "Fried Chicken Nuggets", id: "111037", servings: 2},
            {name: "Corn", id: "171012", servings: 1},
        ]

        return result;
    }

    const fetchNutrition = async () => {
        try {
            const nf = await Promise.all(
                result.map((item) => getNutritionFacts({ id: Number(item.id) }))
            );
            setNutrition(nf);
        } catch (err) {
            console.error("Failed to fetch nutrition facts.", err);
        }
    }

    const handleCalculate = async () => {
        const items = await predict();
        if (items.length) {
            await fetchNutrition();
            setScreen("results");
        }
    }

    const totals = useMemo(() => {
        return result.reduce(
            (acc, item) => {
                const facts = nutrition.find((n) => n.id === Number(item.id));
                if (!facts) return acc;

                const servings = item.servings ?? 0;
                acc.calories += (facts.calories ?? 0) * servings;
                acc.carbs += (facts.totalcarbohydrate_g ?? 0) * servings;
                acc.protein += (facts.protein_g ?? 0) * servings;
                acc.fat += (facts.totalfat_g ?? 0) * servings;
                return acc;
            },
            {calories: 0, carbs: 0, protein: 0, fat: 0}
        );
    }, [result, nutrition]);

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
                    <Text className="font-lexend font-bold text-[32px] text-[#deebff] text-center">Choose Image</Text>
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
                    onPress={checkDetails}>
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
                    <View className="mt-10 flex-row w-[85%] justify-center">
                        <View className="mx-5">
                            <Text className="font-gotham text-[20px] text-[#DDD]">Hall</Text>
                            <Text className="font-lexend text-[32px] text-[#DDD]">{hall && halls[hall]}</Text>
                        </View>
                        <View className="mx-5">
                            <Text className="font-gotham text-[20px] text-[#DDD]">Meal</Text>
                            <Text className="font-lexend text-[32px] text-[#DDD]">
                                {meal === "breakfast" ? "Breakfast" :
                                meal === "lunch" ? "Lunch" :
                                "Dinner"
                                }
                            </Text>
                        </View>
                    </View>
                    <View className="mt-10">
                        <Text className="font-gotham text-[20px] text-[#DDD]">Date</Text>
                        <Text className="font-lexend text-[32px] text-[#DDD]">{formatDate(date)}</Text>    
                    </View>

                    <View className="flex-row w-[70%] justify-between">
                        <Pressable
                            className="mt-20 bg-[#33373d] p-3 w-auto rounded-[5px] self-center"
                            onPress={() => changeScreen("details")}>
                            <Text className="font-gotham font-bold text-[24px] text-[#deebff] text-center">Edit</Text>
                        </Pressable>
                        <Pressable
                            className="mt-20 bg-[#2071f5] p-3 w-auto rounded-[5px] self-center"
                            onPress={handleCalculate}
                            >
                            <Text className="font-lexend font-bold text-[32px] text-[#deebff] text-center">Calculate</Text>
                        </Pressable>
                    </View>
                </View>

            </>
            ) : (
            <>
                <Text className="mt-3 font-lexend font-light text-[#888] text-[20px] text-center" >Here is the breakdown...</Text>

                <Text className="font-lexend text-[16px] text-[#DDD]">{totals.calories} {totals.carbs} {totals.protein} {totals.fat}</Text>
                
                <ScrollView>
                    <View className="flex-1 items-center">
                    {result.map((item, index) => {
                        const nf = nutrition.find((n) => n.id === Number(item.id));
                        if (!nf) return null;
                        const bgColor = cardColors[index % cardColors.length];

                        return (
                            <View
                                className="m-3 w-[95%] rounded-[10px] border-[1px] border-black p-4 bg-black flex"
                                style={{ backgroundColor: bgColor }}
                                key={item.id}>
                                <Text className="font-lexend font-bold text-[30px] text-[#000]" >{item.name}</Text>
                                <View className="flex">
                                <View>
                                    <Text className="font-lexend text-[24px] text-[#000]">Serving Size: {nf.servingsize}</Text>
                                    <Text className="font-lexend text-[24px] text-[#000]">Number of Servings: {item.servings}</Text>
                                </View>
                                    <View className="flex-row justify-around">
                                        <Text className="font-lexend font-light text-[20px] text-[#000]">{((nf.calories ?? 0) * item.servings).toFixed(1)} calories</Text>
                                        <Text className="font-lexend font-light text-[20px] text-[#000]">{((nf.totalcarbohydrate_g ?? 0) * item.servings).toFixed(1)}g carbs</Text>
                                    </View>
                                    <View className="flex-row justify-around">
                                        <Text className="font-lexend font-light text-[20px] text-[#000]">{((nf.protein_g ?? 0) * item.servings).toFixed(1)}g protein</Text>
                                        <Text className="font-lexend font-light text-[20px] text-[#000]">{((nf.totalfat_g ?? 0) * item.servings).toFixed(1)}g fat</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    </View>
                </ScrollView>
            </>
            )
            }
        </SafeAreaView>
    );
}

export function formatDate(value: Date){
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const year = value.getFullYear();
    return `${month}/${day}/${year}`;
};