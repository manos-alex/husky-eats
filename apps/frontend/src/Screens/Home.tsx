import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getDiningHalls, DiningHall } from '../api';
import "../../global.css";

export default function Home({ navigation }: any) {
    const [halls, setHalls] = useState<DiningHall[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const hallsRes = await getDiningHalls({});
                setHalls(hallsRes);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#232323]" edges={["top", "left", "right"]}>
            <StatusBar style="light" />

            <View className="px-5 pt-5 pb-2">
                <Text className="font-gotham text-center text-[42px] text-[#E2E2E2]">
                    HuskyEats
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 124 }}>
                {loading ? (
                    <View className="rounded-[28px] border border-[#1E1E1E] bg-[#171717] px-5 py-6">
                        <Text className="font-lexend text-[22px] text-[#E2E2E2]">Loading halls...</Text>
                        <Text className="mt-2 font-lexend font-light text-[15px] text-[#A8A8A8]">
                            Fetching the latest dining schedule.
                        </Text>
                    </View>
                ) : halls.length ? (
                    halls.map((hall) => {
                        const [mealLabel, mealStatus] = findMealtime(hall);
                        const mealColor = getMealAccent(mealLabel);

                        return (
                        <Pressable
                            className="mb-4 rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5"
                            key={hall.id}
                            onPress={() => navigation.navigate("Hall", { hall, meal: mealLabel })}
                        >
                            <View
                                className="absolute left-0 top-6 bottom-6 w-[4px] rounded-full"
                                style={{ backgroundColor: mealColor.bar }}
                            />
                            <View className="flex-row items-start justify-between">
                                <Text className="ml-2 mr-4 flex-1 font-lexend text-[32px] leading-[36px] text-[#E2E2E2]">
                                    {hall.name}
                                </Text>
                                <Text
                                    className="rounded-full px-3 py-1 font-lexend text-[20px]"
                                    style={{
                                        color: mealColor.text,
                                        backgroundColor: mealColor.bg,
                                    }}
                                >
                                    {mealLabel}
                                </Text>
                            </View>
                            <Text className="mt-5 text-right font-lexend font-light text-[20px] text-[#B8B8B8]">
                                {mealStatus}
                            </Text>
                        </Pressable>
                        );
                    })
                ) : (
                    <View className="rounded-[28px] border border-[#1E1E1E] bg-[#171717] px-5 py-6">
                        <Text className="font-lexend text-[22px] text-[#E2E2E2]">No halls available</Text>
                        <Text className="mt-2 font-lexend font-light text-[15px] text-[#A8A8A8]">
                            Try again when dining hall data is available.
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View className="border-t border-[#1B1B1B] bg-[#111111] px-5 pb-6 pt-4">
                <View className="flex-row rounded-[24px] border border-[#1C1C1C] bg-[#161616] p-2">
                    <BottomNavButton active label="Menus" onPress={() => navigation.navigate("Home")} />
                    <BottomNavButton label="MenuMatch" onPress={() => navigation.navigate("MenuMatch")} />
                </View>
            </View>
        </SafeAreaView>
    );
}

function BottomNavButton({
    active = false,
    label,
    onPress,
}: {
    active?: boolean;
    label: string;
    onPress: () => void;
}) {
    return (
        <Pressable
            className={`flex-1 rounded-[18px] px-4 py-3 ${active ? "bg-[#1A2740]" : "bg-transparent"}`}
            onPress={onPress}
        >
            <Text className={`font-lexend text-center text-[16px] ${active ? "text-[#9CC0FA]" : "text-[#8C8C8C]"}`}>
                {label}
            </Text>
        </Pressable>
    );
}

function getMealAccent(mealLabel: string) {
    if (mealLabel === "Breakfast") {
        return {
            bg: "#2A2115",
            text: "#E8C27A",
            bar: "#C89B47",
        };
    }

    if (mealLabel === "Lunch") {
        return {
            bg: "#18231E",
            text: "#8FD1A8",
            bar: "#5BA574",
        };
    }

    if (mealLabel === "Dinner") {
        return {
            bg: "#241A1C",
            text: "#E1A0A8",
            bar: "#B86B76",
        };
    }

    if (mealLabel === "Brunch") {
        return {
            bg: "#211D29",
            text: "#C0A6E8",
            bar: "#9474C8",
        };
    }

    return {
        bg: "#202020",
        text: "#B8B8B8",
        bar: "#4A4A4A",
    };
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
