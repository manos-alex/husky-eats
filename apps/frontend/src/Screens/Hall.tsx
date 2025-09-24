import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMenuItems, MenuItem } from '../api';
import "../../global.css";

export default function Hall({route}: any) {
    const [breakfastItems, setBreakfastItems] = useState<MenuItem[]>([]);
    const [lunchItems, setLunchItems] = useState<MenuItem[]>([]);
    const [dinnerItems, setDinnerItems] = useState<MenuItem[]>([]);
    const [displayItems, setDisplayItems] = useState<MenuItem[]>([]);

    const [loading, setLoading] = useState(true);

    const hall = route.params.route;

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const d = new Date(2025, 8, 15);
                const breakfastItemsRes = await getMenuItems({hallid: hall.id, date: d, meal: "Breakfast"});
                const lunchItemsRes = await getMenuItems({hallid: hall.id, date: d, meal: "Lunch"});
                const dinnerItemsRes = await getMenuItems({hallid: hall.id, date: d, meal: "Dinner"});

                setBreakfastItems(breakfastItemsRes);
                setLunchItems(lunchItemsRes);
                setDinnerItems(dinnerItemsRes);

                setDisplayItems(breakfastItemsRes);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        load();
    }, [])

    const changeMeal = (meal: String) => {
        if (meal === "Breakfast") setDisplayItems(breakfastItems);
        if (meal === "Lunch") setDisplayItems(lunchItems);
        if (meal === "Dinner") setDisplayItems(dinnerItems);
    }

    return (
        <SafeAreaView className="flex-1 bg-[#1A1A1A]">
            <View className="items-center">
                <Text className="font-gotham text-[36px] text-[#DDD]" >{hall.name}</Text>
                <View className="flex-row justify-evenly" >
                    <Pressable className="border-4 p-4" onPress={() => changeMeal("Breakfast")} ><Text className="text-[#DDD]" >Breakfast</Text></Pressable>
                    <Pressable className="border-4 p-4" onPress={() => changeMeal("Lunch")} ><Text className="text-[#DDD]" >Lunch</Text></Pressable>
                    <Pressable className="border-4 p-4" onPress={() => changeMeal("Dinner")}><Text className="text-[#DDD]" >Dinner</Text></Pressable>
                </View>
            </View>
            <ScrollView className="flex-1 bg-[#1A1A1A]">
                <View className="flex-1 mt-4 justify-center">
                    {!loading ?
                        <View className="flex-1">
                        {[...new Set(displayItems.map(item => item.station))].map(station => (
                            <View key={station}>
                                <Text className="font-gotham text-[32px] text-[#FFF] bg-[#2A2A2A] px-2 py-4">{station}</Text>
                                {displayItems.filter(item => item.station === station).map((menuItem, index) => (
                                    <Text className="font-gotham text-[24px] text-[#DDD] px-2 py-6 border-b" key={index}>{menuItem.name}</Text>
                                ))}
                            </View>
                        ))}
                        </View>
                        : <Text className="text-[#DDD]" >loading...</Text>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}