import { Pressable, ScrollView, Text, View } from "react-native";
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
  return (
    <View className="flex-1 px-5 pt-6 pb-8">
      <View className="absolute -top-12 right-0 h-44 w-44 rounded-full bg-[#3F83F81C]" />
      <View className="absolute top-52 -left-16 h-56 w-56 rounded-full bg-[#34D39914]" />

      <ScrollView className="mt-6" contentContainerStyle={{ paddingBottom: 22 }} showsVerticalScrollIndicator={false}>
        <View className="rounded-[20px] border border-[#5E7FB540] bg-[#161D29D8] px-4 py-4">
          <Text className="font-gotham text-[13px] tracking-[1px] text-[#A8B9D8]">DINING HALL</Text>
          <View className="mt-3 flex-row flex-wrap justify-between">
            {hallOptions.map((option) => {
              const selected = hall === option.value;
              return (
                <Pressable
                  key={option.value}
                  className={`mb-3 w-[48.5%] rounded-[14px] border px-3 py-3 ${
                    selected ? "border-[#97C4FF99] bg-[#2A4D7A]" : "border-[#8BA6D030] bg-[#0F1520]"
                  }`}
                  onPress={() => onHallChange(option.value)}
                >
                  <Text
                    className={`font-lexend text-[15px] text-center ${selected ? "text-[#EAF3FF]" : "text-[#B6C4DB]"}`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-[20px] border border-[#5E7FB540] bg-[#161D29D8] px-4 py-4">
          <Text className="font-gotham text-[13px] tracking-[1px] text-[#A8B9D8]">MEAL TIME</Text>
          <View className="mt-3 flex-row rounded-[14px] border border-[#8BA6D030] bg-[#0F1520] p-1">
            {mealOptions.map((option) => {
              const selected = meal === option.value;
              return (
                <Pressable
                  key={option.value}
                  className={`h-12 flex-1 rounded-[10px] justify-center ${
                    selected ? "border border-[#98C5FF88] bg-[#2A4D7A]" : ""
                  }`}
                  onPress={() => onMealChange(option.value)}
                >
                  <Text className={`font-lexend text-center ${selected ? "text-[#EBF4FF]" : "text-[#B6C4DB]"}`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-[20px] border border-[#5E7FB540] bg-[#161D29D8] px-4 py-4">
          <Text className="self-start font-gotham text-[13px] tracking-[1px] text-[#A8B9D8]">DATE</Text>
          <View className="mt-3 rounded-[14px] border border-[#8BA6D030] bg-[#0F1520] px-3 py-2 items-center">
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
      </ScrollView>

      <View className="mt-auto w-[82%] max-w-[360px] self-center rounded-[20px] border border-[#89B7FF44] bg-[#1A2D4D96] p-2">
        <Pressable
          className="h-16 rounded-[14px] border border-[#BFD8FF70] bg-[#2F82F8] justify-center"
          onPress={onNext}
        >
          <Text className="font-lexend font-semibold text-[24px] text-[#ECF4FF] text-center">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
