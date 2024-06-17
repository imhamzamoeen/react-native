import {Stack} from "expo-router";
import useHeader from "@/composables/useHeader";
import useNotifications from "@/composables/useNotifications";
import {useEffect} from "react";

export default function () {
  const {headerBasic, renderLogoutButton} = useHeader();
  const {token, storePushNotificationTokenOnServer} = useNotifications();

  useEffect(() => {
    if (token) {
      storePushNotificationTokenOnServer();
    }
  }, [token]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          ...headerBasic,
          headerLeft: () => renderLogoutButton({}),
        }}
      />

      <Stack.Screen name="[id]" options={{headerShown: false}} />
      <Stack.Screen
        name="calendar"
        options={{headerShown: false, presentation: "modal"}}
      />
    </Stack>
  );
}
