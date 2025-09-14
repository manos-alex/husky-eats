import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Pressable } from 'react-native';
import "../../global.css";
import { useState, useEffect } from 'react';
import { getDiningHalls, DiningHall } from '../api';

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
        <ScrollView className="flex-1 bg-[#1A1A1A]">
            <View className="items-center my-20">
                {halls.map((hall, index) => (
                    <Pressable className="border-[2px] border-[#1F1F1F] bg-[#141414] rounded-[30px] w-[95%] h-[120px] my-2 p-5 flex-row justify-between"
                        key={index}
                        onPress={() => navigation.navigate("Hall", {route: hall})}>
                        <Text className="font-[400] text-[36px] text-[#DDD]" >{hall.name}</Text>
                        <Text className="text-[24px] text-[#DDD]" >{findMealtime(hall)}</Text>
                    </Pressable>
                ))}
                <StatusBar style="auto" />
            </View>
        </ScrollView>
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
