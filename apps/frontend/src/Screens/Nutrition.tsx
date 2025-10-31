import { useState, useEffect } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNutritionFacts, NutritionFacts } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import "../../global.css";

type RootStackParamList = {};

const bools = [
    "vegan",
    "vegetarian",
    "glutenfriendly",
    "lesssodium",
    "nogarliconion",
    "containsnuts",
]

export default function Nutrition({route}: any) {
    const id = route.params.id;
    const name = route.params.name;

    const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | null>(null);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const nfRes = await getNutritionFacts({id});
                setNutritionFacts(nfRes);

                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        load();
    }, [])
    
    return (
        <SafeAreaView className="flex-1 bg-[#252525]">
            <View className='flex-row w-full justify-around items-center'>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text className='font-lexend text-[32px] text-white p-5'>{'<'}</Text>
                </Pressable>
                <Text className="font-gotham mt-2 text-[36px] text-[#DDD]" >{name}</Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text className='font-lexend text-[32px] text-white p-5'></Text>
                </Pressable>
            </View>
            <View className="bg-[#2e2e2e]">
                <View className="flex-row">
                    <View className="pl-4 w-[52%] bg-[rgba(56,66,90,0.74)]">
                        <Text className="font-lexend text-[32px] text-white">Serving Size</Text>
                        <Text className="font-lexend text-[32px] text-white">Calories</Text>
                    </View>
                    <View className="ml-4">
                        <Text className="font-lexend text-[32px] text-white">{nutritionFacts?.servingsize}</Text>
                        <Text className="font-lexend text-[32px] text-white">{nutritionFacts?.calories}</Text>
                    </View>
                </View>
                <View className="flex-row">
                    <View className="pl-6 py-2 w-[52%] bg-[rgba(56,66,90,0.4)]">
                        <Text className="font-lexend text-[24px] text-white">Total Fat</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend font-light text-[24px] text-white">&ensp;Sat Fat</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend font-light text-[24px] text-white">&ensp;Trans Fat</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend text-[24px] text-white">Cholesterol</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend text-[24px] text-white">Sodium</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend text-[24px] text-white">Total Carbs</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend font-light text-[24px] text-white">&ensp;Dietary Fiber</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend font-light text-[24px] text-white">&ensp;Total Sugars</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend font-light text-[24px] text-white">&emsp;Added Sugar</Text>
                        <View className="w-[100%] h-0.5 bg-[#4F5972] self-end" />
                        <Text className="font-lexend text-[24px] text-white">Protein</Text>
                    </View>
                    <View className="py-2 w-[48%]">
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.totalfat_g}g</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.saturatedfat_g}g</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.transfat_g}g</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.cholesterol_mg}mg</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.sodium_mg}mg</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.totalcarbohydrate_g}g</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.dietaryfiber_g}g</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.totalsugars_g}g</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.addedsugars_g}g</Text>
                        <View className="w-[80%] h-0.5 bg-[#4A4A4A]" />
                        <Text className="ml-4 font-lexend font-medium text-[24px] text-white">{nutritionFacts?.protein_g}g</Text>
                    </View>
                </View>
                <View className="w-full bg-[rgba(58,72,104,0.16)] p-4">
                    <View className="w-full flex-row justify-around mb-2">
                        <Text className="font-lexend font-light text-[20px] text-white">
                            Calcium <Text className="font-medium">{nutritionFacts?.calcium_mg}mg</Text>
                        </Text>
                        <Text className="font-lexend font-light text-[20px] text-white">
                            Potassium <Text className="font-medium">{nutritionFacts?.potassium_mg}mg</Text>
                        </Text>
                    </View>
                    <View className="w-full flex-row justify-around">
                        <Text className="font-lexend font-light text-[20px] text-white">
                            Vitamin D <Text className="font-medium">{nutritionFacts?.vitamind_mcg}mcg</Text>
                        </Text>
                        <Text className="font-lexend font-light text-[20px] text-white">
                            Iron <Text className="font-medium">{nutritionFacts?.iron_mg}mg</Text>
                        </Text>
                    </View>
                </View>
                {nutritionFacts?.allergens !== "" && (
                <Text className="p-2 font-lexend font-medium text-[24px] text-white">
                    Allergens <Text className="font-light text-[20px]">{nutritionFacts?.allergens}</Text>
                </Text>
                )}
                <View className="flex-row justify-center">
                    <View className="m-3">    
                        <Text className="font-lexend font-light text-[20px] text-white text-right">Vegan {nutritionFacts?.vegan ? "✅" : "❌"}</Text>
                        <Text className="font-lexend font-light text-[20px] text-white text-right">Gluten Friendly {nutritionFacts?.glutenfriendly ? "✅" : "❌"}</Text>
                        <Text className="font-lexend font-light text-[20px] text-white text-right">Less Sodium {nutritionFacts?.lesssodium ? "✅" : "❌"}</Text>
                    </View>
                    <View className="m-3">
                        <Text className="font-lexend font-light text-[20px] text-white text-right">Contains Nuts {nutritionFacts?.containsnuts ? "✅" : "❌"}</Text>
                        <Text className="font-lexend font-light text-[20px] text-white text-right">No Garlic or Onion {nutritionFacts?.nogarliconion ? "✅" : "❌"}</Text>
                        <Text className="font-lexend font-light text-[20px] text-white text-right">Vegetarian {nutritionFacts?.vegetarian ? "✅" : "❌"}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}



{/* {nutritionFacts && Object.entries(nutritionFacts).map(([key, value]) => (
                    <Text className="font-gotham text-[18px] text-[#DDD]" key={key}>
                        {key}: {typeof value === "boolean" ? (value ? "✅" : "❌") : value}
                    </Text>
))} */}