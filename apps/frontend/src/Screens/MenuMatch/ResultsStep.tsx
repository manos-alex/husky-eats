import { ScrollView, Text, View } from "react-native";
import { Circle } from "react-native-progress";
import { NutritionFacts } from "../../api";
import { cardColors, result } from "./constants";

type Totals = {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
};

type NutrientCircle = {
  key: string;
  total: number;
  dailyV: number;
};

type ResultsStepProps = {
  totals: Totals;
  nutrientCircles: NutrientCircle[];
  nutrition: NutritionFacts[];
};

export function ResultsStep({ totals, nutrientCircles, nutrition }: ResultsStepProps) {
  return (
    <>
      <Text className="mt-3 font-lexend font-light text-[#888] text-[20px] text-center">Here is the breakdown...</Text>

      <View className="self-center w-[100%]">
        <Text className="mt-5 mx-5 font-lexend font-bold text-[42px] text-[#DDD]">
          {totals.calories.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          <Text className="font-lexend font-light text-[30px] text-[#DDD]"> calories</Text>
        </Text>
      </View>

      <ScrollView className="mt-5">
        <View className="flex-1 items-center">
          <View className="my-3 w-full flex-row justify-around">
            {nutrientCircles.map(({ key, total, dailyV }) => (
              <View key={key}>
                <View className="items-center justify-center">
                  <Circle
                    progress={total / dailyV}
                    size={125}
                    thickness={3}
                    color="#2ECC71"
                    unfilledColor="#555"
                    borderWidth={0}
                  />
                  <View className="absolute items-center">
                    <Text className="font-lexend text-[20px] text-[#DDD]">
                      {total.toFixed(1)}
                      <Text className="font-light text-[16px]"> g</Text>
                    </Text>
                    <Text className="mt-1 font-lexend text-[16px] text-[#DDD]">
                      {" "}
                      {((total / dailyV) * 100).toFixed(1)}% DV
                    </Text>
                  </View>
                </View>
                <Text className="mt-3 self-center font-lexend text-[16px] text-[#DDD]"> {key}</Text>
              </View>
            ))}
          </View>
          {result.map((item, index) => {
            const nf = nutrition.find((n) => n.id === Number(item.id));
            if (!nf) return null;
            const palette = cardColors[index % cardColors.length];

            return (
              <View className="m-3 w-[98%] rounded-[10px] border-[3px] border-[#505050] bg-[#D0D0D0] py-4 flex" key={item.id}>
                <Text className="font-lexend font-semibold text-[30px] text-[#454545] px-4">{item.name}</Text>
                <View className="flex">
                  <View className="mt-2 flex-row justify-around">
                    <View
                      className="w-[48%] h-16 border-[3px] rounded-[8px]"
                      style={{ backgroundColor: palette.fill, borderColor: palette.stroke }}
                    >
                      <Text className="font-lexend font-light text-[16px] text-[#DDD] self-center">Serving Size</Text>
                      <Text className="font-lexend font-bold text-[24px] text-[#DDD] self-center">{nf.servingsize}</Text>
                    </View>
                    <View
                      className="w-[48%] h-16 border-[3px] rounded-[8px]"
                      style={{ backgroundColor: palette.fill, borderColor: palette.stroke }}
                    >
                      <Text className="font-lexend font-light text-[16px] text-[#DDD] self-center">Servings</Text>
                      <Text className="font-lexend font-bold text-[24px] text-[#DDD] self-center">{item.servings}</Text>
                    </View>
                  </View>

                  <View className="my-2 w-[95%] h-[2px] self-center" style={{ backgroundColor: palette.stroke }} />

                  <View className="flex-row justify-around">
                    <View
                      className="w-[24%] h-[100%] border-[3px] rounded-[8px]"
                      style={{ backgroundColor: palette.fill, borderColor: palette.stroke }}
                    >
                      <Text className="font-lexend font-light text-[16px] text-[#DDD] self-center">Calories</Text>
                      <Text className="font-lexend font-bold text-[24px] text-[#DDD] self-center">
                        {((nf.calories ?? 0) * item.servings).toFixed(0)}
                      </Text>
                    </View>
                    <View
                      className="w-[24%] h-[100%] border-[3px] rounded-[8px]"
                      style={{ backgroundColor: palette.fill, borderColor: palette.stroke }}
                    >
                      <Text className="font-lexend font-light text-[16px] text-[#DDD] self-center">Protein</Text>
                      <Text className="font-lexend font-bold text-[24px] text-[#DDD] self-center">
                        {((nf.protein_g ?? 0) * item.servings).toFixed(1)}
                        <Text className="font-light text-[20px]">g</Text>
                      </Text>
                    </View>
                    <View
                      className="w-[24%] h-[100%] border-[3px] rounded-[8px]"
                      style={{ backgroundColor: palette.fill, borderColor: palette.stroke }}
                    >
                      <Text className="font-lexend font-light text-[16px] text-[#DDD] self-center">Carbs</Text>
                      <Text className="font-lexend font-bold text-[24px] text-[#DDD] self-center">
                        {((nf.totalcarbohydrate_g ?? 0) * item.servings).toFixed(1)}
                        <Text className="font-light text-[20px]">g</Text>
                      </Text>
                    </View>
                    <View
                      className="w-[24%] h-[100%] border-[3px] rounded-[8px]"
                      style={{ backgroundColor: palette.fill, borderColor: palette.stroke }}
                    >
                      <Text className="font-lexend font-light text-[16px] text-[#DDD] self-center">Fat</Text>
                      <Text className="font-lexend font-bold text-[24px] text-[#DDD] self-center">
                        {((nf.totalfat_g ?? 0) * item.servings).toFixed(1)}
                        <Text className="font-light text-[20px]">g</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
