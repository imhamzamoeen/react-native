import {Text, View} from "@/components/Themed";
import {cardShadowStyles} from "../../../assets/styles/global.styles";
import {Link} from "expo-router";

type Props = {
  label: string;
  point: string | any;
};

export default function SinglePoint({point, label}: Props) {
  return (
    <View
      className="flex bg-light dark:bg-dark items-start rounded-lg mt-2 p-4"
      style={[cardShadowStyles]}
    >
      <Text className="bg-light dark:bg-dark text-base font-MEDIUM text-dark dark:text-white capitalize">
        {label.replace(/^_+/, "").replace(/_/g, " ")}
      </Text>
      {point.toLowerCase().includes("https") ? (
        <Link href={point} className="text-blue-600">
          {point}
        </Link>
      ) : (
        <Text className="text-sm font-REGULAR text-gray-500">
          {point ?? "NULL"}
        </Text>
      )}
    </View>
  );
}
