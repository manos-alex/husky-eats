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
    <View className="flex-1 px-5 pt-5 pb-8">
      <View className="absolute -top-12 -right-12 h-52 w-52 rounded-full bg-[#2F82F830]" />
      <View className="absolute top-64 -left-16 h-60 w-60 rounded-full bg-[#34D3991A]" />
      <View className="absolute bottom-12 -right-20 h-72 w-72 rounded-full bg-[#A78BFA12]" />

      <Text className="mt-2 font-lexend font-light text-[18px] text-center text-[#A7B8D6]">
        Confirm meal details before calculating nutrition.
      </Text>

      <ScrollView className="mt-5 flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="rounded-[24px] border border-[#607EA744] bg-[#151C28E0] px-4 py-4">
          <Text className="font-gotham text-[13px] tracking-[1.5px] text-[#9CB3D9]">YOUR PHOTO</Text>
          <View className="mt-3 h-64 rounded-[18px] border border-[#8CAAD830] bg-[#0D141F] items-center justify-center overflow-hidden px-3 py-3">
            {image ? (
              <Image source={{ uri: image }} className="h-full w-full rounded-[12px]" resizeMode="contain" />
            ) : (
              <Text className="font-lexend text-[16px] text-[#93A6C7]">No photo selected</Text>
            )}
          </View>
        </View>

        <View className="mt-4 rounded-[24px] border border-[#607EA744] bg-[#151C28E0] px-4 py-4">
          <Text className="font-gotham text-[13px] tracking-[1.5px] text-[#9CB3D9]">MEAL CONTEXT</Text>

          <View className="mt-3 rounded-[14px] border border-[#8CAAD830] bg-[#0D141F] px-4 py-3">
            <Text className="font-gotham text-[12px] tracking-[1px] text-[#8FA7CD]">DINING HALL</Text>
            <Text className="mt-1 font-lexend text-[24px] text-[#E9F1FF]">{hallLabel}</Text>
          </View>

          <View className="mt-3 rounded-[14px] border border-[#8CAAD830] bg-[#0D141F] px-4 py-3">
            <Text className="font-gotham text-[12px] tracking-[1px] text-[#8FA7CD]">MEAL TIME</Text>
            <Text className="mt-1 font-lexend text-[24px] text-[#E9F1FF]">{mealLabel}</Text>
          </View>

          <View className="mt-3 rounded-[14px] border border-[#8CAAD830] bg-[#0D141F] px-4 py-3">
            <Text className="font-gotham text-[12px] tracking-[1px] text-[#8FA7CD]">DATE</Text>
            <Text className="mt-1 font-lexend text-[24px] text-[#E9F1FF]">{formatDate(date)}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="mt-auto flex-row gap-3">
        <Pressable
          className="h-14 flex-1 rounded-[14px] border border-[#8CAAD844] bg-[#111A27] justify-center"
          onPress={onEdit}
        >
          <Text className="font-lexend text-[18px] text-center text-[#D5E4FC]">Edit</Text>
        </Pressable>
        <Pressable
          className="h-14 flex-[1.2] rounded-[14px] border border-[#BFD8FF70] bg-[#2F82F8] justify-center"
          onPress={onCalculate}
        >
          <Text className="font-lexend font-semibold text-[20px] text-center text-[#ECF4FF]">Calculate</Text>
        </Pressable>
      </View>
    </View>
  );
}
