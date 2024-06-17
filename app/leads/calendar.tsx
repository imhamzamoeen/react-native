import {Text} from "@/components/Themed";
import useTime from "@/libs/useTime";
import useCalendarStore from "@/stores/useCalendarStore";
import {useNavigation, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import {Agenda} from "react-native-calendars";

const AgendaScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const time = useTime();

  const [items, setItems]: any = useState({});
  const {events, index} = useCalendarStore();

  useEffect(() => {
    const formattedItems: any = [];

    formattedItems[new Date().toDateString()] = {};

    events.map((e: any) => {
      const strTime = e.end_date_date_formatted;

      if (!items[strTime]) {
        formattedItems[strTime] = [];

        formattedItems[strTime].push(e);
      }
    });

    setItems((prevItems: any) => ({...prevItems, ...formattedItems}));
  }, [events]);

  useEffect(() => {
    index();
  }, []);

  const handleItemClick = (leadId: any) => {
    if (leadId) {
      navigation.goBack();

      router.navigate({
        pathname: "/leads/[id]",
        params: {
          id: leadId,
        },
      } as any);
    }
  };

  const renderItem = (reservation: any, isFirst: boolean) => {
    const startTime = time.formatDate(reservation.start_date, "LT");
    const endTime = time.formatDate(reservation.end_date, "LT");

    return (
      <TouchableOpacity
        style={[styles.item, {height: "100%"}]}
        onPress={() => handleItemClick(reservation?.eventable?.lead?.id)}
      >
        <View className="flex-1">
          <Text className="text-xs text-black">{`${startTime} - ${endTime}`}</Text>
          {reservation?.eventable?.lead ? (
            <>
              <Text className="text-base text-black font-MEDIUM">
                {reservation.eventable.lead.plain_address}
              </Text>
              <Text className="text-base text-black font-MEDIUM">
                {reservation.eventable.lead.post_code}
              </Text>
            </>
          ) : (
            <Text className="text-lg text-black font-MEDIUM">
              {reservation?.description ?? "No description."}
            </Text>
          )}

          {reservation?.eventable?.comments && (
            <Text className="text-sm text-gray-500 font-MEDIUM_ITALIC">
              {reservation?.eventable?.comments}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xs text-black font-REGULAR_ITALIC">
          No surveys 🙌
        </Text>
      </View>
    );
  };

  return (
    <Agenda
      items={items}
      selected={new Date().toISOString()}
      renderItem={renderItem}
      renderEmptyData={renderEmptyDate}
      pastScrollRange={6}
      futureScrollRange={6}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});

export default AgendaScreen;
