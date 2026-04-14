import { RefObject } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

type CameraCaptureStepProps = {
  cameraRef: RefObject<CameraView | null>;
  onCancel: () => void;
  onCapture: () => Promise<void>;
  isCapturing: boolean;
};

export function CameraCaptureStep({ cameraRef, onCancel, onCapture, isCapturing }: CameraCaptureStepProps) {
  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View className="absolute inset-0 px-6 pt-14 pb-10 justify-between">
        <View className="self-center max-w-[360px] rounded-[22px] border border-[#1F2A3B] bg-[#151515D9] px-5 py-4">
          <Text className="font-gotham text-[12px] tracking-[1.5px] text-[#86A6CF]">PHOTO GUIDE</Text>
          <Text className="mt-2 font-lexend text-[16px] text-[#E2E2E2]">
            Center your plate in the circle and keep the full rim visible.
          </Text>
          <Text className="mt-1 font-lexend font-light text-[14px] text-[#A8A8A8]">
            Use overhead angle, avoid shadows, and keep your hand out of frame.
          </Text>
        </View>

        <View className="self-center items-center justify-center h-[280px] w-[280px] rounded-full border-2 border-[#9CC0FA] bg-[#00000033]">
          <View className="h-[240px] w-[240px] rounded-full border border-[#9CC0FA66]" />
        </View>

        <View className="rounded-[24px] border border-[#1C1C1C] bg-[#151515E6] px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              className="h-12 min-w-[96px] items-center justify-center rounded-full border border-[#202020] bg-[#171717]"
              onPress={onCancel}
              disabled={isCapturing}
            >
              <Text className="font-lexend text-[16px] text-[#D8D8D8]">Cancel</Text>
            </Pressable>

            <Pressable
              className="h-14 min-w-[170px] items-center justify-center rounded-[18px] border border-[#263B5F] bg-[#1A2740]"
              onPress={onCapture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="#9CC0FA" />
              ) : (
                <Text className="font-lexend text-[20px] text-[#9CC0FA]">Capture Plate</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
});
