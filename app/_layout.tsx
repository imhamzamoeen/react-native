import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useFonts} from "expo-font";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {useEffect} from "react";
import Toast from "react-native-toast-message";
import {NativeWindStyleSheet} from "nativewind";
import * as Notifications from "expo-notifications";

import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
} from "@expo-google-fonts/poppins";
import useNotifications from "@/composables/useNotifications";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import {useColorScheme} from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

NativeWindStyleSheet.setOutput({
  default: "native",
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const {registerForPushNotificationsAsync} = useNotifications();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function runEffect() {
      await MediaLibrary.requestPermissionsAsync();
    }

    runEffect();
    registerForPushNotificationsAsync();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ActionSheetProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{flex: 1}}>
          <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}} />
            <Stack.Screen name="leads" options={{headerShown: false}} />
          </Stack>
        </GestureHandlerRootView>

        <Toast />
      </ThemeProvider>
    </ActionSheetProvider>
  );
}
