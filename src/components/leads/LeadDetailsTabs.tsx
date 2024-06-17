import {useRef, useState} from "react";
import {Tab, TabView, Badge} from "@rneui/themed";
import {ScrollView, useColorScheme} from "react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import COLORS from "@/constants/Colors";
import {View} from "@/components/Themed";
import SurveyTimeCards from "./SurveyTimeCards";
import MoreInformation from "./MoreInformation";
import EpcInformation from "./EpcInformation";
import Chat from "@/components/leads/Chat";
import {Lead} from "@/types/Lead";

type Props = {
  lead: Lead;
};

export default function LeadDetailsTabs({lead}: Props) {
  const epcScrollViewRef: any = useRef(null);
  const colorScheme = useColorScheme();

  const [index, setIndex] = useState(0);

  const preCheckTags = [
    "datamatch_confirmed",
    "epr_report_confirmed",
    "gas_connection_before_april_2022",
    "is_pre_checking_confirmed",
    "land_registry_confirmed",
    "proof_of_address_confirmed",
  ];

  const onAccordionExpand = () => {
    if (epcScrollViewRef.current) {
      setTimeout(() => {
        epcScrollViewRef.current.scrollToEnd({animated: true});
      }, 50);
    }
  };

  return (
    <>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        titleStyle={{color: COLORS[colorScheme ?? "light"].invert}}
        indicatorStyle={{
          backgroundColor: COLORS[colorScheme ?? "light"].navbarIcon,
          width: "33%",
        }}
      >
        <Tab.Item
          title="Details"
          titleStyle={{
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            color: COLORS[colorScheme ?? "light"].invert,
          }}
        />
        <Tab.Item
          title="Epc"
          titleStyle={{
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            color: COLORS[colorScheme ?? "light"].invert,
          }}
        />
        <Tab.Item
          title="Support"
          titleStyle={{
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            color: COLORS[colorScheme ?? "light"].invert,
          }}
        />
      </Tab>

      <TabView
        disableSwipe={true}
        value={index}
        onChange={setIndex}
        animationType="spring"
      >
        <TabView.Item className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <Animated.View
              className="flex-1 px-4"
              entering={FadeInDown.duration(500).springify()}
            >
              {lead?.lead_additional && (
                <ScrollView
                  className="flex-1 flex-row mt-5"
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {Object.entries(lead.lead_additional).map(
                    ([key, value]: any) =>
                      preCheckTags.includes(key) && (
                        <Badge
                          key={key}
                          containerStyle={{
                            paddingVertical: 4,
                            marginRight: 5,
                          }}
                          badgeStyle={{
                            height: 30,
                            paddingHorizontal: 10,
                            borderRadius: 50,
                          }}
                          textStyle={{
                            fontFamily: "Poppins_400Regular",
                            textTransform: "capitalize",
                          }}
                          value={`${value === true ? "✓" : "✗"} ${key
                            .replace("is_", "")
                            .replace("_confirmed", "")
                            .replaceAll("_", " ")}`}
                          status={value == true ? "success" : "error"}
                        />
                      )
                  )}
                </ScrollView>
              )}

              {lead?.survey_booking && lead?.survey_booking?.survey_at && (
                <>
                  <View className="flex-1 justify-start items-start"></View>

                  <View className="flex-1 mt-5">
                    <SurveyTimeCards bookingDetails={lead.survey_booking} />
                  </View>
                </>
              )}

              <View className="flex-1 my-2">
                <MoreInformation lead={lead} />
              </View>
            </Animated.View>
          </ScrollView>
        </TabView.Item>
        <TabView.Item className="flex-1">
          <ScrollView ref={epcScrollViewRef} className="flex-1">
            <Animated.View
              className="flex-1 p-4"
              entering={FadeInDown.duration(500).springify()}
            >
              <EpcInformation
                lead={lead}
                onAccordionExpand={onAccordionExpand}
              />
            </Animated.View>
          </ScrollView>
        </TabView.Item>
        <TabView.Item className="flex-1">
          <Chat lead={lead} />
        </TabView.Item>
      </TabView>
    </>
  );
}
