import { Pressable, Text, View } from "react-native";

type UploadStepProps = {
  onPickImage: () => Promise<void>;
};

export function UploadStep({ onPickImage }: UploadStepProps) {
  return (
    <View className="flex-1 px-6 pt-8 pb-10">
      <View className="absolute -top-12 -right-10 h-44 w-44 rounded-full bg-[#3F83F820]" />
      <View className="absolute top-40 -left-16 h-64 w-64 rounded-full bg-[#34D3991A]" />
      <View className="absolute bottom-12 -right-20 h-80 w-80 rounded-full bg-[#A78BFA14]" />

      <View className="mt-8 rounded-[24px] border border-[#5E7FB550] bg-[#161D29D8] px-6 py-7">
        <Text className="font-gotham text-[14px] tracking-[3px] text-[#8FB3EA]">SMART NUTRITION</Text>
        <Text className="mt-4 font-lexend text-[42px] leading-[48px] text-[#F5F8FF]">
          Show me your plate.
        </Text>
        <Text className="mt-1 font-lexend text-[42px] leading-[48px] text-[#DCE8FF]">Get your breakdown.</Text>
        <Text className="mt-6 font-lexend font-light text-[18px] leading-[28px] text-[#9DAFCB]">
          To begin, show me your plate and I will guide you through a fast, accurate estimate of calories and macros.
        </Text>
      </View>

      <View className="mt-6 rounded-[20px] border border-[#FFFFFF1A] bg-[#10151F] px-5 py-4">
        <Text className="font-gotham text-[14px] tracking-[1px] text-[#9CB2D7]">BEST RESULTS</Text>
        <Text className="mt-2 font-lexend text-[16px] text-[#D6E2F9]">Use bright lighting and show the full plate.</Text>
      </View>

      <View className="mt-auto w-[82%] max-w-[360px] self-center rounded-[20px] border border-[#89B7FF44] bg-[#1A2D4D96] p-2">
        <Pressable
          className="h-16 rounded-[14px] border border-[#BFD8FF70] bg-[#2F82F8] justify-center"
          onPress={onPickImage}
        >
          <Text className="font-lexend font-semibold text-[24px] text-[#ECF4FF] text-center">Take Photo</Text>
        </Pressable>
      </View>
    </View>
  );
}
