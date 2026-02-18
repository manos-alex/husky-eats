import { ActivityIndicator, Text, View } from "react-native";

export function LoadingStep() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#2ECC71" />
      <Text className="mt-10 font-lexend font-light text-[#888] text-[20px]">Calculating results...</Text>
    </View>
  );
}
