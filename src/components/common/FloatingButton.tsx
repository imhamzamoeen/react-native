import {TouchableOpacity} from "react-native";
import {Text, View} from "@/components/Themed";
import Animated, {FadeIn} from "react-native-reanimated";

type Props = {
  onPress: any;
  position?: "left" | "right";
  showTooltip?: Boolean;
  tooltipContent?: String;
  children?: any;
};

export default function ({
  onPress,
  showTooltip = true,
  tooltipContent,
  children,
  position = "right",
}: Props) {
  return (
    <View
      className={`absolute z-10 bottom-4 bg-transparent rounded-full ${
        position === "right" ? "right-4" : "left-4"
      }`}
    >
      {showTooltip && (
        <Animated.View
          entering={FadeIn.duration(1000).delay(400)}
          className="bg-black/90 dark:bg-white/90 items-center rounded-lg p-1 mb-2"
        >
          <Text className="text-center text-white/90 dark:text-dark/90 text-xs font-REGULAR z-20">
            {tooltipContent}
          </Text>
        </Animated.View>
      )}

      <TouchableOpacity
        className="w-16 h-16 bg-blue-500 rounded-full justify-center items-center"
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
}
