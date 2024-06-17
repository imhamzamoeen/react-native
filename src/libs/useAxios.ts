import {API_VERSION, BASE_URL} from "../constants/Env";
import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {default as axios} from "axios";
import {destroyKey} from "./useHelper";
import {KEYS} from "@/constants/StorageKeys";
import {router} from "expo-router";

export default async function useApiFetch(
  uri: string,
  options: AxiosRequestConfig = {},
  forceUri = false
): Promise<any> {
  let apiRoute = `${API_VERSION}${uri}`;

  if (forceUri) {
    apiRoute = `${uri}`;
  }

  const config: AxiosRequestConfig = {
    url: `${BASE_URL}${apiRoute}`,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  };

  const token: any = await AsyncStorage.getItem("access_token");

  if (token && token !== "undefined") {
    config.headers!.Authorization = `Bearer ${token}`;
  }

  const apiInstance: AxiosInstance = axios.create(config);

  // Add a request interceptor
  apiInstance.interceptors.request.use(
    function (config) {
      // Log the request URL
      console.log("Request URL:", config.url);

      // Return the modified config or a promise containing it
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: any) => {
      if (error.response && error.response.status === 401) {
        destroyKey(KEYS.AUTH.TOKEN);
        destroyKey(KEYS.AUTH.USER);

        router.replace("/(auth)/login");
      }

      return Promise.reject(error);
    }
  );

  return await apiInstance.request<any>(config);
}
