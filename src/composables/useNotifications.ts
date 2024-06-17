import {useEffect, useRef, useState} from "react";
import {Platform} from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import useToast from "@/libs/useToast";
import {PushNotificationResponseEnum} from "@/enums/PushNotification";
import {EXPONENT_STORE} from "@/constants/Env";
import {getExceptionMessage} from "@/libs/useHelper";
import useApiFetch from "@/libs/useAxios";

export interface PushNotificationResponse {
  status: "succeeded" | string;
  expo_token?: string;
  error?: {message: string};
}

export default function () {
  const [token, setToken]: any = useState(null);
  const [notification, setNotification]: any = useState(false);

  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  const {makeToast} = useToast();

  const registerForPushNotificationsAsync = async () => {
    let scopedToken: any;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const {status: existingStatus} =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted" && finalStatus !== "undetermined") {
        makeToast({
          type: "error",
          message: "Push notifications not enabled.",
        });
        return;
      }

      scopedToken = await Notifications.getExpoPushTokenAsync({
        // @ts-ignore
        projectId: Constants.expoConfig.extra.eas.projectId,
      });

      setToken(scopedToken?.data);
    } else {
      useToast().makeToast({
        type: "error",
        message: "Must use physical device for Push Notifications.",
      });
    }

    return scopedToken?.data;
  };

  const storePushNotificationTokenOnServer = async () => {
    try {
      const {status, error}: PushNotificationResponse = await useApiFetch(
        EXPONENT_STORE,
        {method: "POST", data: {expo_token: token}},
        true
      );

      if (status !== PushNotificationResponseEnum.SUCCEEDED) {
        console.log("Failed to store push notification token", error?.message);
      }
    } catch (e) {
      useToast().makeToast({
        type: "error",
        message: getExceptionMessage(e),
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return {
    token,

    registerForPushNotificationsAsync,
    storePushNotificationTokenOnServer,
  };
}
