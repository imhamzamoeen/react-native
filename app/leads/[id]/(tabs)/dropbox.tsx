import HeaderDetails from "@/components/common/Header";
import LeadImages from "@/components/leads/LeadImages";
import {View} from "@/components/Themed";
import useDropboxStore from "@/stores/useDropboxStore";
import useLeadStore from "@/stores/useLeadsStore";
import {useGlobalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, SafeAreaView, Text} from "react-native";

export default function LeadDetailsPage() {
  const {id} = useGlobalSearchParams();
  const {selectedLead, isFetching: leadFetching, fetchLead} = useLeadStore();
  const {pictures, index, isFetching: dropboxFetching}: any = useDropboxStore();

  const onRefresh = async () => {
    await index(`${selectedLead.post_code} - ${selectedLead.address}`);
  };

  useEffect(() => {
    (async () => {
      const {lead} = await fetchLead(id as any);
      await index(`${lead.post_code} - ${lead.address}`);
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <View className="flex-1" style={{paddingHorizontal: 16}}>
        {leadFetching ? (
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
            ) : (
              <LeadImages
                key={pictures}
                pictures={pictures}
                isFetching={dropboxFetching}
                refresh={onRefresh}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
