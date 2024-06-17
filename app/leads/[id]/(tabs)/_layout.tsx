import React from "react";
import {router, Tabs} from "expo-router";
import useLeadStore from "@/stores/useLeadsStore";
import useHeader from "@/composables/useHeader";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import {
  Linking,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import COLORS from "@/constants/Colors";
import {View} from "@/components/Themed";
import {STYLES} from "@/constants/Styles";
import {useActionSheet} from "@expo/react-native-action-sheet";

export default function () {
  const colorScheme = useColorScheme();

  const {showActionSheetWithOptions} = useActionSheet();
  const {selectedLead} = useLeadStore();
  const {headerTabs, renderBackButton, renderCameraButton} = useHeader();

  const handleCameraPress = async () => {
    const permissions = await MediaLibrary.getPermissionsAsync();

    if (
      permissions.granted === true &&
      permissions.accessPrivileges !== "limited"
    ) {
      router.navigate({
        pathname: "/leads/[id]/camera",
        params: {id: selectedLead.id},
      });
    } else {
      Linking.openSettings();
    }
  };

  const openInPhoneApp = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openInEmailApp = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openInMaps = () => {
    const options = ["Google Maps", "Waze", "Maps", "Cancel"];
    const destructiveButtonIndex = 3;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: any) => {
        if (selectedIndex !== cancelButtonIndex) {
          let url: any;
          let selectedPlatform: any;

          if (selectedIndex === 0) {
            selectedPlatform = "Google Maps";
          }

          if (selectedIndex === 1) {
            selectedPlatform = "Waze";
          }

          if (selectedIndex === 2) {
            selectedPlatform = "Maps";
          }

          const defaultAppUrl: any = Platform.select({
            ios: `maps:0,0?q=${selectedLead.plain_address}`,
            android: `geo:0,0?q=${selectedLead.plain_address}`,
          });

          if (selectedIndex === 0) {
            url =
              Platform.OS === "ios"
                ? `googleMaps://app?saddr=${selectedLead.plain_address}`
                : `google.navigation:q=${selectedLead.plain_address}`;
          } else if (selectedIndex === 1) {
            url = `https://www.waze.com/ul?q=${selectedLead.plain_address}`;
          } else {
            url = defaultAppUrl;
          }

          Linking.canOpenURL(url)
            .then(() => {
              Linking.openURL(url);
            })
            .catch((e) => {
              Linking.openURL(defaultAppUrl);
            });
        }
      }
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.default.navbarIcon,
        tabBarLabelStyle: {
          fontFamily: STYLES.FONTS.MEDIUM,
        },
        tabBarStyle: {
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS[colorScheme ?? "light"].background,
              overflow: "hidden",
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Information",
          ...headerTabs,
          headerLeft: () => renderBackButton({styles: {marginLeft: 15}}),
          headerRight: () => (
            <View className="flex-row items-center" style={{marginRight: 20}}>
              {selectedLead?.phone_number_formatted && (
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={() =>
                    openInPhoneApp(selectedLead.phone_number_formatted)
                  }
                >
                  <MaterialCommunityIcons
                    size={26}
                    color={COLORS.default.navbarIcon}
                    name="phone-forward"
                  />
                </TouchableOpacity>
              )}
              {selectedLead?.email && (
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={() => openInEmailApp(selectedLead.email)}
                >
                  <MaterialIcons
                    color={COLORS.default.navbarIcon}
                    size={30}
                    name="mail"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={openInMaps}>
                <FontAwesome5
                  size={24}
                  color={COLORS.default.navbarIcon}
                  name="map-marker-alt"
                />
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({color}) => (
            <Ionicons
              size={28}
              name="information-circle-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dropbox"
        options={{
          title: "Dropbox",
          ...headerTabs,
          headerLeft: () => renderBackButton({styles: {marginLeft: 15}}),
          tabBarIcon: ({color}) => (
            <FontAwesome size={24} name="dropbox" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          ...headerTabs,
          headerLeft: () => renderBackButton({styles: {marginLeft: 15}}),
          headerRight: () =>
            renderCameraButton({
              styles: {marginRight: 20},
              handlePress: handleCameraPress,
            }),
          tabBarIcon: ({color}) => (
            <MaterialIcons size={24} name="photo-library" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
