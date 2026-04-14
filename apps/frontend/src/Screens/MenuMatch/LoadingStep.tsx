import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";

export function LoadingStep() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;
  const floatValue = useRef(new Animated.Value(0)).current;
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 2100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 2100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    spin.start();
    pulse.start();
    float.start();

    const dots = setInterval(() => {
      setDotCount((value) => (value % 3) + 1);
    }, 450);

    return () => {
      spin.stop();
      pulse.stop();
      float.stop();
      clearInterval(dots);
    };
  }, [floatValue, pulseValue, spinValue]);

  const rotateA = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateB = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const coreScale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.08],
  });

  const coreOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const floatY = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View className="flex-1 px-6 pt-10 pb-10 items-center justify-center">
      <Animated.View
        className="items-center justify-center"
        style={{
          transform: [{ translateY: floatY }],
        }}
      >
        <View className="h-[310px] w-[310px] items-center justify-center">
          <Animated.View
            className="absolute h-[290px] w-[290px] rounded-full border border-[#202B3C]"
            style={{ transform: [{ rotate: rotateA }] }}
          />
          <Animated.View
            className="absolute h-[240px] w-[240px] rounded-full border border-[#263B5F]"
            style={{ transform: [{ rotate: rotateB }] }}
          />
          <Animated.View
            className="absolute h-[175px] w-[175px] rounded-full border border-[#263B5F] bg-[#1A274040]"
            style={{ transform: [{ scale: coreScale }], opacity: coreOpacity }}
          />
          <View className="h-[120px] w-[120px] rounded-full border border-[#263B5F] bg-[#1A2740] items-center justify-center">
            <Text className="font-gotham text-[14px] tracking-[1px] text-[#9CC0FA]">ANALYZING</Text>
          </View>
        </View>
      </Animated.View>

      <View className="mt-3 w-full max-w-[360px] rounded-[30px] border border-[#1A1A1A] bg-[#151515] px-5 py-5">
        <Text className="font-lexend text-[29px] leading-[34px] text-[#E2E2E2]">Building your meal estimate</Text>
        <Text className="mt-3 font-lexend font-light text-[17px] leading-[25px] text-[#A8A8A8]">
          Matching your plate with dining hall menu items and calculating calories, carbs, protein, and fat.
        </Text>
        <Text className="mt-4 font-gotham text-[13px] tracking-[1px] text-[#86A6CF]">{`Working${".".repeat(dotCount)}`}</Text>
      </View>

      <Text className="mt-5 font-lexend text-[14px] text-[#8C8C8C]">Usually takes a few seconds</Text>
    </View>
  );
}
