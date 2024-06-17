import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  baseDirectory,
  folderFilesEndpoint,
  temporaryLinkEndpoint,
} from "@/constants/Dropbox";
import {KEYS} from "@/constants/StorageKeys";
import {generateRandomString, getExceptionMessage} from "@/libs/useHelper";
import useToast from "@/libs/useToast";

export interface Picture {
  path_display: string;
  link: string;
}

interface DropboxStore {
  pictures: Picture[];
  isFetching: boolean;
  index: (folderName: string) => Promise<void>;
  reset: () => Promise<void>;
}

export const getHeaders = async (
  lead: any,
  fileName: string | undefined = undefined
) => {
  if (!fileName) {
    fileName = generateRandomString(20) + ".jpg";
  }

  const user: any = await AsyncStorage.getItem(KEYS.AUTH.USER);
  const jsonUser = JSON.parse(user);

  return {
    "Content-Type": "application/octet-stream",
    "Dropbox-API-Arg": JSON.stringify({
      autorename: true,
      mode: "add",
      mute: false,
      path: `${baseDirectory}/${lead.post_code} - ${lead.address}/Survey/${fileName}`,
      strict_conflict: true,
    }),
    Authorization: `Bearer ${jsonUser.dropbox.data}`,
  };
};

const useDropboxStore = create<DropboxStore>((set: any, get: any) => ({
  pictures: [],
  isFetching: false,
  index: async (folderName: string) => {
    try {
      set({isFetching: true});
      set({pictures: []});

      const batchSize = 10;
      const user: any = await AsyncStorage.getItem(KEYS.AUTH.USER);
      const jsonUser = JSON.parse(user);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jsonUser.dropbox.data}`,
      };

      const {data} = await axios.post(
        `${folderFilesEndpoint}`,
        {
          include_deleted: false,
          include_has_explicit_shared_members: false,
          include_media_info: true,
          include_mounted_folders: true,
          include_non_downloadable_files: true,
          limit: 2000,
          path: `${baseDirectory}/${folderName}/Survey`,
          recursive: false,
        },
        {headers}
      );

      data.entries = data.entries.sort((a: any, b: any) => {
        //@ts-ignore
        return new Date(b.client_modified) - new Date(a.client_modified);
      });

      set({pictures: data.entries});

      for (let i = 0; i < data.entries.length; i += batchSize) {
        const chunk = data.entries.slice(i, i + batchSize);
        const picturesWithLinks = await Promise.all(
          chunk.map(async (picture: Picture) => {
            const {
              data: {link},
            } = await axios.post(
              temporaryLinkEndpoint,
              {path: picture.path_display},
              {headers}
            );
            return {...picture, link};
          })
        );

        set((state: any) => ({
          pictures: state.pictures.map((p: any, index: any) => {
            if (index >= i && index < i + batchSize) {
              return picturesWithLinks[index - i];
            }
            return p;
          }),
        }));
      }
    } catch (e: any) {
      set({pictures: []});

      if (e.response.status !== 409) {
        useToast().makeToast({
          type: "error",
          message: getExceptionMessage(e),
        });
      }
    } finally {
      set({isFetching: false});
    }
  },
  reset: async () => {
    set({pictures: []});
  },
}));

export default useDropboxStore;
