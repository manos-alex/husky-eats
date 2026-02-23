import { ScrollView, Text, View } from "react-native";
import { Circle } from "react-native-progress";
import { NutritionFacts } from "../../api";
import { result } from "./constants";

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
  const formatMacro = (value: number) => `${value.toFixed(1)}g`;

  return (
    <View className="flex-1 px-3 pt-5 pb-8">
      <View className="absolute -top-12 -right-14 h-56 w-56 rounded-full bg-[#2F82F82A]" />
      <View className="absolute top-52 -left-20 h-72 w-72 rounded-full bg-[#34D39916]" />
      <View className="absolute bottom-6 -right-20 h-80 w-80 rounded-full bg-[#A78BFA14]" />

      <Text className="mt-2 font-lexend font-light text-[18px] text-center text-[#A7B8D6]">
        Estimated from your plate and meal context.
      </Text>
      <Text className="mt-1 font-lexend font-light text-[12px] text-center text-[#8FA4C8]">
        * Estimates may vary by preparation methods and serving size.
      </Text>

      <ScrollView className="mt-5 flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="rounded-[24px] border border-[#607EA744] bg-[#151C28E0] px-5 py-5">
          <Text className="font-gotham text-[13px] tracking-[1.2px] text-[#9CB3D9]">TOTAL CALORIES</Text>
          <Text className="mt-3 font-lexend text-[52px] leading-[52px] text-[#F3F8FF]">
            {totals.calories.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </Text>
          <Text className="mt-1 font-lexend text-[20px] text-[#BFD0EA]">kcal</Text>
        </View>

        <View className="mt-4 rounded-[24px] border border-[#607EA744] bg-[#151C28E0] px-4 py-4">
          <Text className="font-gotham text-[13px] tracking-[1.2px] text-[#9CB3D9]">MACROS</Text>
          <Text className="mt-1 font-lexend font-light text-[12px] text-[#8FA4C8]">• % Daily value</Text>
          <View className="mt-3 flex-row justify-between">
            {nutrientCircles.map(({ key, total, dailyV }) => {
              const progress = Math.min(total / dailyV, 1);
              const percent = (total / dailyV) * 100;
              return (
                <View key={key} className="w-[32%] rounded-[16px] border border-[#8CAAD830] bg-[#0D141F] px-2 py-3">
                  <View className="items-center justify-center">
                    <Circle
                      progress={progress}
                      size={88}
                      thickness={6}
                      color="#61A4FF"
                      unfilledColor="#23344D"
                      borderWidth={0}
                    />
                    <View className="absolute items-center">
                      <Text className="font-lexend text-[12px] text-[#D9E8FF]">
                        {percent.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-2 font-gotham text-[12px] tracking-[0.7px] text-center text-[#8FA7CD]">{key}</Text>
                  <Text className="mt-1 font-lexend text-[16px] text-center text-[#E9F1FF]">{formatMacro(total)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-[24px] border border-[#607EA744] bg-[#151C28E0] px-4 py-4">
          <Text className="font-gotham text-[13px] tracking-[1.2px] text-[#9CB3D9]">ITEM BREAKDOWN</Text>

          <View className="mt-3 gap-3">
            {result.map((item) => {
              const nf = nutrition.find((n) => n.id === Number(item.id));
              if (!nf) return null;

              const calories = (nf.calories ?? 0) * item.servings;
              const protein = (nf.protein_g ?? 0) * item.servings;
              const carbs = (nf.totalcarbohydrate_g ?? 0) * item.servings;
              const fat = (nf.totalfat_g ?? 0) * item.servings;

              return (
                <View key={item.id} className="rounded-[16px] border border-[#8CAAD830] bg-[#0D141F] px-4 py-4">
                  <Text className="font-lexend text-[22px] leading-[27px] text-[#ECF3FF]">{item.name}</Text>

                  <View className="mt-3 flex-row">
                    <View className="mr-2 flex-1 rounded-[12px] border border-[#7B97BF33] bg-[#142033] px-3 py-2">
                      <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8FA7CD]">SERVING SIZE</Text>
                      <Text className="mt-1 font-lexend text-[15px] text-[#DCE9FF]">{nf.servingsize || "N/A"}</Text>
                    </View>
                    <View className="ml-2 w-[96px] rounded-[12px] border border-[#7B97BF33] bg-[#142033] px-3 py-2">
                      <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8FA7CD]">SERVINGS</Text>
                      <Text className="mt-1 font-lexend text-[15px] text-[#DCE9FF]">{item.servings.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row flex-wrap justify-between">
                    <View className="mb-2 w-[48.5%] rounded-[12px] border border-[#7B97BF33] bg-[#111C2D] px-3 py-2">
                      <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8FA7CD]">CALORIES</Text>
                      <Text className="mt-1 font-lexend text-[17px] text-[#E9F1FF]">{calories.toFixed(0)} kcal</Text>
                    </View>
                    <View className="mb-2 w-[48.5%] rounded-[12px] border border-[#7B97BF33] bg-[#111C2D] px-3 py-2">
                      <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8FA7CD]">PROTEIN</Text>
                      <Text className="mt-1 font-lexend text-[17px] text-[#E9F1FF]">{formatMacro(protein)}</Text>
                    </View>
                    <View className="w-[48.5%] rounded-[12px] border border-[#7B97BF33] bg-[#111C2D] px-3 py-2">
                      <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8FA7CD]">CARBS</Text>
                      <Text className="mt-1 font-lexend text-[17px] text-[#E9F1FF]">{formatMacro(carbs)}</Text>
                    </View>
                    <View className="w-[48.5%] rounded-[12px] border border-[#7B97BF33] bg-[#111C2D] px-3 py-2">
                      <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8FA7CD]">FAT</Text>
                      <Text className="mt-1 font-lexend text-[17px] text-[#E9F1FF]">{formatMacro(fat)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
