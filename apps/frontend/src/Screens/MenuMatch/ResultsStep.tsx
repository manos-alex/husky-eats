import { ScrollView, Text, View } from "react-native";
import { Circle } from "react-native-progress";
import { ItemMatch, NutritionFacts } from "../../api";

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
  result: ItemMatch[];
};

export function ResultsStep({ totals, nutrientCircles, nutrition, result }: ResultsStepProps) {
  const formatMacro = (value: number) => `${value.toFixed(1)}g`;

  return (
    <View className="flex-1 px-5 pt-4 pb-8">
      <Text className="font-lexend font-light text-[17px] text-center text-[#A8A8A8]">
        Estimated from your plate and meal context.
      </Text>
      <Text className="mt-1 font-lexend font-light text-[12px] text-center text-[#8C8C8C]">
        * Estimates may vary by preparation methods and serving size.
      </Text>

      <ScrollView className="mt-4 flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="overflow-hidden rounded-[30px] border border-[#1A1A1A] bg-[#151515]">
          <View className="bg-[#171D27] px-5 py-5">
            <Text className="font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">TOTAL CALORIES</Text>
            <Text className="mt-3 font-lexend text-[56px] leading-[56px] text-[#E2E2E2]">
              {totals.calories.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </Text>
            <Text className="mt-1 font-lexend text-[20px] text-[#AFC8E8]">kcal</Text>
          </View>
        </View>

        <View className="mt-5 rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5">
          <View className="flex-row items-end justify-between">
            <Text className="font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">MACROS</Text>
            <Text className="font-lexend font-light text-[12px] text-[#8C8C8C]">% daily value</Text>
          </View>
          <View className="mt-3 flex-row justify-between">
            {nutrientCircles.map(({ key, total, dailyV }, index) => {
              const progress = Math.min(total / dailyV, 1);
              const percent = (total / dailyV) * 100;
              const color = getMacroColor(key, index);
              return (
                <View key={key} className="w-[32%] rounded-[22px] border border-[#202020] bg-[#171717] px-2 py-4">
                  <View className="items-center justify-center">
                    <Circle
                      progress={progress}
                      size={88}
                      thickness={6}
                      color={color}
                      unfilledColor="#262626"
                      borderWidth={0}
                    />
                    <View className="absolute items-center">
                      <Text className="font-lexend text-[12px] text-[#E2E2E2]">
                        {percent.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-3 font-gotham text-[12px] tracking-[0.7px] text-center text-[#8C8C8C]">{key}</Text>
                  <Text className="mt-1 font-lexend text-[16px] text-center text-[#E2E2E2]">{formatMacro(total)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="mt-5 overflow-hidden rounded-[30px] border border-[#1A1A1A] bg-[#151515]">
          <View className="bg-[#171D27] px-5 py-4">
            <Text className="font-gotham text-[14px] tracking-[1.5px] text-[#86A6CF]">ITEM BREAKDOWN</Text>
            <Text className="mt-1 font-lexend font-light text-[13px] text-[#AFC8E8]">
              Matched foods and estimated servings
            </Text>
          </View>

          <View className="gap-3 px-5 py-5">
            {result.map((item, index) => {
              const nf = nutrition.find((n) => n.id === Number(item.id));
              if (!nf) return null;

              const calories = (nf.calories ?? 0) * item.num_servings;
              const protein = (nf.protein_g ?? 0) * item.num_servings;
              const carbs = (nf.totalcarbohydrate_g ?? 0) * item.num_servings;
              const fat = (nf.totalfat_g ?? 0) * item.num_servings;
              const accent = getItemAccent(index);

              return (
                <View key={item.id} className="overflow-hidden rounded-[22px] border border-[#252525] bg-[#171717]">
                  <View className="absolute bottom-4 left-0 top-4 w-[4px] rounded-full" style={{ backgroundColor: accent }} />
                  <View className="px-4 py-4">
                    <View className="flex-row items-start justify-between">
                      <Text className="ml-2 mr-3 flex-1 font-lexend text-[22px] leading-[28px] text-[#E2E2E2]">
                        {item.name}
                      </Text>
                      <View className="rounded-full px-3 py-1" style={{ backgroundColor: `${accent}24` }}>
                        <Text className="font-lexend text-[13px]" style={{ color: accent }}>
                          {calories.toFixed(0)} kcal
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3 flex-row">
                      <View className="mr-2 flex-1 rounded-[16px] border border-[#252525] bg-[#151515] px-3 py-2">
                        <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8C8C8C]">SERVING SIZE</Text>
                        <Text className="mt-1 font-lexend text-[15px] text-[#D8D8D8]">{nf.servingsize || "N/A"}</Text>
                      </View>
                      <View className="ml-2 w-[96px] rounded-[16px] border border-[#252525] bg-[#151515] px-3 py-2">
                        <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8C8C8C]">SERVINGS</Text>
                        <Text className="mt-1 font-lexend text-[15px] text-[#D8D8D8]">{item.num_servings.toFixed(2)}</Text>
                      </View>
                    </View>

                    <View className="mt-3 flex-row flex-wrap justify-between">
                      <View className="mb-2 w-[48.5%] rounded-[16px] border border-[#252525] bg-[#151515] px-3 py-2">
                        <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8C8C8C]">CALORIES</Text>
                        <Text className="mt-1 font-lexend text-[17px] text-[#E2E2E2]">{calories.toFixed(0)} kcal</Text>
                      </View>
                      <View className="mb-2 w-[48.5%] rounded-[16px] border border-[#252525] bg-[#151515] px-3 py-2">
                        <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8C8C8C]">PROTEIN</Text>
                        <Text className="mt-1 font-lexend text-[17px] text-[#E2E2E2]">{formatMacro(protein)}</Text>
                      </View>
                      <View className="w-[48.5%] rounded-[16px] border border-[#252525] bg-[#151515] px-3 py-2">
                        <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8C8C8C]">CARBS</Text>
                        <Text className="mt-1 font-lexend text-[17px] text-[#E2E2E2]">{formatMacro(carbs)}</Text>
                      </View>
                      <View className="w-[48.5%] rounded-[16px] border border-[#252525] bg-[#151515] px-3 py-2">
                        <Text className="font-gotham text-[11px] tracking-[0.7px] text-[#8C8C8C]">FAT</Text>
                        <Text className="mt-1 font-lexend text-[17px] text-[#E2E2E2]">{formatMacro(fat)}</Text>
                      </View>
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

function getMacroColor(key: string, index: number) {
  if (key === "Protein") return "#8FD1A8";
  if (key === "Carbs") return "#E8C27A";
  if (key === "Fat") return "#E1A0A8";
  return ["#9CC0FA", "#A8D3AE", "#E8C27A"][index] ?? "#9CC0FA";
}

function getItemAccent(index: number) {
  return ["#9CC0FA", "#8FD1A8", "#E8C27A", "#E1A0A8", "#C0A6E8"][index % 5];
}
