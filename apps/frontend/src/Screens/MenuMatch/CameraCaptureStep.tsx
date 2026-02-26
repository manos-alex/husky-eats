import { RefObject } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { CameraView } from "expo-camera";
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
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View className="absolute inset-0 px-6 pt-6 pb-10 justify-between">
        <View className="self-center max-w-[360px] rounded-[18px] border border-[#9CC0FA66] bg-[#0A1420CC] px-4 py-3">
          <Text className="font-gotham text-[12px] tracking-[1px] text-[#A8C4EC]">PHOTO GUIDE</Text>
          <Text className="mt-2 font-lexend text-[16px] text-[#ECF4FF]">
            Center your plate in the circle and keep the full rim visible.
          </Text>
          <Text className="mt-1 font-lexend font-light text-[14px] text-[#B9CCE8]">
            Use overhead angle, avoid shadows, and keep your hand out of frame.
          </Text>
        </View>

        <View className="self-center items-center justify-center h-[280px] w-[280px] rounded-full border-2 border-[#E3EEFF] bg-[#0000002E]">
          <View className="h-[240px] w-[240px] rounded-full border border-[#CFE0FF66]" />
        </View>

        <View className="rounded-[20px] border border-[#A7C8FF44] bg-[#0D1727CC] px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              className="h-12 min-w-[96px] items-center justify-center rounded-[12px] border border-[#B5CAE840] bg-[#111D32]"
              onPress={onCancel}
              disabled={isCapturing}
            >
              <Text className="font-lexend text-[16px] text-[#D2E1F8]">Cancel</Text>
            </Pressable>

            <Pressable
              className="h-14 min-w-[170px] items-center justify-center rounded-[14px] border border-[#BFD8FF70] bg-[#2F82F8]"
              onPress={onCapture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="#ECF4FF" />
              ) : (
                <Text className="font-lexend font-semibold text-[20px] text-[#ECF4FF]">Capture Plate</Text>
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
