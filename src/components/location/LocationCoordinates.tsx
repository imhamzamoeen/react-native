import {Ionicons} from "@expo/vector-icons";
import {Text, View} from "@/components/Themed";
import {useEffect, useState} from "react";

import * as Location from "expo-location";
import {router, useNavigation} from "expo-router";
import useToast from "@/libs/useToast";
import {
  convertDMS,
  metersToFeet,
  direction as directionM,
} from "@/libs/useLocationHelper";
import {Linking} from "react-native";

export default function ({...rest}) {
  const navigation = useNavigation();
  const {makeToast} = useToast();

  const [location, setLocation]: any = useState(null);
  const [coordinates, setCoordinates]: any = useState(null);
  const [direction, setDirection]: any = useState(null);
  const [altitude, setAltitude]: any = useState(0);

  useEffect(() => {
    if (location) {
      setCoordinates(convertDMS(location.latitude, location.longitude));
      setAltitude(metersToFeet(location?.altitude ?? 0));
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        router.back();

        await makeToast({
          type: "error",
          message: "Location permission is required to proceeed.",
        });

        setTimeout(() => {
          Linking.openSettings();
        }, 1000);

        return;
      }

      let locationSubscription = await Location.watchHeadingAsync((v) => {
        const value = Math.floor(v.trueHeading);
        setDirection(`${value}°${directionM(value)}`);
      });

      navigation.addListener("beforeRemove", () =>
        locationSubscription.remove()
      );

      let {coords: oCoords}: any = await Location.getLastKnownPositionAsync({});

      if (oCoords) {
        setLocation(oCoords);
      }

      let {coords: nCoords} = await Location.getCurrentPositionAsync({});
      setLocation(nCoords);

      return () => {
        locationSubscription && locationSubscription.remove();
      };
    })();
  }, []);

  return (
    <View
      className="flex-row w-full p-2 justify-between bg-[#ffffff80] absolute"
      {...rest}
    >
      <View className="flex-row gap-1 items-center bg-transparent" {...rest}>
        <Ionicons name="sunny" color={"black"} size={28} />
        <Text className="text-sm font-MEDIUM text-black">{direction} (T)</Text>
      </View>

      <View className="flex-row gap-1 items-center bg-transparent" {...rest}>
        <Ionicons name="location" color={"black"} size={28} />
        <Text className="text-sm font-MEDIUM text-black">
          {coordinates ?? "-"}
        </Text>
      </View>

      <View className="flex-row gap-1 items-center bg-transparent " {...rest}>
        <Ionicons name="caret-up" color={"black"} size={28} />
        <Text className="text-sm font-MEDIUM text-black">{altitude} ft</Text>
      </View>
    </View>
  );
}
