import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMenuItems, MenuItem } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import "../../global.css";

type RootStackParamList = {
    Nutrition: { id: number };
};

export default function Hall({route}: any) {
    const { hall, meal } = route.params;

    const [breakfastItems, setBreakfastItems] = useState<MenuItem[]>([]);
    const [lunchItems, setLunchItems] = useState<MenuItem[]>([]);
    const [dinnerItems, setDinnerItems] = useState<MenuItem[]>([]);
    const [displayItems, setDisplayItems] = useState<MenuItem[]>([]);

    const [curMeal, setCurMeal] = useState(() => (meal !== "Closed" ? meal : "Breakfast"));

    const [loading, setLoading] = useState(true);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const d = new Date();
                const breakfastItemsRes = await getMenuItems({hallid: hall.id, date: d, meal: "Breakfast"});
                const lunchItemsRes = await getMenuItems({hallid: hall.id, date: d, meal: "Lunch"});
                const dinnerItemsRes = await getMenuItems({hallid: hall.id, date: d, meal: "Dinner"});

                setBreakfastItems(breakfastItemsRes);
                setLunchItems(lunchItemsRes);
                setDinnerItems(dinnerItemsRes);

                if (curMeal === "Breakfast") setDisplayItems(breakfastItemsRes);
                else if (curMeal === "Lunch") setDisplayItems(lunchItemsRes);
                else if (curMeal === "Dinner") setDisplayItems(dinnerItemsRes);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        load();
    }, [])

    const changeMeal = (meal: String) => {
        if (meal === "Breakfast") {
            setDisplayItems(breakfastItems);
            setCurMeal("Breakfast");    
        }
        if (meal === "Lunch") {
            setDisplayItems(lunchItems);
            setCurMeal("Lunch");
        }
        if (meal === "Dinner") {
            setDisplayItems(dinnerItems);
            setCurMeal("Dinner");
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-[#1e1e1e]">
            <View className="items-center">
                <View className='flex-row w-full justify-around items-center'>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Text className='font-lexend text-[32px] text-white p-5'>{'<'}</Text>
                    </Pressable>
                    <Text className="font-gotham mt-2 text-[36px] text-[#DDD]" >{hall.name}</Text>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Text className='font-lexend text-[32px] text-white p-5'></Text>
                    </Pressable>
                </View>
                <View className="flex-row items-center mt-2" >
                    <Pressable className={`px-4 py-2 flex-1 ${curMeal === "Breakfast" ? "border-b-4 border-blue-900" : ""}`} onPress={() => changeMeal("Breakfast")} >
                        <Text className="font-lexend text-[#DDD] text-center text-[20px]" >Breakfast</Text>
                    </Pressable>
                    <Pressable className={`px-4 py-2 flex-1 ${curMeal === "Lunch" ? "border-b-4 border-blue-900" : ""}`} onPress={() => changeMeal("Lunch")} >
                        <Text className="font-lexend text-[#DDD] text-center text-[20px]" >Lunch</Text>
                    </Pressable>
                    <Pressable className={`px-4 py-2 flex-1 ${curMeal === "Dinner" ? "border-b-4 border-blue-900" : ""}`} onPress={() => changeMeal("Dinner")}>
                        <Text className="font-lexend text-[#DDD] text-center text-[20px]" >Dinner</Text>
                    </Pressable>
                </View>
            </View>
            <ScrollView className="flex-1 bg-[#252525]">
                <View className="flex-1 justify-center">
                    {!loading ?
                        <View className="flex-1">
                        {[...new Set(displayItems.map(item => item.station))].map(station => (
                            <View key={station}>
                                <Text className="font-lexend text-[28px] text-[#FFF] bg-[#1e1e1e] px-8 py-4">{station}</Text>
                                {displayItems.filter(item => item.station === station).map((menuItem, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => navigation.navigate("Nutrition", {id: menuItem.id})}>
                                        <Text className="font-lexend font-light text-[24px] text-[#DDD] px-8 py-6">{menuItem.name}</Text>
                                    </Pressable>
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