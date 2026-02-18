import { Pressable, Text } from "react-native";

type UploadStepProps = {
  onPickImage: () => Promise<void>;
};

export function UploadStep({ onPickImage }: UploadStepProps) {
  return (
    <>
      <Text className="mt-[30%] font-lexend font-light text-[#888] text-[20px] text-center">
        Please provide an image of your meal...
      </Text>

      <Pressable
        className="mt-20 flex bg-[#455875] p-3 w-80 h-[12%] rounded-[5px] self-center justify-center"
        onPress={onPickImage}
      >
        <Text className="font-lexend font-bold text-[32px] text-[#deebff] text-center">Choose Image</Text>
      </Pressable>
    </>
  );
}
