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
        <SafeAreaView className="flex-1 bg-[#252525]">
            <View className="p-4">
                <Text className="font-gotham text-[#DDD] text-[48px] text-center">HuskyEats</Text>
            </View>
            <ScrollView className="flex-1 bg-[#2e2e2e]">
                <View className="items-center my-6">
                    {halls.map((hall, index) => (
                        <Pressable className="border-[2px] border-[#1F1F1F] bg-[#1a1a1a] rounded-[30px] w-[95%] h-[120px] my-2 p-5 flex-col justify-between"
                            key={index}
                            onPress={() => navigation.navigate("Hall", {hall: hall, meal: findMealtime(hall)[0]})}>
                            <View className='flex-row justify-between'>
                                <Text className="font-lexend text-[32px] text-[#DDD]" >{hall.name}</Text>
                                <Text className="font-lexend text-[24px] text-[#DDD]" >{findMealtime(hall)[0]}</Text>
                            </View>
                            <Text className="font-lexend font-light text-[20px] text-[#DDD] text-right" >{findMealtime(hall)[1]}</Text>
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

export function inInterval(time: string | null) {
    if (time === null) return [false, ""];

    const interval = time.split("-");
    const start = stringToDate(interval[0]);
    const end = stringToDate(interval[1]);
    const now = new Date();

    if (start <= now && now <= end) return [true, end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })];
    return [false, ""];
}

export function findMealtime(hall: DiningHall) {
    const day = new Date().getDay()

    if (day === 0 || day === 6) {
        if (day === 6) if (inInterval(hall.wesatbreakfast)[0]) return ["Breakfast", `Until ${inInterval(hall.wesatbreakfast)[1]}`];
        if (day === 0) if (inInterval(hall.wesunbreakfast)[0]) return ["Breakfast", `Until ${inInterval(hall.wesunbreakfast)[1]}`];
        if (inInterval(hall.webrunch)[0]) return ["Brunch", `Until ${inInterval(hall.webrunch)[1]}`];
        if (inInterval(hall.wedinner)[0]) return ["Dinner", `Until ${inInterval(hall.wedinner)[1]}`];
    } else {
        if (inInterval(hall.wdbreakfast)[0]) return ["Breakfast", `Until ${inInterval(hall.wdbreakfast)[1]}`];
        if (inInterval(hall.wdlunch)[0]) return ["Lunch", `Until ${inInterval(hall.wdlunch)[1]}`];
        if (inInterval(hall.wddinner)[0]) return ["Dinner", `Until ${inInterval(hall.wddinner)[1]}`];
    }

    return ["Closed", ""];
}
