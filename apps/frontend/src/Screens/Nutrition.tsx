import { type ReactNode, useEffect, useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getNutritionFacts, NutritionFacts } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import "../../global.css";

type RootStackParamList = {};

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
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id])

    const dietaryTags = nutritionFacts ? [
        { label: "Vegan", value: nutritionFacts.vegan },
        { label: "Vegetarian", value: nutritionFacts.vegetarian },
        { label: "Gluten Friendly", value: nutritionFacts.glutenfriendly },
        { label: "Less Sodium", value: nutritionFacts.lesssodium },
        { label: "No Garlic or Onion", value: nutritionFacts.nogarliconion },
        { label: "Contains Nuts", value: nutritionFacts.containsnuts },
    ] : [];

    return (
        <SafeAreaView className="flex-1 bg-[#232323]" edges={["top", "left", "right"]}>
            <StatusBar style="light" />

            <View className="px-5 pt-2 pb-2">
                <View className="flex-row items-center justify-between">
                    <Pressable
                        className="rounded-full border border-[#202020] bg-[#171717] px-4 py-3"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="font-lexend text-[18px] leading-[18px] text-[#D8D8D8]">Back</Text>
                    </Pressable>
                    <Text className="font-lexend text-[15px] uppercase tracking-[2px] text-[#86A6CF]">
                        Nutrition
                    </Text>
                </View>

                <View className="mt-3 rounded-[24px] border border-[#1A1A1A] bg-[#151515] px-4 py-3">
                    <Text className="font-gotham text-center text-[28px] leading-[34px] text-[#E2E2E2]">
                        {name}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 32 }}>
                {loading ? (
                    <View className="rounded-[28px] border border-[#1E1E1E] bg-[#171717] px-5 py-6">
                        <Text className="font-lexend text-[22px] text-[#E2E2E2]">Loading nutrition...</Text>
                        <Text className="mt-2 font-lexend font-light text-[15px] text-[#A8A8A8]">
                            Pulling nutrition facts for this item.
                        </Text>
                    </View>
                ) : nutritionFacts ? (
                    <>
                        <View className="overflow-hidden rounded-[30px] border border-[#1A1A1A] bg-[#151515]">
                            <View className="bg-[#171D27] px-5 py-5">
                                <Text className="font-lexend text-[15px] uppercase tracking-[2px] text-[#86A6CF]">
                                    Nutrition Facts
                                </Text>
                                <Text className="mt-2 font-lexend text-[38px] leading-[42px] text-[#E2E2E2]">
                                    {formatNumber(nutritionFacts.calories)}
                                </Text>
                                <Text className="font-lexend font-light text-[16px] text-[#AFC8E8]">
                                    calories per serving
                                </Text>
                            </View>

                            <View className="px-5 py-4">
                                <Text className="font-lexend text-[16px] text-[#8C8C8C]">Serving Size</Text>
                                <Text className="mt-1 font-lexend text-[24px] text-[#E2E2E2]">
                                    {nutritionFacts.servingsize || "Not listed"}
                                </Text>
                            </View>
                        </View>

                        <View className="mt-5 flex-row">
                            <MacroTile label="Protein" value={formatAmount(nutritionFacts.protein_g, "g")} color="#8FD1A8" />
                            <MacroTile label="Carbs" value={formatAmount(nutritionFacts.totalcarbohydrate_g, "g")} color="#E8C27A" />
                            <MacroTile label="Fat" value={formatAmount(nutritionFacts.totalfat_g, "g")} color="#E1A0A8" />
                        </View>

                        <NutritionCard title="Macros">
                            <NutrientRow label="Total Fat" value={formatAmount(nutritionFacts.totalfat_g, "g")} />
                            <NutrientRow label="Saturated Fat" value={formatAmount(nutritionFacts.saturatedfat_g, "g")} subtle />
                            <NutrientRow label="Trans Fat" value={formatAmount(nutritionFacts.transfat_g, "g")} subtle />
                            <NutrientRow label="Total Carbs" value={formatAmount(nutritionFacts.totalcarbohydrate_g, "g")} />
                            <NutrientRow label="Dietary Fiber" value={formatAmount(nutritionFacts.dietaryfiber_g, "g")} subtle />
                            <NutrientRow label="Total Sugars" value={formatAmount(nutritionFacts.totalsugars_g, "g")} subtle />
                            <NutrientRow label="Added Sugar" value={formatAmount(nutritionFacts.addedsugars_g, "g")} subtle />
                            <NutrientRow label="Protein" value={formatAmount(nutritionFacts.protein_g, "g")} last />
                        </NutritionCard>

                        <NutritionCard title="Minerals & Other">
                            <NutrientRow label="Cholesterol" value={formatAmount(nutritionFacts.cholesterol_mg, "mg")} />
                            <NutrientRow label="Sodium" value={formatAmount(nutritionFacts.sodium_mg, "mg")} />
                            <NutrientRow label="Calcium" value={formatAmount(nutritionFacts.calcium_mg, "mg")} />
                            <NutrientRow label="Potassium" value={formatAmount(nutritionFacts.potassium_mg, "mg")} />
                            <NutrientRow label="Vitamin D" value={formatAmount(nutritionFacts.vitamind_mcg, "mcg")} />
                            <NutrientRow label="Iron" value={formatAmount(nutritionFacts.iron_mg, "mg")} last />
                        </NutritionCard>

                        <View className="mt-5 rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5">
                            <Text className="font-lexend text-[24px] text-[#E2E2E2]">Allergens</Text>
                            <Text className="mt-2 font-lexend font-light text-[17px] leading-[25px] text-[#C58D78]">
                                {nutritionFacts.allergens || "No allergens listed"}
                            </Text>
                        </View>

                        <View className="mt-5 rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5">
                            <Text className="font-lexend text-[24px] text-[#E2E2E2]">Dietary Info</Text>
                            <View className="mt-4 flex-row flex-wrap">
                                {dietaryTags.map((tag) => (
                                    <DietaryChip key={tag.label} label={tag.label} value={tag.value} />
                                ))}
                            </View>
                        </View>
                    </>
                ) : (
                    <View className="rounded-[28px] border border-[#1E1E1E] bg-[#171717] px-5 py-6">
                        <Text className="font-lexend text-[22px] text-[#E2E2E2]">Nutrition unavailable</Text>
                        <Text className="mt-2 font-lexend font-light text-[15px] text-[#A8A8A8]">
                            This item does not have nutrition facts right now.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

function MacroTile({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) {
    return (
        <View className="mr-2 flex-1 rounded-[24px] border border-[#1A1A1A] bg-[#151515] px-4 py-4">
            <View className="mb-3 h-1.5 w-10 rounded-full" style={{ backgroundColor: color }} />
            <Text className="font-lexend text-[13px] uppercase tracking-[1.5px] text-[#8C8C8C]">{label}</Text>
            <Text className="mt-1 font-lexend text-[24px] text-[#E2E2E2]">{value}</Text>
        </View>
    );
}

function NutritionCard({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <View className="mt-5 overflow-hidden rounded-[30px] border border-[#1A1A1A] bg-[#151515]">
            <View className="border-b border-[#202020] bg-[#191919] px-5 py-4">
                <Text className="font-lexend text-[24px] text-[#E2E2E2]">{title}</Text>
            </View>
            <View className="px-5 py-2">
                {children}
            </View>
        </View>
    );
}

function NutrientRow({
    label,
    value,
    subtle = false,
    last = false,
}: {
    label: string;
    value: string;
    subtle?: boolean;
    last?: boolean;
}) {
    return (
        <View className={`flex-row items-center justify-between py-3 ${last ? "" : "border-b border-[#252525]"}`}>
            <Text className={`mr-4 flex-1 font-lexend text-[18px] ${subtle ? "font-light text-[#A8A8A8]" : "text-[#D7D7D7]"}`}>
                {subtle ? `  ${label}` : label}
            </Text>
            <Text className="font-lexend text-[18px] text-[#E2E2E2]">{value}</Text>
        </View>
    );
}

function DietaryChip({
    label,
    value,
}: {
    label: string;
    value: boolean | null;
}) {
    const active = value === true;

    return (
        <View className={`mb-3 mr-3 rounded-full px-4 py-2 ${active ? "bg-[#162019]" : "bg-[#202020]"}`}>
            <Text className={`font-lexend text-[14px] ${active ? "text-[#A8D3AE]" : "text-[#8C8C8C]"}`}>
                {active ? label : getInactiveDietaryLabel(label)}
            </Text>
        </View>
    );
}

function getInactiveDietaryLabel(label: string) {
    if (label === "Contains Nuts") {
        return "No Nuts";
    }

    if (label === "No Garlic or Onion") {
        return "May Have Garlic/Onion";
    }

    return `Not ${label}`;
}

function formatAmount(value: number | null, unit: string) {
    if (value === null || value === undefined) {
        return "--";
    }

    return `${value}${unit}`;
}

function formatNumber(value: number | null) {
    if (value === null || value === undefined) {
        return "--";
    }

    return value.toString();
}
