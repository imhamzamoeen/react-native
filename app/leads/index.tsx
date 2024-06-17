import React, {useEffect, useState} from "react";
import {Text, View} from "@/components/Themed";
import {Text as NText, ScrollView} from "react-native";
import LeadCard from "@/components/leads/LeadCard";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import useLeadStore from "@/stores/useLeadsStore";
import useAuthStore from "@/stores/useAuthStore";
import CInput from "@/components/common/CInput";
// @ts-ignore
import {AntDesign} from "@expo/vector-icons";
import COLORS from "@/constants/Colors";
import {useRouter} from "expo-router";
import Animated, {FadeIn} from "react-native-reanimated";
import StatCard from "@/components/leads/StatCard";
import FilterBtn from "@/components/common/FilterBtn";
import useFilters from "@/hooks/useFilters";

export default function LeadsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();

  const {leads, isFetching, fetchLeads, meta} = useLeadStore();
  const {user, stats} = useAuthStore();

  // setting up
  useFilters(fetchLeads);

  useEffect(() => {
    (async () => {
      await fetchLeads();
    })();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeads();
    setIsRefreshing(false);
  };

  const renderFooter = () => {
    return (
      <>
        {leads.length > 0 ? (
          <View className="p-4 items-center">
            <Text className="text-gray-500 font-REGULAR_ITALIC">
              Showing {meta.to}/{meta.total}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  const onCalendarPress = () => {
    router.navigate("/leads/calendar");
  };

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <View className="flex-1">
        {user?.first_name ? (
          <Animated.View
            entering={FadeIn.duration(500)}
            className="flex-row justify-between px-5 my-3"
          >
            <Text className="text-start text-4xl font-bold">
              {`Hi, ${user.first_name} 👋`}
            </Text>

            <AntDesign
              onPress={onCalendarPress}
              name="calendar"
              size={26}
              color={COLORS.default.navbarIcon}
            />
          </Animated.View>
        ) : (
          <></>
        )}

        <View className="flex-[0.5] gap-4">
          <View className="flex-1 flex-row px-5" style={{gap: 10}}>
            <StatCard title="Total Leads" model={stats.total_leads} />
          </View>

          <View className="flex-1 flex-row px-5" style={{gap: 10}}>
            <StatCard title="DM Required" model={stats.dms_required} />
            <StatCard title="DM Sent" model={stats.dms_sent} />
          </View>

          <View className="flex-1 flex-row px-5" style={{gap: 10}}>
            <StatCard title="Surv. Booked" model={stats.surveys_booked} />
            <StatCard title="Ins. Booked" model={stats.installs_booked} />
          </View>
        </View>

        <View className="flex-row gap-2 items-center py-4 px-5">
          <View className="flex-[0.9]">
            <CInput
              onChangeText={(value) =>
                useLeadStore.setState((state) => ({
                  filters: {
                    ...state.filters,
                    post_code: value,
                  },
                }))
              }
              placeholder="Postcode"
              icon="search"
            />
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex-1"
          >
            <FilterBtn title="Today" />
            <FilterBtn title="Weekly" />
            <FilterBtn title="Monthly" />
          </ScrollView>
        </View>

        {isFetching && !isRefreshing ? (
          <ActivityIndicator className="flex-1" />
        ) : (
          <View className="flex-1 w-full justify-center px-4">
            {leads.length > 0 ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                  />
                }
                data={leads}
                keyExtractor={(item: any) => `lead-${item.id}-${Math.random()}`}
                renderItem={({item}) => <LeadCard lead={item} />}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                contentContainerStyle={{paddingBottom: 10}}
              />
            ) : (
              <NText className="text-center font-MEDIUM_ITALIC text-gray-500">
                No leads available.
              </NText>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
