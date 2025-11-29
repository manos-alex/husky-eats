import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from 'react-native-picker-select';
import { DatePicker } from '../../components/nativewindui/DatePicker';
import "../../global.css";

const halls = [
    {label: "Connecticut", value: 3},
    {label: "McMahon", value: 5},
    {label: "North", value: 7},
    {label: "Northwest", value: 15},
    {label: "Putnam", value: 6},
    {label: "South", value: 16},
    {label: "Towers", value: 42},
    {label: "Whitney", value: 1},
]

const meals = [
    {label: "Breakfast", value: 'breakfast'},
    {label: "Lunch", value: 'lunch'},
    {label: "Dinner", value: 'dinner'}
]

export default function MenuMatch() {
    const [hall, setHall] = useState<number | null>(null);
    const [meal, setMeal] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    return (
        <SafeAreaView className="flex-1 bg-[#252525]">
            <Text className="mt-8 font-gotham text-[#DDD] text-[40px] text-center">Welcome to</Text>
            <Text className="font-lexend text-[#DDD] text-[48px] text-center">MenuMatch</Text>

            <Text className="mt-10 font-lexend font-light text-[#888] text-[20px] text-center" >Enter the details of your meal below...</Text>

            {/* Add a container so the picker has width & spacing */}
            <View style={{ marginHorizontal: 24, marginTop: 24 }}>
                <RNPickerSelect
                onValueChange={(value) => setHall(value as number)}
                items={halls}
                value={hall}
                placeholder={{ label: "Select a dining hall...", value: null }}
                style={{
                    viewContainer: {
                        // touchable area
                        borderWidth: 1,
                        borderColor: "#555",
                        borderRadius: 8,
                        backgroundColor: "#333",
                    },
                    inputIOS: {
                        fontSize: 16,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        color: "#DDD",
                    },
                    inputAndroid: {
                        fontSize: 16,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        color: "#DDD",
                    },
                    placeholder: {
                        color: "#888",
                    },
                }}
                />
            </View>
            <View style={{ marginHorizontal: 24, marginTop: 24 }}>
                <RNPickerSelect
                onValueChange={(value) => setMeal(value as string)}
                items={meals}
                value={meal}
                placeholder={{ label: "Select a meal time...", value: null }}
                style={{
                    viewContainer: {
                        // touchable area
                        borderWidth: 1,
                        borderColor: "#555",
                        borderRadius: 8,
                        backgroundColor: "#333",
                    },
                    inputIOS: {
                        fontSize: 16,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        color: "#DDD",
                    },
                    inputAndroid: {
                        fontSize: 16,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        color: "#DDD",
                    },
                    placeholder: {
                        color: "#888",
                    },
                }}
                />
            </View>
            <View style={{ marginHorizontal: 24, marginTop: 24 }}>
                <DatePicker
                    value={date}
                    mode="date"
                    onChange={(ev) => {
                        setDate(new Date(ev.nativeEvent.timestamp));
                    }}
                />
            </View>
        </SafeAreaView>
    );
}