import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";
import useTime from "./useTime";

export const alertErrorMessage = (e: any) => {
  if (![422, 401].includes(e?.response?.status)) {
    Alert.alert("Error", getExceptionMessage(e));
  }
};

export const getExceptionMessage = (e: any) =>
  e?.response?.data?.message ?? e.message;

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const storeKey = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e: any) {
    Alert.alert("Error", e.message);
  }
};

export const destroyKey = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e: any) {
    Alert.alert("Error", e.message);
  }
};

export const generateRandomString = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const getAssetIdFormatted = (id: string) => id.replace("ph://", "");

export const strTruncated = (str: string, length: number = 20) => {
  let truncatedString = str.substring(0, length);

  if (str.length > length) {
    truncatedString += "...";
  }

  return truncatedString;
};

export const formattedLeadComments = async (lead: any) => {
  const messages = [
    {
      _id: 0,
      text: `${lead.actual_post_code} was added in system.`,
      createdAt: new Date(lead.created_at),
      system: true,
    },
    ...lead.comments.map((c: any) => ({
      _id: c.id,
      text: c.comment,
      createdAt: new Date(c.created_at),
      received: true,
      user: {
        _id: c.commentator.id,
        name: c.commentator.name,
        role: c.commentator.top_role,
      },
    })),
  ];

  return messages.sort((a, b) => b.createdAt - a.createdAt);
};

export const formatNumber = (n: number) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";

  return n;
};
