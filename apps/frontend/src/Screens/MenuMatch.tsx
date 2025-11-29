import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function MenuMatch() {
    return (
        <SafeAreaView className="flex-1 bg-[#252525]">
            <Text className="font-lexend text-[#DDD] text-[48px] text-center">MenuMatch</Text>
        </SafeAreaView>
    );
}