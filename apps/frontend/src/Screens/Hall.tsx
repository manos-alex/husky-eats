import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Text, View, ScrollView, Pressable, Easing, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getMenuItems, getNutritionFacts, MenuItem, NutritionFacts } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import "../../global.css";

type RootStackParamList = {
    Nutrition: { id: number, name: string };
};

export default function Hall({route}: any) {
    const { hall, meal, date } = route.params;
    const menuDate = typeof date === "string" ? date : getDateKey(new Date());

    const [breakfastItems, setBreakfastItems] = useState<MenuItem[]>([]);
    const [lunchItems, setLunchItems] = useState<MenuItem[]>([]);
    const [dinnerItems, setDinnerItems] = useState<MenuItem[]>([]);
    const [displayItems, setDisplayItems] = useState<MenuItem[]>([]);
    const [nutritionById, setNutritionById] = useState<Record<number, NutritionFacts>>({});
    const [tabBarWidth, setTabBarWidth] = useState(0);

    const [curMeal, setCurMeal] = useState(() => normalizeMeal(meal));

    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const tabAnimation = useRef(new Animated.Value(getMealIndex(normalizeMeal(meal)))).current;
    const isDraggingTab = useRef(false);
    const mealOrder = useMemo(() => ["Breakfast", "Lunch", "Dinner"], []);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const breakfastItemsRes = await getMenuItems({hallid: hall.id, date: menuDate, meal: "Breakfast"});
                const lunchItemsRes = await getMenuItems({hallid: hall.id, date: menuDate, meal: "Lunch"});
                const dinnerItemsRes = await getMenuItems({hallid: hall.id, date: menuDate, meal: "Dinner"});

                setBreakfastItems(breakfastItemsRes);
                setLunchItems(lunchItemsRes);
                setDinnerItems(dinnerItemsRes);
                setNutritionById({});
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [hall.id, menuDate])

    useEffect(() => {
        if (curMeal === "Breakfast") {
            setDisplayItems(breakfastItems);
        } else if (curMeal === "Lunch") {
            setDisplayItems(lunchItems);
        } else {
            setDisplayItems(dinnerItems);
        }
    }, [breakfastItems, lunchItems, dinnerItems, curMeal]);

    useEffect(() => {
        if (isDraggingTab.current) {
            return;
        }

        Animated.timing(tabAnimation, {
            toValue: getMealIndex(curMeal),
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [curMeal, tabAnimation]);

    useEffect(() => {
        async function loadNutrition() {
            const missingIds = displayItems
                .map((item) => item.id)
                .filter((id) => nutritionById[id] === undefined);

            if (!missingIds.length) {
                return;
            }

            try {
                const nutritionResults = await Promise.all(
                    missingIds.map((id) => getNutritionFacts({ id }))
                );

                setNutritionById((current) => {
                    const next = { ...current };
                    nutritionResults.forEach((nutrition) => {
                        next[nutrition.id] = nutrition;
                    });
                    return next;
                });
            } catch (err) {
                console.log(err);
            }
        }

        loadNutrition();
    }, [displayItems, nutritionById]);

    const snapTabPill = (index: number) => {
        Animated.timing(tabAnimation, {
            toValue: index,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };

    const animateMealChange = (nextMeal: string) => {
        if (nextMeal === curMeal) {
            snapTabPill(getMealIndex(nextMeal));
            return;
        }

        setCurMeal(nextMeal);
        snapTabPill(getMealIndex(nextMeal));
    };

    const changeMeal = (meal: string) => {
        animateMealChange(meal);
    };

    const switchMealByOffset = (offset: number) => {
        const currentIndex = mealOrder.indexOf(curMeal);
        const nextIndex = currentIndex + offset;

        if (nextIndex < 0 || nextIndex >= mealOrder.length) {
            return;
        }

        animateMealChange(mealOrder[nextIndex]);
    };

    const panResponder = useMemo(() => PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 24 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
        },
        onPanResponderGrant: () => {
            isDraggingTab.current = true;
            tabAnimation.stopAnimation();
        },
        onPanResponderMove: (_, gestureState) => {
            const currentIndex = getMealIndex(curMeal);
            const dragProgress = Math.max(-1, Math.min(1, gestureState.dx / -120));
            const nextValue = Math.max(0, Math.min(2, currentIndex + dragProgress));
            tabAnimation.setValue(nextValue);
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx <= -48) {
                switchMealByOffset(1);
            } else if (gestureState.dx >= 48) {
                switchMealByOffset(-1);
            } else {
                snapTabPill(getMealIndex(curMeal));
            }
            isDraggingTab.current = false;
        },
        onPanResponderTerminate: () => {
            isDraggingTab.current = false;
            snapTabPill(getMealIndex(curMeal));
        },
    }), [curMeal, mealOrder, tabAnimation]);

    const groupedItems = useMemo(() => {
        return [...new Set(displayItems.map(item => item.station))].map((station) => ({
            station,
            items: displayItems.filter((item) => item.station === station),
        }));
    }, [displayItems]);

    return (
        <SafeAreaView
            className="flex-1 bg-[#232323]"
            edges={["top", "left", "right"]}
            {...panResponder.panHandlers}
        >
            <StatusBar style="light" />

            <View className="px-5 pt-3 pb-3">
                <View className="flex-row items-center justify-between">
                    <Pressable
                        className="rounded-full border border-[#202020] bg-[#171717] px-4 py-3"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="font-lexend text-[18px] leading-[18px] text-[#D8D8D8]">Back</Text>
                    </Pressable>
                    <Text className="mx-4 flex-1 text-center font-gotham text-[34px] text-[#E2E2E2]">
                        {hall.name}
                    </Text>
                    <View className="w-[74px]" />
                </View>
                <Text className="mt-2 text-center font-lexend text-[13px] text-[#9E9E9E]">
                    {formatMenuDate(menuDate)}
                </Text>

                <View className="mt-5 rounded-[24px] border border-[#1C1C1C] bg-[#161616] p-2">
                    <View
                        className="relative flex-row"
                        onLayout={(event) => setTabBarWidth(event.nativeEvent.layout.width)}
                    >
                        <Animated.View
                            className="absolute bottom-0 left-0 top-0 rounded-[18px] bg-[#1A2740]"
                            style={{
                                width: tabBarWidth ? tabBarWidth / 3 : 0,
                                transform: [
                                    {
                                        translateX: tabAnimation.interpolate({
                                            inputRange: [0, 1, 2],
                                            outputRange: tabBarWidth
                                                ? [0, tabBarWidth / 3, (tabBarWidth / 3) * 2]
                                                : [0, 0, 0],
                                        }),
                                    },
                                ],
                            }}
                        />
                        <MealTab label="Breakfast" onPress={() => changeMeal("Breakfast")} />
                        <MealTab label="Lunch" onPress={() => changeMeal("Lunch")} />
                        <MealTab label="Dinner" onPress={() => changeMeal("Dinner")} />
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 6, paddingTop: 12, paddingBottom: 28 }}
            >
                {loading ? (
                    <View className="rounded-[28px] border border-[#1E1E1E] bg-[#171717] px-5 py-6">
                        <Text className="font-lexend text-[22px] text-[#E2E2E2]">Loading menu...</Text>
                        <Text className="mt-2 font-lexend font-light text-[15px] text-[#A8A8A8]">
                            Pulling items for {formatMenuDate(menuDate)}.
                        </Text>
                    </View>
                ) : groupedItems.length ? (
                    groupedItems.map(({ station, items }) => {
                        const stationAccent = getStationAccent(station);

                        return (
                        <View className="mb-5 w-full self-center overflow-hidden rounded-[30px] border border-[#1A1A1A] bg-[#151515]" key={station}>
                            <View
                                className="border-b border-[#202020] px-5 py-4"
                                style={{ backgroundColor: stationAccent.headerBg }}
                            >
                                <Text
                                    className="font-lexend text-[28px]"
                                    style={{ color: stationAccent.headerText }}
                                >
                                    {station}
                                </Text>
                            </View>

                            {items.map((menuItem, index) => (
                                <View key={menuItem.id}>
                                    <Pressable
                                        className="px-6 py-5"
                                        onPress={() => navigation.navigate("Nutrition", {id: menuItem.id, name: menuItem.name})}
                                    >
                                        <View>
                                            <Text className="font-lexend font-light text-[23px] leading-[30px] text-[#D7D7D7]">
                                                {menuItem.name}
                                            </Text>
                                            <Text
                                                className="mt-2 font-lexend text-[14px]"
                                                style={{ color: stationAccent.subtleText }}
                                            >
                                                {formatAllergens(nutritionById[menuItem.id]?.allergens)}
                                            </Text>
                                        </View>
                                    </Pressable>

                                    {index !== items.length - 1 && (
                                        <View className="mx-6 h-px bg-[#272727]" />
                                    )}
                                </View>
                            ))}
                        </View>
                        );
                    })
                ) : (
                    <View className="rounded-[28px] border border-[#1E1E1E] bg-[#171717] px-5 py-6">
                        <Text className="font-lexend text-[22px] text-[#E2E2E2]">No items found</Text>
                        <Text className="mt-2 font-lexend font-light text-[15px] text-[#A8A8A8]">
                            There are no menu items listed for {curMeal.toLowerCase()} right now.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

function MealTab({
    label,
    onPress,
}: {
    label: string;
    onPress: () => void;
}) {
    return (
        <Pressable
            className="z-10 flex-1 rounded-[18px] px-3 py-3"
            onPress={onPress}
        >
            <Text className="text-center font-lexend text-[18px] text-[#D4D8E0]">
                {label}
            </Text>
        </Pressable>
    );
}

function normalizeMeal(meal: string) {
    if (meal === "Lunch" || meal === "Dinner" || meal === "Breakfast") {
        return meal;
    }

    if (meal === "Brunch") {
        return "Lunch";
    }

    return "Breakfast";
}

function getMealIndex(meal: string) {
    if (meal === "Lunch") return 1;
    if (meal === "Dinner") return 2;
    return 0;
}

function getDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatMenuDate(dateKey: string) {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();

    if (getDateKey(date) === getDateKey(today)) {
        return "Today";
    }

    return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

function formatAllergens(allergens?: string) {
    if (!allergens || allergens.trim() === "") {
        return "No allergens listed";
    }

    return `Allergens: ${allergens}`;
}

function getStationAccent(station: string) {
    const normalized = station.toLowerCase();

    if (normalized.includes("grill") || normalized.includes("fire")) {
        return {
            headerBg: "#211816",
            headerText: "#E6B09A",
            subtleText: "#C2917E",
        };
    }

    if (normalized.includes("salad") || normalized.includes("garden") || normalized.includes("veggie")) {
        return {
            headerBg: "#162019",
            headerText: "#A8D3AE",
            subtleText: "#7FB287",
        };
    }

    if (normalized.includes("pizza") || normalized.includes("pasta") || normalized.includes("ital")) {
        return {
            headerBg: "#231A18",
            headerText: "#E4B49A",
            subtleText: "#C58D78",
        };
    }

    if (normalized.includes("dessert") || normalized.includes("bakery") || normalized.includes("sweet")) {
        return {
            headerBg: "#201823",
            headerText: "#D8B1E8",
            subtleText: "#B98CCB",
        };
    }

    if (normalized.includes("deli") || normalized.includes("sandwich")) {
        return {
            headerBg: "#1A1E24",
            headerText: "#AFC8E8",
            subtleText: "#86A6CF",
        };
    }

    return {
        headerBg: "#171D27",
        headerText: "#AFC8E8",
        subtleText: "#86A6CF",
    };
}
