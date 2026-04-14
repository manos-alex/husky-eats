import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

type UploadStepProps = {
  onPickImage: () => Promise<void>;
  onMenusPress: () => void;
  animateTabFrom?: "Menus" | "MenuMatch";
  animateTabNonce?: number;
};

export function UploadStep({ onPickImage, onMenusPress, animateTabFrom, animateTabNonce }: UploadStepProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const tabAnimation = useRef(new Animated.Value(animateTabFrom === "Menus" ? 0 : 1)).current;

  useEffect(() => {
    if (animateTabFrom !== "Menus" || !tabBarWidth) {
      return;
    }

    tabAnimation.setValue(0);
    Animated.timing(tabAnimation, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animateTabFrom, animateTabNonce, tabAnimation, tabBarWidth]);

  return (
    <View className="flex-1 px-5 pt-3">
      <View className="rounded-[32px] border border-[#1A1A1A] bg-[#171D27] px-6 py-6">
        <Text className="font-gotham text-[44px] leading-[50px] text-[#E2E2E2]">
          MenuMatch
        </Text>
        <Text className="mt-3 font-lexend font-light text-[18px] leading-[28px] text-[#AFC8E8]">
          Take a photo of your plate and get an estimated calorie and macro breakdown.
        </Text>
      </View>

      <View className="mt-5 overflow-hidden rounded-[32px] border border-[#1A1A1A] bg-[#151515]">
        <View className="px-6 py-5">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-[#1A2740]">
              <Text className="font-lexend text-[22px] text-[#9CC0FA]">1</Text>
            </View>
            <View className="flex-1">
              <Text className="font-lexend text-[20px] text-[#E2E2E2]">Snap your meal</Text>
              <Text className="mt-1 font-lexend font-light text-[15px] text-[#A8A8A8]">
                Bright lighting and the full plate help most.
              </Text>
            </View>
          </View>

          <View className="my-4 ml-6 h-8 w-px bg-[#2A2A2A]" />

          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-[#162019]">
              <Text className="font-lexend text-[22px] text-[#A8D3AE]">2</Text>
            </View>
            <View className="flex-1">
              <Text className="font-lexend text-[20px] text-[#E2E2E2]">Confirm the context</Text>
              <Text className="mt-1 font-lexend font-light text-[15px] text-[#A8A8A8]">
                Choose the dining hall, meal time, and date.
              </Text>
            </View>
          </View>

          <View className="my-4 ml-6 h-8 w-px bg-[#2A2A2A]" />

          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-[#2A2115]">
              <Text className="font-lexend text-[22px] text-[#E8C27A]">3</Text>
            </View>
            <View className="flex-1">
              <Text className="font-lexend text-[20px] text-[#E2E2E2]">Review the estimate</Text>
              <Text className="mt-1 font-lexend font-light text-[15px] text-[#A8A8A8]">
                See matched items, servings, calories, and macros.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1 justify-center">
        <View className="rounded-[24px] border border-[#263B5F] bg-[#111111] p-2">
          <Pressable
            className="h-16 justify-center rounded-[18px] bg-[#1A2740]"
            onPress={onPickImage}
          >
            <Text className="text-center font-lexend text-[23px] text-[#9CC0FA]">
              Take Photo
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="-mx-5 border-t border-[#1B1B1B] bg-[#111111] px-5 pb-6 pt-4">
        <View
          className="relative flex-row rounded-[24px] border border-[#1C1C1C] bg-[#161616] p-2"
          onLayout={(event) => setTabBarWidth(event.nativeEvent.layout.width)}
        >
          <Animated.View
            className="absolute bottom-2 left-2 top-2 rounded-[18px] bg-[#1A2740]"
            style={{
              width: tabBarWidth ? (tabBarWidth - 16) / 2 : 0,
              transform: [
                {
                  translateX: tabAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: tabBarWidth ? [0, (tabBarWidth - 16) / 2] : [0, 0],
                  }),
                },
              ],
            }}
          />
          <BottomNavButton label="Menus" onPress={onMenusPress} />
          <BottomNavButton active label="MenuMatch" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

function BottomNavButton({
  active = false,
  label,
  onPress,
}: {
  active?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="z-10 flex-1 rounded-[18px] px-4 py-3"
      onPress={onPress}
    >
      <Text className={`text-center font-lexend text-[16px] ${active ? "text-[#9CC0FA]" : "text-[#8C8C8C]"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
