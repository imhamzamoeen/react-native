import FloatingButton from "@/components/common/FloatingButton";
import HeaderDetails from "@/components/common/Header";
import LeadImages from "@/components/leads/LeadImages";
import {View} from "@/components/Themed";
import useLeadStore from "@/stores/useLeadsStore";
import useMediaLibraryImages from "@/stores/useMediaLibraryImages";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, Linking, SafeAreaView, Text} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import * as MediaLibrary from "expo-media-library";
import {Button} from "@rneui/base";
import * as ImagePicker from "expo-image-picker";

export default function () {
  const navigation = useNavigation();
  const {selectedLead, isFetching: leadFetching} = useLeadStore();
  const {
    pictures,
    index,
    isFetching: mediaLibraryFetching,
    isSyncing,
    onSyncStart,
    progress,
    reset,
    setIsLoading,
  }: any = useMediaLibraryImages();
  const [refreshKey, setRefreshKey]: any = useState(Math.random());
  const [showSyncButton, setShowSyncButton]: any = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [tooltipContent, setTooltipContent] = useState("Sync");
  const rotation = useSharedValue(0);

  const handleSync = async () => {
    await onSyncStart(selectedLead);
    await index(`${selectedLead.post_code} - ${selectedLead.address}`);
    setRefreshKey(Math.random());
  };

  const handleGrantPermissions = async () => Linking.openSettings();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  const handleFileUpload = async () => {
    try {
      const {assets}: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });

      const albumName = `${selectedLead.post_code} - ${selectedLead.address}`;
      const album: any = await MediaLibrary.getAlbumAsync(albumName);

      if (album && assets.length > 0) {
        await MediaLibrary.addAssetsToAlbumAsync(
          assets.map((a: any) => a.assetId),
          album.id
        );
      } else {
        const createdAlbum = await MediaLibrary.createAlbumAsync(
          albumName,
          assets[0].assetId
        );

        if (assets.length > 1) {
          const assetIds = assets.map((a: any) => a.assetId);
          await MediaLibrary.addAssetsToAlbumAsync(assetIds, createdAlbum.id);
        }
      }

      await refresh();
    } catch (e: any) {
      //
    }
  };

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      200
    );
    return () => cancelAnimation(rotation);
  }, []);

  const refresh = async () => {
    await index(`${selectedLead.post_code} - ${selectedLead.address}`);
    setRefreshKey(Math.random());
  };

  useEffect(() => {
    navigation.addListener("focus", async () => {
      const permissions = await MediaLibrary.getPermissionsAsync();

      if (
        permissions &&
        permissions.granted === true &&
        permissions.accessPrivileges !== "limited"
      ) {
        await refresh();
      }
    });

    navigation.addListener("blur", () => {
      setIsLoading();
      reset();
    });
  }, []);

  useEffect(() => {
    setShowSyncButton(pictures.filter((p: any) => !p.isSynced).length > 0);
  }, [pictures]);

  useEffect(() => setTooltipContent(progress), [progress]);

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <View className="flex-1" style={{paddingHorizontal: 16}}>
        {leadFetching && !isSyncing ? (
          <ActivityIndicator className="flex-1 items-center justify-center" />
        ) : (
          <>
            <HeaderDetails
              heading="Images"
              subheading={`Survey Pictures of (${selectedLead?.post_code})`}
            />

            {selectedLead === null ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500 font-MEDIUM_ITALIC">
                  Failed to fetch lead details.
                </Text>
              </View>
            ) : permissionResponse &&
              permissionResponse.granted === true &&
              permissionResponse.accessPrivileges !== "limited" ? (
              <>
                <LeadImages
                  key={refreshKey}
                  isFetching={mediaLibraryFetching}
                  pictures={pictures}
                />

                <Animated.View entering={FadeIn.delay(100).duration(1000)}>
                  <FloatingButton
                    showTooltip={false}
                    onPress={handleFileUpload}
                    position="left"
                  >
                    <Animated.View>
                      <Ionicons
                        color={"white"}
                        size={24}
                        name="cloud-upload-outline"
                      />
                    </Animated.View>
                  </FloatingButton>
                </Animated.View>

                {showSyncButton ? (
                  <Animated.View entering={FadeIn.delay(100).duration(1000)}>
                    <FloatingButton
                      showTooltip={true}
                      tooltipContent={
                        tooltipContent === "" ? "Sync" : tooltipContent
                      }
                      onPress={handleSync}
                    >
                      {isSyncing ? (
                        <Animated.View style={[animatedStyles]}>
                          <Ionicons color={"white"} size={24} name="sync" />
                        </Animated.View>
                      ) : (
                        <Animated.View>
                          <Ionicons color={"white"} size={24} name="sync" />
                        </Animated.View>
                      )}
                    </FloatingButton>
                  </Animated.View>
                ) : (
                  <></>
                )}
              </>
            ) : mediaLibraryFetching || permissionResponse === null ? (
              <ActivityIndicator />
            ) : (
              <View className="flex-1 items-center mt-4">
                <Button
                  title={"Grant media access"}
                  buttonStyle={{
                    padding: 8,
                    borderRadius: 6,
                  }}
                  onPress={handleGrantPermissions}
                />
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
