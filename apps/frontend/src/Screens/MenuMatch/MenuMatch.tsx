import { useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getNutritionFacts, ItemMatch, NutritionFacts } from "../../api";
import { DailyValue, result } from "./constants";
import { CameraCaptureStep } from "./CameraCaptureStep";
import { DetailsStep } from "./DetailsStep";
import { LoadingStep } from "./LoadingStep";
import { ResultsStep } from "./ResultsStep";
import { ReviewStep } from "./ReviewStep";
import { UploadStep } from "./UploadStep";
import "../../../global.css";

type MenuMatchScreen = "upload" | "camera" | "details" | "review" | "loading" | "results";

export default function MenuMatch({ navigation }: any) {
    const [screen, setScreen] = useState<MenuMatchScreen>("upload");

    const [hall, setHall] = useState<number | null>(null);
    const [meal, setMeal] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    const [image, setImage] = useState<string | null>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [capturingPhoto, setCapturingPhoto] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // const [result, setResult] = useState<ItemMatch[]>([]);
    const [nutrition, setNutrition] = useState<NutritionFacts[]>([]);

    const pickImage = async () => {
        if (!cameraPermission?.granted) {
            const result = await requestCameraPermission();
            if (!result.granted) {
                Alert.alert("Permission required", "We need camera access to capture your meal.");
                return;
            }
        }
        setScreen("camera");
    };

    const captureImage = async () => {
        if (!cameraRef.current || capturingPhoto) {
            return;
        }
        setCapturingPhoto(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
            });
            if (photo?.uri) {
                setImage(photo.uri);
                setScreen("details");
            }
        } catch {
            Alert.alert("Camera error", "We could not capture your photo. Please try again.");
        } finally {
            setCapturingPhoto(false);
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

    const screenTitle: Record<Exclude<MenuMatchScreen, "upload" | "camera">, string> = {
        details: "Meal Details",
        review: "Review Meal",
        loading: "Calculating",
        results: "Results",
    };

    const showBack = screen === "details" || screen === "review";

    const handleBack = () => {
        if (screen === "details") {
            setScreen("upload");
        } else if (screen === "review") {
            setScreen("details");
        } else if (screen === "results") {
            setScreen("review");
        }
    };

    const handleSaveExit = () => {
        Alert.alert(
            "Save?",
            "Do you want to save this result before exiting?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Save",
                    onPress: () => {
                        // Save flow placeholder: implement persistence here later.
                        navigation.navigate("Home");
                    },
                },
                {
                    text: "Don't Save",
                    onPress: () => navigation.navigate("Home"),
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#252525]" edges={["top", "left", "right"]}>
            {screen === "upload" ? (
                <>
                    <Text className="mt-8 font-gotham text-[#DDD] text-[40px] text-center">Welcome to</Text>
                    <Text className="font-lexend text-[#DDD] text-[48px] text-center">MenuMatch</Text>
                </>
            ) : screen === "camera" ? null : (
                <View className="px-3 pt-2 pb-1">
                    <View className="relative h-16 justify-center">
                        <View className="absolute inset-0 items-center justify-center pointer-events-none">
                            <Text
                                className={`font-lexend text-[#DDD] text-[40px] leading-[40px] text-center`}
                                numberOfLines={1}
                            >
                                {screenTitle[screen]}
                            </Text>
                        </View>

                        <View className="absolute left-0 top-0 bottom-0 z-20 justify-center">
                            {showBack ? (
                                <Pressable
                                    className="h-16 w-12 items-center justify-center"
                                    onPress={handleBack}
                                    hitSlop={12}
                                >
                                    <Text className="text-[40px] leading-[40px] text-[#8AB4FF]">‹</Text>
                                </Pressable>
                            ) : null}
                        </View>

                        <View className="absolute right-0 top-0 bottom-0 z-30 justify-center" style={{ elevation: 8 }}>
                            {screen === "results" ? (
                                <Pressable
                                    className="items-center justify-center rounded-[12px] border border-[#9CC0FA55] bg-[#102036F2] px-3 py-2"
                                    onPress={handleSaveExit}
                                    hitSlop={14}
                                >
                                    <Text className="font-lexend text-[14px] text-[#E4EEFF]">Save / Exit</Text>
                                </Pressable>
                            ) : null}
                        </View>
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
            ) : screen === "camera" ? (
                <CameraCaptureStep
                    cameraRef={cameraRef}
                    onCancel={() => setScreen("upload")}
                    onCapture={captureImage}
                    isCapturing={capturingPhoto}
                />
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
