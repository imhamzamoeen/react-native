import React from "react";
import {Text, View} from "@/components/Themed";
import {StyleSheet, TouchableOpacity, Text as NText} from "react-native";
import {Badge} from "@rneui/themed";
import useTime from "@/libs/useTime";
import {useRouter} from "expo-router";
import {STYLES} from "@/constants/Styles";
import {cardShadowStyles} from "../../../assets/styles/global.styles";

export default function LeadCard({lead}: any) {
  const time = useTime();
  const router = useRouter();

  const handleNavigate = () =>
    router.push({
      pathname: "/leads/[id]",
      params: {
        id: lead.id,
      },
    } as any);

  return (
    <View>
      {lead?.survey_booking?.survey_at && (
        <Text className="font-SEMIBOLD text-xs text-gray-500 ml-2 mb-2">
          {time.formatDate(lead?.survey_booking?.survey_at, "LLLL")}
        </Text>
      )}

      <TouchableOpacity
        className="p-4 bg-light dark:bg-dark rounded-xl mb-3 mx-1"
        style={cardShadowStyles}
        onPress={handleNavigate}
      >
        <View className="flex-row justify-between bg-transparent">
          <Text className="text-base">{lead.first_name}</Text>
          <Badge
            badgeStyle={{
              backgroundColor: lead?.status_details?.lead_status_model?.color,
              paddingHorizontal: 4,
            }}
            textStyle={{
              fontFamily: STYLES.FONTS.REGULAR,
            }}
            value={lead?.status_details?.lead_status_model?.name}
            status="success"
          />
        </View>

        <Text className="text-gray-500">{lead.plain_address}</Text>

        <Text className="text-gray-500">
          {lead.city}, {lead.country}
        </Text>

        <View style={styles.bottomContainer}>
          <Text className="text-gray-500">{lead.post_code}</Text>

          <NText className="text-gray-500 text-xs font-REGULAR_ITALIC">
            {time.diffForHumans(lead.created_at)}
          </NText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
});
