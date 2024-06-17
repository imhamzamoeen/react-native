import useToast from "@/libs/useToast";
import React from "react";
import {View} from "react-native";
import {CountdownCircleTimer} from "react-native-countdown-circle-timer";
import {Text} from "@/components/Themed";

type Props = {
  totalSeconds: number;
  remainingSeconds: number;
};

export default function ({totalSeconds, remainingSeconds}: Props) {
  const $toast = useToast();

  const renderChild = (remainingTime: number) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    if (remainingTime <= 0) {
      return (
        <Text className="font-REGULAR_ITALIC text-red-600 blink-animate">
          Time up... 😥
        </Text>
      );
    }

    return (
      <View className="flex-1 items-center justify-center gap-3 px-2">
        <Text className="font-REGULAR text-sm">Remaining</Text>
        <Text className="text-gray-600 font-REGULAR_ITALIC text-xs">{`${hours}h : ${minutes}m : ${seconds}s`}</Text>
      </View>
    );
  };

  return (
    <View>
      <CountdownCircleTimer
        size={140}
        trailColor="#e1e1e1"
        strokeWidth={4}
        trailStrokeWidth={10}
        isPlaying
        initialRemainingTime={remainingSeconds}
        duration={totalSeconds}
        colors={["#28a745", "#ffc107", "#f80102"]}
        colorsTime={[totalSeconds, totalSeconds / 2, 0]}
        onComplete={(): any =>
          $toast.makeToast({
            type: "info",
            message: "This survey time of this lead is passed.",
          })
        }
      >
        {({remainingTime}) => renderChild(remainingTime)}
      </CountdownCircleTimer>
    </View>
  );
}
