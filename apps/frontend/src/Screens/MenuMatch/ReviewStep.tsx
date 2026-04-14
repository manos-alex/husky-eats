import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { halls } from "./constants";
import { formatDate } from "./utils";

type ReviewStepProps = {
  image: string | null;
  hall: number | null;
  meal: string | null;
  date: Date;
  onEdit: () => void;
  onCalculate: () => void;
};

export function ReviewStep({ image, hall, meal, date, onEdit, onCalculate }: ReviewStepProps) {
  const hallLabel = hall ? halls[hall] : "Not selected";
  const mealLabel = meal ? meal.charAt(0).toUpperCase() + meal.slice(1) : "Not selected";

  return (
    <View className="flex-1 px-5 pt-4 pb-8">
      <Text className="font-lexend font-light text-[17px] text-center text-[#A8A8A8]">
        Confirm meal details before calculating nutrition.
      </Text>

      <ScrollView className="mt-4 flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5">
          <Text className="font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">YOUR PHOTO</Text>
          <View className="mt-4 h-64 items-center justify-center overflow-hidden rounded-[22px] border border-[#202020] bg-[#171717] px-3 py-3">
            {image ? (
              <Image
                source={{ uri: image }}
                className="h-full w-full rounded-[16px]"
                resizeMode="contain"
                style={{ transform: [{ scale: 2.5 }] }}
              />
            ) : (
              <Text className="font-lexend text-[16px] text-[#8C8C8C]">No photo selected</Text>
            )}
          </View>
        </View>

        <View className="mt-5 rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5">
          <Text className="font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">MEAL CONTEXT</Text>

          <View className="mt-4 rounded-[18px] border border-[#202020] bg-[#171717] px-4 py-3">
            <Text className="font-gotham text-[12px] tracking-[1px] text-[#8C8C8C]">DINING HALL</Text>
            <Text className="mt-1 font-lexend text-[24px] text-[#E2E2E2]">{hallLabel}</Text>
          </View>

          <View className="mt-3 rounded-[18px] border border-[#202020] bg-[#171717] px-4 py-3">
            <Text className="font-gotham text-[12px] tracking-[1px] text-[#8C8C8C]">MEAL TIME</Text>
            <Text className="mt-1 font-lexend text-[24px] text-[#E2E2E2]">{mealLabel}</Text>
          </View>

          <View className="mt-3 rounded-[18px] border border-[#202020] bg-[#171717] px-4 py-3">
            <Text className="font-gotham text-[12px] tracking-[1px] text-[#8C8C8C]">DATE</Text>
            <Text className="mt-1 font-lexend text-[24px] text-[#E2E2E2]">{formatDate(date)}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="mt-auto flex-row gap-3">
        <Pressable
          className="h-14 flex-1 justify-center rounded-[18px] border border-[#202020] bg-[#171717]"
          onPress={onEdit}
        >
          <Text className="font-lexend text-[18px] text-center text-[#D8D8D8]">Edit</Text>
        </Pressable>
        <Pressable
          className="h-14 flex-[1.2] justify-center rounded-[18px] border border-[#263B5F] bg-[#1A2740]"
          onPress={onCalculate}
        >
          <Text className="font-lexend text-[20px] text-center text-[#9CC0FA]">Calculate</Text>
        </Pressable>
      </View>
    </View>
  );
}
