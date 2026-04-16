import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getDiningHalls, DiningHall } from '../api';
import "../../global.css";

export default function Home({ navigation, route }: any) {
    const [halls, setHalls] = useState<DiningHall[]>([]);
    const [loading, setLoading] = useState(true);
    const [tabBarWidth, setTabBarWidth] = useState(0);
    const tabAnimation = useRef(new Animated.Value(route?.params?.animateTabFrom === "MenuMatch" ? 1 : 0)).current;

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

    useEffect(() => {
        if (route?.params?.animateTabFrom !== "MenuMatch" || !tabBarWidth) {
            return;
        }

        tabAnimation.setValue(1);
        Animated.timing(tabAnimation, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [route?.params?.animateTabFrom, route?.params?.animateTabNonce, tabAnimation, tabBarWidth]);

    const navigateToMenuMatch = () => {
        navigation.navigate("MenuMatch", { animateTabFrom: "Menus", animateTabNonce: Date.now() });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#232323]" edges={["top", "left", "right"]}>
            <StatusBar style="light" />

            <View className="px-5 pt-5 pb-2">
                <Text className="font-gotham text-center text-[42px] text-[#E2E2E2]">
                    HuskyEats
                </Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}>
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
                        const hallMeal = mealLabel === "Closed" ? findNextMeal(hall) : normalizeMealForHall(mealLabel);

                        return (
                        <Pressable
                            className="mb-4 rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5"
                            key={hall.id}
                            onPress={() => navigation.navigate("Hall", { hall, meal: hallMeal })}
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
                <View
                    className="relative flex-row rounded-[24px] border border-[#1C1C1C] bg-[#161616] p-2"
                    onLayout={(event) => setTabBarWidth(event.nativeEvent.layout.width)}
                >
                    <Animated.View
                        className="absolute bottom-2 left-2 top-2 rounded-[18px] bg-[#1A2740]"
                        style={{
                            width: tabBarWidth ? (tabBarWidth - 16) / 2 : 0,
                            transform: [
                                {
                                    translateX: tabAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: tabBarWidth ? [0, (tabBarWidth - 16) / 2] : [0, 0],
                                    }),
                                },
                            ],
                        }}
                    />
                    <BottomNavButton active label="Menus" onPress={() => {}} />
                    <BottomNavButton label="MenuMatch" onPress={navigateToMenuMatch} />
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
            className="z-10 flex-1 rounded-[18px] px-4 py-3"
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

    if (mealLabel === "Late Night") {
        return {
            bg: "#162326",
            text: "#8FD5DF",
            bar: "#4C9FAB",
        };
    }

    return {
        bg: "#202020",
        text: "#B8B8B8",
        bar: "#4A4A4A",
    };
}

export function stringToDate(time: string) {
    const [hour, minute = 0] = time.split(":").map(Number);
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
        if (hasLateNightForDay(hall, day) && inInterval(hall.latenight)[0]) return ["Late Night", `Until ${inInterval(hall.latenight)[1]}`];
    } else {
        if (inInterval(hall.wdbreakfast)[0]) return ["Breakfast", `Until ${inInterval(hall.wdbreakfast)[1]}`];
        if (inInterval(hall.wdlunch)[0]) return ["Lunch", `Until ${inInterval(hall.wdlunch)[1]}`];
        if (inInterval(hall.wddinner)[0]) return ["Dinner", `Until ${inInterval(hall.wddinner)[1]}`];
        if (hasLateNightForDay(hall, day) && inInterval(hall.latenight)[0]) return ["Late Night", `Until ${inInterval(hall.latenight)[1]}`];
    }

    return ["Closed", findNextOpening(hall)];
}

function findNextOpening(hall: DiningHall) {
    const nextOpening = getNextOpening(hall);

    if (!nextOpening) {
        return "Closed today";
    }

    const { dayOffset, start } = nextOpening;
    const time = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

    if (dayOffset === 0) {
        return `Opens ${time}`;
    }

    if (dayOffset === 1) {
        return `Opens tomorrow ${time}`;
    }

    return `Opens ${start.toLocaleDateString([], { weekday: "long" })} ${time}`;
}

function findNextMeal(hall: DiningHall) {
    const nextOpening = getNextOpening(hall);

    if (!nextOpening) {
        return "Breakfast";
    }

    return normalizeMealForHall(nextOpening.meal);
}

function getNextOpening(hall: DiningHall) {
    const now = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(now);
        date.setDate(now.getDate() + dayOffset);
        const schedules = getDaySchedules(hall, date.getDay());

        for (const schedule of schedules) {
            if (!schedule.time) {
                continue;
            }

            const start = getDateForTime(date, schedule.time.split("-")[0]);
            if (start > now) {
                return {
                    dayOffset,
                    meal: schedule.meal,
                    start,
                };
            }
        }
    }

    return null;
}

function getDaySchedules(hall: DiningHall, day: number) {
    if (day === 0 || day === 6) {
        return [
            { meal: "Breakfast", time: day === 6 ? hall.wesatbreakfast : hall.wesunbreakfast },
            { meal: "Brunch", time: hall.webrunch },
            { meal: "Dinner", time: hall.wedinner },
            ...(hasLateNightForDay(hall, day) ? [{ meal: "Late Night", time: hall.latenight }] : []),
        ];
    }

    return [
        { meal: "Breakfast", time: hall.wdbreakfast },
        { meal: "Lunch", time: hall.wdlunch },
        { meal: "Dinner", time: hall.wddinner },
        ...(hasLateNightForDay(hall, day) ? [{ meal: "Late Night", time: hall.latenight }] : []),
    ];
}

function hasLateNightForDay(hall: DiningHall, day: number) {
    return hall.haslatenight && day >= 0 && day <= 4;
}

function getDateForTime(date: Date, time: string) {
    const [hour, minute = 0] = time.split(":").map(Number);
    const result = new Date(date);
    result.setHours(hour, minute, 0, 0);
    return result;
}

function normalizeMealForHall(meal: string) {
    if (meal === "Brunch") {
        return "Lunch";
    }

    if (meal === "Late Night") {
        return "Dinner";
    }

    return meal;
}
