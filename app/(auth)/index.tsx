import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import {useEffect} from "react";
import useAuthStore from "@/stores/useAuthStore";
import {router} from "expo-router";
import RNExitApp from "react-native-exit-app";
import {version} from "../../package.json";
import useApiFetch from "@/libs/useAxios";

export default function () {
  const {fetchUser, fetchStatistics} = useAuthStore();

  async function runEffect() {
    try {
      const app = {
        version,
        platform: Platform.OS === "ios" ? "ios" : "android",
      };

      const {
        data: {updateAvailable},
      } = await useApiFetch(
        `/app/${app.platform}/versions/${app.version}/check-update`
      );

      if (updateAvailable) {
        Alert.alert(
          "New version available",
          "A new version is available. Would you like to update?",
          [
            {
              text: "Yes",
              onPress: () => {
                Linking.openURL(
                  Platform.OS === "ios"
                    ? "https://apps.apple.com/gb/app/meg-surveyor-app/id6480045355"
                    : "https://play.google.com/store/apps/details?id=com.meg.surveyor_app"
                );
                setTimeout(() => {
                  RNExitApp.exitApp();
                }, 500);
              },
            },
            {
              text: "No",
              onPress: () => {
                RNExitApp.exitApp();
              },
            },
          ]
        );
      } else {
        await fetchUser();
        await fetchStatistics();
        router.replace("/leads/");
      }
    } catch (e) {
      console.log(e);
      router.replace("/(auth)/login");
    }
  }

  useEffect(() => {
    runEffect();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
      automaticallyAdjustKeyboardInsets={true}
      showsVerticalScrollIndicator={false}
    >
      <ActivityIndicator />
    </ScrollView>
  );
}
