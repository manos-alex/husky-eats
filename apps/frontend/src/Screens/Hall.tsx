import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, Pressable } from 'react-native';
import "../../global.css";
import { useState, useEffect } from 'react';
import { DiningHall, getMenuItems, MenuItem } from '../api';

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
                const breakfastItemsRes = await getMenuItems({hallid: hall.id, date: new Date(), meal: "Breakfast"});
                const lunchItemsRes = await getMenuItems({hallid: hall.id, date: new Date(), meal: "Lunch"});
                const dinnerItemsRes = await getMenuItems({hallid: hall.id, date: new Date(), meal: "Dinner"});
                
                setBreakfastItems(breakfastItemsRes);
                setLunchItems(lunchItemsRes);
                setDinnerItems(dinnerItemsRes);
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
        <ScrollView className="flex-1 bg-[#1A1A1A]">
            <View className="flex-1 mt-16 items-center justify-center">
                <Text className="text-[36px] text-[#DDD]" >{hall.name}</Text>
                <View className="flex-1 flex-row align-between" >
                    <Pressable className="p-10 border-4" onPress={() => changeMeal("Breakfast")} ><Text className="text-[#DDD]" >Breakfast</Text></Pressable>
                    <Pressable className="p-10 border-4" onPress={() => changeMeal("Lunch")} ><Text className="text-[#DDD]" >Lunch</Text></Pressable>
                    <Pressable className="p-10 border-4" onPress={() => changeMeal("Dinner")}><Text className="text-[#DDD]" >Dinner</Text></Pressable>
                </View>
                {!loading ?
                    <>
                    {displayItems.map((menuItem, index) => (
                        <View className="" key={index} >
                            <Text className="text-[#DDD]" >{menuItem.name}</Text>
                        </View>
                    ))}
                    </>
                    : <Text className="text-[#DDD]" >loading...</Text>
                }
            </View>
        </ScrollView>
    )
}