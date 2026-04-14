import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { DatePicker } from "../../../components/nativewindui/DatePicker";

type DetailsStepProps = {
  hall: number | null;
  meal: string | null;
  date: Date;
  onHallChange: (value: number | null) => void;
  onMealChange: (value: string | null) => void;
  onDateChange: (value: Date) => void;
  onNext: () => void;
};

const hallOptions = [
  { label: "Connecticut", value: 3 },
  { label: "McMahon", value: 5 },
  { label: "North", value: 7 },
  { label: "Northwest", value: 15 },
  { label: "Putnam", value: 6 },
  { label: "South", value: 16 },
  { label: "Towers", value: 42 },
  { label: "Whitney", value: 1 },
];

const mealOptions = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
];

export function DetailsStep({
  hall,
  meal,
  date,
  onHallChange,
  onMealChange,
  onDateChange,
  onNext,
}: DetailsStepProps) {
  const [mealTabWidth, setMealTabWidth] = useState(0);
  const mealAnimation = useRef(new Animated.Value(getMealIndex(meal))).current;

  useEffect(() => {
    Animated.timing(mealAnimation, {
      toValue: getMealIndex(meal),
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [meal, mealAnimation]);

  return (
    <View className="flex-1 px-5 pt-4 pb-8">
      <View className="flex-1">
        <View className="rounded-[28px] border border-[#1A1A1A] bg-[#151515] px-5 py-4">
          <Text className="font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">DINING HALL</Text>
          <View className="mt-3 flex-row flex-wrap justify-between">
            {hallOptions.map((option) => {
              const selected = hall === option.value;
              return (
                <Pressable
                  key={option.value}
                  className={`mb-3 w-[48.5%] rounded-[18px] border px-3 py-3 ${
                    selected ? "border-[#263B5F] bg-[#1A2740]" : "border-[#202020] bg-[#171717]"
                  }`}
                  onPress={() => onHallChange(option.value)}
                >
                  <Text
                    className={`font-lexend text-[15px] text-center ${selected ? "text-[#9CC0FA]" : "text-[#D8D8D8]"}`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-[28px] border border-[#1A1A1A] bg-[#151515] px-5 py-4">
          <Text className="font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">MEAL TIME</Text>
          <View
            className="relative mt-3 flex-row rounded-[24px] border border-[#1C1C1C] bg-[#161616] p-2"
            onLayout={(event) => setMealTabWidth(event.nativeEvent.layout.width)}
          >
            <Animated.View
              className="absolute bottom-2 left-2 top-2 rounded-[18px] bg-[#1A2740]"
              style={{
                width: mealTabWidth ? (mealTabWidth - 16) / 3 : 0,
                transform: [
                  {
                    translateX: mealAnimation.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: mealTabWidth
                        ? [0, (mealTabWidth - 16) / 3, ((mealTabWidth - 16) / 3) * 2]
                        : [0, 0, 0],
                    }),
                  },
                ],
              }}
            />
            {mealOptions.map((option) => {
              const selected = meal === option.value;
              return (
                <Pressable
                  key={option.value}
                  className="z-10 h-12 flex-1 justify-center rounded-[18px]"
                  onPress={() => onMealChange(option.value)}
                >
                  <Text className={`font-lexend text-center ${selected ? "text-[#9CC0FA]" : "text-[#8C8C8C]"}`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-[28px] border border-[#1A1A1A] bg-[#151515] px-5 py-4">
          <Text className="self-start font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">DATE</Text>
          <View className="mt-3 items-center rounded-[18px] border border-[#202020] bg-[#171717] px-3 py-3">
            <DatePicker
              value={date}
              mode="date"
              display="compact"
              onChange={(ev) => {
                onDateChange(new Date(ev.nativeEvent.timestamp));
              }}
            />
          </View>
        </View>
      </View>

      <View className="mt-auto rounded-[24px] border border-[#263B5F] bg-[#111111] p-2">
        <Pressable
          className="h-16 justify-center rounded-[18px] bg-[#1A2740]"
          onPress={onNext}
        >
          <Text className="font-lexend text-[23px] text-[#9CC0FA] text-center">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

function getMealIndex(meal: string | null) {
  if (meal === "lunch") return 1;
  if (meal === "dinner") return 2;
  return 0;
}
