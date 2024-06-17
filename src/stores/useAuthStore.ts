import {KEYS} from "@/constants/StorageKeys";
import useApiFetch from "@/libs/useAxios";
import {destroyKey, alertErrorMessage, storeKey} from "@/libs/useHelper";
import {Alert, Platform} from "react-native";
import {create} from "zustand";

interface LoginCredentials {
  email: string;
  password: string;
}

const useAuthStore = create((set: any, get: any) => ({
  isFetching: false,
  user: {} as any,
  stats: {} as any,
  errors: {} as any,
  login: async (credentials: LoginCredentials) => {
    try {
      set({isFetching: true});

      const {data} = await useApiFetch("/login", {
        method: "POST",
        data: {
          ...credentials,
          device_name: `${Platform.OS} ${Platform.Version}}`,
        },
      });

      await storeKey(KEYS.AUTH.TOKEN, data.access_token);
      await get().fetchUser();
    } catch (e: any) {
      alertErrorMessage(e);

      if (e?.response?.status === 422) {
        set({errors: e?.response?.data?.errors});
      }

      throw Error(e);
    } finally {
      set({isFetching: false});
    }
  },
  logout: async () => {
    destroyKey(KEYS.AUTH.TOKEN);
    destroyKey(KEYS.AUTH.USER);
    set({user: {}});
  },
  fetchStatistics: async () => {
    try {
      set({isFetching: true});
      set({errors: {}});

      const {data} = await useApiFetch("/stats");

      set({stats: data});
    } catch (e: any) {
      alertErrorMessage(e);

      if (e?.response?.status === 422) {
        set({errors: e?.response?.data?.errors});
      }

      throw Error(e);
    } finally {
      set({isFetching: false});
    }
  },
  fetchUser: async () => {
    try {
      set({isFetching: true});
      set({errors: {}});

      const {data} = await useApiFetch("/user");

      await storeKey(KEYS.AUTH.USER, JSON.stringify(data.user));
      set({user: data.user});
    } catch (e: any) {
      alertErrorMessage(e);

      if (e?.response?.status === 422) {
        set({errors: e?.response?.data?.errors});
      }

      throw Error(e);
    } finally {
      set({isFetching: false});
    }
  },
}));

export default useAuthStore;
