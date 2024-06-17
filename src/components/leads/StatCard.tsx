import {TouchableOpacity} from "react-native";
import {cardShadowStyles} from "../../../assets/styles/global.styles";
import {Text, View} from "@/components/Themed";
import {formatNumber} from "@/libs/useHelper";
import Animated, {FadeIn} from "react-native-reanimated";
import {Ionicons} from "@expo/vector-icons";

type Props = {
  title: string;
  model: {
    count: number;
    created_today: number;
    created_yesterday: number;
    change: number;
    incremental: boolean;
  };
};

export default function ({title, model}: Props) {
  const {incremental, change, count} = model;

  return (
    <Animated.View
      className="flex-1"
      entering={FadeIn.duration(500).delay(100)}
    >
      <TouchableOpacity
        className="flex-1 flex-row justify-between items-center py-4 px-3 bg-light dark:bg-dark rounded-xl"
        style={cardShadowStyles}
      >
        <View className="flex-row  items-center gap-1  bg-light dark:bg-dark rounded-xl">
          <Text className="text-sm font-REGULAR">{title}</Text>
          {incremental ? (
            <Ionicons name="trending-up" color={"green"} />
          ) : (
            <Ionicons name="trending-down" color={"#F80102"} />
          )}
        </View>
        <View className="flex-row mt-[1px] gap-1 bg-light dark:bg-dark rounded-xl">
          <Text className="text-xl font-MEDIUM">{formatNumber(count)}</Text>
          {incremental !== null && (
            <Text
              className="text-xs"
              style={{color: incremental ? "green" : "#F80102"}}
            >
              {incremental ? `+${change}` : change}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
