import { create } from "zustand";
import useToast from "@/libs/useToast";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { fileUploadEndpoint } from "@/constants/Dropbox";
import { getHeaders } from "./useDropboxStore";
import * as ImageManipulator from "expo-image-manipulator";
import useLeadStore from "./useLeadsStore";
import { getAssetIdFormatted } from "@/libs/useHelper";
import { immer } from "zustand/middleware/immer";

interface Picture {
  path_display: string;
  link: string;
  asset?: any;
}

interface DropboxStore {
  pictures: Picture[];
  isFetching: boolean;
  isSyncing: boolean;
  onSyncStart: any;
  progress: string;
  index: (folderName: string) => Promise<void>;
  reset: () => Promise<void>;
}

const useMediaLibraryImages = create<any>(
  immer((set: any, get: any) => ({
    pictures: [],
    isFetching: false,
    isSyncing: false,
    progress: "",
    getAllAssets: async (album: string) => {
      let allAssets: any = [];
      let hasNextPage = true;
      let endCursor = undefined;

      try {
        while (hasNextPage) {
          const { assets, endCursor: nextCursor, hasNextPage: nextPageExists } = await MediaLibrary.getAssetsAsync({ album, mediaType: 'photo', sortBy: 'creationTime', after: endCursor });

          allAssets = allAssets.concat(assets);
          hasNextPage = nextPageExists;
          endCursor = nextCursor;
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
      }

      return allAssets;
    },
    index: async (folderName: string) => {
      try {
        set({ isFetching: true });
        set({ pictures: [] });

        const assetsData: any = [];
        const album = await MediaLibrary.getAlbumAsync(folderName);

        try {
          if (album) {
            const { assets } = await MediaLibrary.getAssetsAsync({ album, mediaType: 'photo', first: 10000 });

            for await (const asset of assets) {
              const info = await MediaLibrary.getAssetInfoAsync(asset);
              const assetFormatted = getAssetIdFormatted(info.uri);

              assetsData.push({
                id: Math.random(),
                createdAt: asset.creationTime,
                name: info.filename,
                link: info.uri,
                isLocal: true,
                assetId: assetFormatted,
                isSynced: useLeadStore
                  .getState()
                  .selectedLead.mobile_asset_syncs.find(
                    (i: any) => i.asset_id === assetFormatted
                  ),
              });
            }

            set((state: any) => {
              state.pictures = assetsData
            });
          }
        } catch (e) {
          //
        } finally {
          set({ isFetching: false });
        }
      } catch (e: any) {
        set({ pictures: [] });
        useToast().makeToast({ type: "error", message: e.message });
      }
    },
    onSyncStart: async (lead: any) => {
      try {
        set({ isSyncing: true });

        const pictures = get().pictures.filter((p: any) => !p.isSynced);
        let counter = 1;

        for await (const picture of pictures) {
          set({ progress: `${counter}/${pictures.length}` });

          try {
            const manipResult = await ImageManipulator.manipulateAsync(
              picture.link,
              [{ rotate: 0 }],
              { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
            );

            const headers = await getHeaders(lead);

            await FileSystem.uploadAsync(fileUploadEndpoint, manipResult.uri, {
              headers: headers,
              uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
              fieldName: "file",
              mimeType: "image/*",
              httpMethod: "POST",
            });

            await useLeadStore
              .getState()
              .storeAssetSync(lead.id, picture.assetId);
          } catch (e: any) {
            console.error(e);
          }

          counter++;
        }

        useToast().makeToast({
          type: "success",
          message: "All image(s) were synced successfully.",
        });
      } catch (e: any) {
        console.error(e);
        useToast().makeToast({ type: "error", message: e.message });
      } finally {
        set({ pictures: [] });
        set({ progress: "Sync" });
        set({ isSyncing: false });
      }
    },
    reset: async () => {
      set({ pictures: [] });
    },
    setIsLoading: async (type = true) => {
      set({ isFetching: type });
    },
  }))
);

export default useMediaLibraryImages;
