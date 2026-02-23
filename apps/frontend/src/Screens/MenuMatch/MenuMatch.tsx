import { useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { getNutritionFacts, ItemMatch, NutritionFacts } from "../../api";
import { DailyValue, result } from "./constants";
import { DetailsStep } from "./DetailsStep";
import { LoadingStep } from "./LoadingStep";
import { ResultsStep } from "./ResultsStep";
import { ReviewStep } from "./ReviewStep";
import { UploadStep } from "./UploadStep";
import "../../../global.css";

type MenuMatchScreen = "upload" | "details" | "review" | "loading" | "results";

export default function MenuMatch() {
    const [screen, setScreen] = useState<MenuMatchScreen>("upload");

    const [hall, setHall] = useState<number | null>(null);
    const [meal, setMeal] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    const [image, setImage] = useState<string | null>(null);

    // const [result, setResult] = useState<ItemMatch[]>([]);
    const [nutrition, setNutrition] = useState<NutritionFacts[]>([]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "We need camera access to capture your meal.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            // In SDK 49+ the assets array is used
            const uri = result.assets[0].uri;
            setImage(uri);
            setScreen("details");
        }
    };

    const changeScreen = (screen: MenuMatchScreen) => {
        setScreen(screen);
    };

    const checkDetails = () => {
        if (!hall) {
            alert("You must select a dining hall");
            return;
        }
        if (!meal) {
            alert("You must select a meal time");
            return;
        }
        else {
            setScreen("review");
        }
    };

    const predict = async () => {
        // try {
        //     if (image) {
        //         const img = await fetch(image);
        //         const blob = await img.blob();

        //         const res = await fetch("https://busy-outreach-virtue-lauderdale.trycloudflare.com/predict?dining_hall_id=5&meal_time=lunch&meal_date=2025-11-25", {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "image/png",
        //             },
        //             body: blob,
        //         });

        //         const data = await res.json();
        //         console.log(data);
        //         setResult(data);
        //         setScreen("results");
        //     }
        // } catch (err) {
        //     console.error("Failed to predict items and servings.", err);
        // }

        const result: ItemMatch[] = [
            {name: "Cross Trax French Fries", id: "161069", servings: 0.75},
            {name: "Fried Chicken Nuggets", id: "111037", servings: 2},
            {name: "Corn", id: "171012", servings: 1},
        ]

        return result;
    };

    const fetchNutrition = async () => {
        try {
            const nf = await Promise.all(
                result.map((item) => getNutritionFacts({ id: Number(item.id) }))
            );
            setNutrition(nf);
        } catch (err) {
            console.error("Failed to fetch nutrition facts.", err);
        }
    };

    const loadResults = () => {
        setScreen("loading");
        setTimeout(() => {
            handleCalculate();
        }, 7000);
    };

    const handleCalculate = async () => {
        const items = await predict();
        if (items.length) {
            await fetchNutrition();
            setScreen("results");
        }
    };

    const totals = useMemo(() => {
        return result.reduce(
            (acc, item) => {
                const facts = nutrition.find((n) => n.id === Number(item.id));
                if (!facts) return acc;

                const servings = item.servings ?? 0;
                acc.calories += (facts.calories ?? 0) * servings;
                acc.carbs += (facts.totalcarbohydrate_g ?? 0) * servings;
                acc.protein += (facts.protein_g ?? 0) * servings;
                acc.fat += (facts.totalfat_g ?? 0) * servings;
                return acc;
            },
            {calories: 0, carbs: 0, protein: 0, fat: 0}
        );
    }, [result, nutrition]);

    const nutrientCircles = [
        {key: "Protein", total: totals.protein, dailyV: DailyValue.protein},
        {key: "Carbs", total: totals.carbs, dailyV: DailyValue.carbs},
        {key: "Fat", total: totals.fat, dailyV: DailyValue.fat},
    ];

    const screenTitle: Record<MenuMatchScreen, string> = {
        upload: "MenuMatch",
        details: "Meal Details",
        review: "Review Meal",
        loading: "Calculating",
        results: "Results",
    };

    const showBack = screen === "details" || screen === "review" || screen === "results";

    const handleBack = () => {
        if (screen === "details") {
            setScreen("upload");
        } else if (screen === "review") {
            setScreen("details");
        } else if (screen === "results") {
            setScreen("review");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#252525]" edges={["top", "left", "right"]}>
            {screen === "upload" ? (
                <>
                    <Text className="mt-8 font-gotham text-[#DDD] text-[40px] text-center">Welcome to</Text>
                    <Text className="font-lexend text-[#DDD] text-[48px] text-center">MenuMatch</Text>
                </>
            ) : (
                <View className="px-3 pt-2 pb-1">
                    <View className="h-16 items-center justify-center">
                        {showBack && (
                            <View className="absolute left-3 top-0 bottom-0 justify-center">
                                <Pressable className="h-16 w-10 items-center justify-center" onPress={handleBack}>
                                    <Text className="text-[40px] leading-[40px] text-[#8AB4FF]">‹</Text>
                                </Pressable>
                            </View>
                        )}
                        <Text
                            className={`font-lexend text-[#DDD] text-[40px] leading-[40px] text-center`}
                        >
                            {screenTitle[screen]}
                        </Text>
                    </View>
                    {screen === "details" && (
                        <Text className="mt-2 font-lexend font-light text-[#9BA6BA] text-[17px] text-center">
                            Tell me where and when this meal was served.
                        </Text>
                    )}
                </View>
            )}
            {screen === "upload" ? (
                <UploadStep onPickImage={pickImage} />
            ) : screen === "details" ? (
                <DetailsStep
                    hall={hall}
                    meal={meal}
                    date={date}
                    onHallChange={setHall}
                    onMealChange={setMeal}
                    onDateChange={setDate}
                    onNext={checkDetails}
                />
            ) : screen === "review" ? (
                <ReviewStep
                    image={image}
                    hall={hall}
                    meal={meal}
                    date={date}
                    onEdit={() => changeScreen("details")}
                    onCalculate={loadResults}
                />
            ) : screen === "loading" ? (
                <LoadingStep />
            ) : (
                <ResultsStep
                    totals={totals}
                    nutrientCircles={nutrientCircles}
                    nutrition={nutrition}
                />
            )
            }
        </SafeAreaView>
    );
}
