import { Image, Pressable, Text, View } from "react-native";
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
  return (
    <>
      <Text className="mt-10 font-lexend font-light text-[#888] text-[20px] text-center">
        Please review your meal details...
      </Text>

      <View className="mt-10 flex-1 items-center">
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} resizeMode="contain" />}
        <View className="mt-10 flex-row w-[85%] justify-center">
          <View className="mx-5">
            <Text className="font-gotham text-[20px] text-[#DDD]">Hall</Text>
            <Text className="font-lexend text-[32px] text-[#DDD]">{hall && halls[hall]}</Text>
          </View>
          <View className="mx-5">
            <Text className="font-gotham text-[20px] text-[#DDD]">Meal</Text>
            <Text className="font-lexend text-[32px] text-[#DDD]">
              {meal === "breakfast" ? "Breakfast" : meal === "lunch" ? "Lunch" : "Dinner"}
            </Text>
          </View>
        </View>
        <View className="mt-10">
          <Text className="font-gotham text-[20px] text-[#DDD]">Date</Text>
          <Text className="font-lexend text-[32px] text-[#DDD]">{formatDate(date)}</Text>
        </View>

        <View className="flex-row w-[70%] justify-between">
          <Pressable className="mt-20 bg-[#33373d] p-3 w-auto rounded-[5px] self-center" onPress={onEdit}>
            <Text className="font-gotham font-bold text-[24px] text-[#deebff] text-center">Edit</Text>
          </Pressable>
          <Pressable className="mt-20 bg-[#2071f5] p-3 w-auto rounded-[5px] self-center" onPress={onCalculate}>
            <Text className="font-lexend font-bold text-[32px] text-[#deebff] text-center">Calculate</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
