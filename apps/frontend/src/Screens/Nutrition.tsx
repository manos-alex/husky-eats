import { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNutritionFacts, NutritionFacts } from '../api';
import "../../global.css";

export default function Nutrition({route}: any) {
    const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | {}>({});
    const [loading, setLoading] = useState(true);

    const id = route.params.id;

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
        <SafeAreaView className="flex-1 bg-[#1A1A1A]">
            <View>
                <Text className="font-gotham text-[24px] text-[#DDD]">Nutrition Facts</Text>
                {Object.entries(nutritionFacts).map(([key, value]) => (
                    <Text className="font-gotham text-[18px] text-[#DDD]" key={key}>
                        {key}: {typeof value === "boolean" ? (value ? "✅" : "❌") : value}
                    </Text>
                ))}
            </View>
        </SafeAreaView>
    )
}