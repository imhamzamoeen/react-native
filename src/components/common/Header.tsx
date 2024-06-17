import {Text} from "@/components/Themed";
import SinglePoint from "@/components/common/SinglePoint";
import Animated, {FadeIn} from "react-native-reanimated";
import {cva} from "class-variance-authority";

type Props = {
  heading: string;
  subheading?: string | null;
  point?: object | any;
  children?: any;
  position?: "center" | "start";
};

export default function HeaderDetails({
  heading,
  subheading = null,
  point = {},
  position,
}: Props) {
  const text = cva("text", {
    variants: {
      position: {
        center: ["text-center"],
        start: ["text-start"],
      },
    },
    defaultVariants: {
      position: "start",
    },
  });

  return (
    <Animated.View entering={FadeIn.duration(500)} className="px-5">
      <Text className={`${text({position})} text-4xl font-bold`}>
        {heading}
      </Text>
      {subheading && (
        <Text
          className={`${text({
            position,
          })} text-base text-gray-500 font-REGULAR my-1`}
        >
          {subheading}
        </Text>
      )}

      {Object.entries(point).map(([key, value]: any) => (
        <SinglePoint key={key} label={key} point={value} />
      ))}
    </Animated.View>
  );
}
