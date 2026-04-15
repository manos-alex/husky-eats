import { useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import Constants from "expo-constants";
import { getNutritionFacts, ItemMatch, NutritionFacts } from "../../api";
import { DailyValue } from "./constants";
import { CameraCaptureStep } from "./CameraCaptureStep";
import { DetailsStep } from "./DetailsStep";
import { LoadingStep } from "./LoadingStep";
import { ResultsStep } from "./ResultsStep";
import { ReviewStep } from "./ReviewStep";
import { UploadStep } from "./UploadStep";
import "../../../global.css";

type MenuMatchScreen = "upload" | "camera" | "details" | "review" | "loading" | "results";

const PREDICT_API_URL = Constants.expoConfig?.extra?.PREDICT_API_URL as string | undefined;

export default function MenuMatch({ navigation, route }: any) {
    const [screen, setScreen] = useState<MenuMatchScreen>("upload");

    const [hall, setHall] = useState<number | null>(null);
    const [meal, setMeal] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    const [image, setImage] = useState<string | null>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [capturingPhoto, setCapturingPhoto] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    const [result, setResult] = useState<ItemMatch[]>([]);
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
        try {
            if (!image || !hall || !meal) {
                return [];
            }
            if (!PREDICT_API_URL) {
                throw new Error("PREDICT_API_URL is not configured.");
            }

            const formData = new FormData();
            formData.append("image", {
                uri: image,
                name: "plate.jpg",
                type: "image/jpeg",
            } as unknown as Blob);
            formData.append("dining_hall_id", String(hall));
            formData.append("meal", meal);
            formData.append("date", formatPredictDate(date));

            const res = await fetch(PREDICT_API_URL, {
                    method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Predict request failed with status ${res.status}`);
            }

            const data = await res.json();
            const items = (Array.isArray(data) ? data : data.servings ?? []) as ItemMatch[];

            setResult(items);
            return items;
        } catch (err) {
                console.error("Failed to predict items and servings.", err);
                return [];
        }

// Hard coded implementation
            // const result: ItemMatch[] = [
            //     {name: "Char Siu Chicken", id: "302202", num_servings: 1},
            //     {name: "Edamame Fried Rice", id: "300914", num_servings: 0.84},
            // ]
            // setResult(result);
            // return result;
        };

        const fetchNutrition = async (items: ItemMatch[]) => {
        try {
            const nf = await Promise.all(
                items.map((item) => getNutritionFacts({ id: Number(item.id) }))
            );
            setNutrition(nf);
        } catch (err) {
            console.error("Failed to fetch nutrition facts.", err);
        }
    };

    const loadResults = async () => {
        setScreen("loading");
        await handleCalculate();
    };

    const handleCalculate = async () => {
        setNutrition([]);
        const items = await predict();
        if (items.length) {
            await fetchNutrition(items);
        }
        setScreen("results");
    };

    const totals = useMemo(() => {
        return result.reduce(
            (acc, item) => {
                const facts = nutrition.find((n) => n.id === Number(item.id));
                if (!facts) return acc;

                const servings = item.num_servings ?? 0;
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
        <SafeAreaView
            className="flex-1 bg-[#232323]"
            edges={screen === "camera" ? ["left", "right"] : ["top", "left", "right"]}
        >
            {screen === "upload" ? (
                null
            ) : screen === "camera" ? null : (
                <View className="px-5 pt-3 pb-3">
                    <View className="relative h-16 justify-center">
                        <View className="absolute inset-0 items-center justify-center pointer-events-none">
                            <Text
                                className="font-gotham text-[#E2E2E2] text-[34px] leading-[40px] text-center"
                                numberOfLines={1}
                            >
                                {screenTitle[screen]}
                            </Text>
                        </View>

                        <View className="absolute left-0 top-0 bottom-0 z-20 justify-center">
                            {showBack ? (
                                <Pressable
                                    className="rounded-full border border-[#202020] bg-[#171717] px-4 py-3"
                                    onPress={handleBack}
                                    hitSlop={12}
                                >
                                    <Text className="font-lexend text-[18px] leading-[18px] text-[#D8D8D8]">Back</Text>
                                </Pressable>
                            ) : null}
                        </View>

                        <View className="absolute right-0 top-0 bottom-0 z-30 justify-center" style={{ elevation: 8 }}>
                            {screen === "results" ? (
                                <Pressable
                                    className="items-center justify-center rounded-full border border-[#263B5F] bg-[#1A2740] px-4 py-3"
                                    onPress={handleSaveExit}
                                    hitSlop={14}
                                >
                                    <Text className="font-lexend text-[14px] text-[#9CC0FA]">Save / Exit</Text>
                                </Pressable>
                            ) : null}
                        </View>
                    </View>
                    {screen === "details" && (
                        <Text className="mt-2 font-lexend font-light text-[#A8A8A8] text-[17px] text-center">
                            Tell me where and when this meal was served.
                        </Text>
                    )}
                </View>
            )}
            {screen === "upload" ? (
                <UploadStep
                    onPickImage={pickImage}
                    onMenusPress={() => navigation.navigate("Home", { animateTabFrom: "MenuMatch", animateTabNonce: Date.now() })}
                    animateTabFrom={route?.params?.animateTabFrom}
                    animateTabNonce={route?.params?.animateTabNonce}
                />
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
                    result={result}
                />
            )
            }
        </SafeAreaView>
    );
}

function formatPredictDate(value: Date) {
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const year = value.getFullYear();
    return `${year}-${month}-${day}`;
}
