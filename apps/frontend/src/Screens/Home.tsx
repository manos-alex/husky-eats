import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getDiningHalls, DiningHall } from '../api';
import "../../global.css";

export default function Home({ navigation }: any) {
    const [halls, setHalls] = useState<DiningHall[]>([]);

    // Load hall data on mount
    useEffect(() => {
        async function load() {
            try {
                const hallsRes = await getDiningHalls({});
                setHalls(hallsRes);
            } catch (err) {
                console.log(err);
            }
        }

        load();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#1e1e1e]">
            <View className="p-4">
                <Text className="font-gotham text-[#DDD] text-[48px] text-center">HuskyEats</Text>
            </View>
            <ScrollView className="flex-1 bg-[#252525]">
                <View className="items-center my-6">
                    {halls.map((hall, index) => (
                        <Pressable className="border-[2px] border-[#1F1F1F] bg-[#1a1a1a] rounded-[30px] w-[95%] h-[120px] my-2 p-5 flex-row justify-between"
                            key={index}
                            onPress={() => navigation.navigate("Hall", {hall: hall, meal: findMealtime(hall)})}>
                            <Text className="font-museo text-[32px] text-[#DDD]" >{hall.name}</Text>
                            <Text className="font-museo text-[24px] text-[#DDD]" >{findMealtime(hall)}</Text>
                        </Pressable>
                    ))}
                    <StatusBar style="auto" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export function stringToDate(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
}

export function findMealtime(hall: DiningHall) {
    const breakfaststart = stringToDate(hall.breakfaststart);
    const breakfastend = stringToDate(hall.breakfastend);
    const lunchstart = stringToDate(hall.lunchstart);
    const lunchend = stringToDate(hall.lunchend);
    const dinnerstart = stringToDate(hall.dinnerstart);
    const dinnerend = stringToDate(hall.dinnerend);

    const now = new Date();

    if (breakfaststart <= now && now < breakfastend) return "Breakfast";
    if (lunchstart <= now && now < lunchend) return "Lunch";
    if (dinnerstart <= now && now < dinnerend) return "Dinner";
    return "Closed";
}
