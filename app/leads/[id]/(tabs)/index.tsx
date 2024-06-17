import HeaderDetails from "@/components/common/Header";
import LeadDetailsTabs from "@/components/leads/LeadDetailsTabs";
import {Text, View} from "@/components/Themed";
import useLeadStore from "@/stores/useLeadsStore";
import {useGlobalSearchParams, useNavigation} from "expo-router";
import React, {useEffect} from "react";
import {ActivityIndicator, useColorScheme} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Badge} from "@rneui/base";
import {STYLES} from "@/constants/Styles";
import COLORS from "@/constants/Colors";

export default function LeadDetailsPage() {
  const colorScheme = useColorScheme();
  const {id} = useGlobalSearchParams();
  const {selectedLead, isFetching: leadFetching, fetchLead} = useLeadStore();

  const navigation = useNavigation();

  const runEffect = async () => {
    await fetchLead(id as any);
  };

  useEffect(() => {
    navigation.addListener("beforeRemove", () => {
      useLeadStore.setState({selectedLead: null});
    });

    runEffect();
  }, []);

  return (
    <SafeAreaView
      edges={["right", "left"]}
      className="flex-1 bg-light-background dark:bg-dark-background"
    >
      {leadFetching ? (
        <ActivityIndicator className="flex-1 items-center justify-center" />
      ) : selectedLead === null ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 font-MEDIUM_ITALIC">
            Failed to fetch lead details.
          </Text>
        </View>
      ) : (
        <>
          <View className="flex-row justify-between">
            <HeaderDetails heading="Information" />

            <Badge
              containerStyle={{paddingVertical: 4, marginRight: 14}}
              badgeStyle={{
                backgroundColor:
                  selectedLead?.status_details?.lead_status_model?.color ??
                  COLORS[colorScheme ?? "light"].navbarIcon,
                height: 30,
                paddingHorizontal: 10,
                borderRadius: 50,
              }}
              textStyle={{fontFamily: STYLES.FONTS.MEDIUM}}
              value={selectedLead?.status_details.name}
            />
          </View>
          {(selectedLead?.phone_number_formatted || selectedLead?.email) && (
            <View className="flex-row justify-start px-5"></View>
          )}

          <LeadDetailsTabs lead={selectedLead} />
        </>
      )}
    </SafeAreaView>
  );
}
