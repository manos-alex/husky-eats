import { Picker } from "@react-native-picker/picker";
import { Pressable, Text, View } from "react-native";
import { DatePicker } from "../../../components/nativewindui/DatePicker";

type DetailsStepProps = {
  hall: number | null;
  meal: string | null;
  date: Date;
  onHallChange: (value: number | null) => void;
  onMealChange: (value: string | null) => void;
  onDateChange: (value: Date) => void;
  onNext: () => void;
};

export function DetailsStep({
  hall,
  meal,
  date,
  onHallChange,
  onMealChange,
  onDateChange,
  onNext,
}: DetailsStepProps) {
  return (
    <>
      <Text className="mt-10 font-lexend font-light text-[#888] text-[20px] text-center">
        Enter the details of your meal below...
      </Text>

      <Picker selectedValue={hall} onValueChange={(value) => onHallChange(value)}>
        <Picker.Item label="Select a hall…" value={null} />
        <Picker.Item label="Connecticut" value={3} />
        <Picker.Item label="McMahon" value={5} />
        <Picker.Item label="North" value={7} />
        <Picker.Item label="Northwest" value={15} />
        <Picker.Item label="Putnam" value={6} />
        <Picker.Item label="South" value={16} />
        <Picker.Item label="Towers" value={42} />
        <Picker.Item label="Whitney" value={1} />
      </Picker>

      <Picker selectedValue={meal} onValueChange={(value) => onMealChange(value)}>
        <Picker.Item label="Select a meal..." value={null} />
        <Picker.Item label="Breakfast" value="breakfast" />
        <Picker.Item label="Lunch" value="lunch" />
        <Picker.Item label="Dinner" value="dinner" />
      </Picker>

      <View style={{ marginHorizontal: 140 }}>
        <DatePicker
          value={date}
          mode="date"
          style={{ width: 320, height: 120, transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          onChange={(ev) => {
            onDateChange(new Date(ev.nativeEvent.timestamp));
          }}
        />
      </View>

      <Pressable className="mt-10 bg-[#2071f5] p-3 w-40 rounded-[5px] self-center" onPress={onNext}>
        <Text className="font-gotham font-bold text-[32px] text-[#deebff] text-center">Next</Text>
      </Pressable>
    </>
  );
}
