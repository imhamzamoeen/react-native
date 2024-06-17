import {ListItem} from "@rneui/themed";
import {useState} from "react";
import {cardShadowStyles} from "../../../assets/styles/global.styles";
import {Text, View} from "@/components/Themed";
import COLORS from "@/constants/Colors";
import {useColorScheme} from "react-native";

type Props = {
  title: string;
  items: string[] | object[];
  onExpand: any;
};

export default function ({title, items, onExpand}: Props) {
  const colorScheme = useColorScheme();

  const [expanded, setExpanded] = useState<boolean>(false);

  const isArrayOfTypeString = (arr: any) => {
    return arr.every((item: any) => typeof item === "string");
  };

  const handleOpen = () => {
    setExpanded(!expanded);
    onExpand();
  };

  return (
    <>
      <ListItem.Accordion
        containerStyle={{
          marginTop: 12,
          backgroundColor: COLORS[colorScheme ?? "light"].color,
          borderRadius: 8,
        }}
        style={{...cardShadowStyles}}
        content={
          <ListItem.Content>
            <ListItem.Title className="bg-light dark:bg-dark text-base font-MEDIUM text-dark dark:text-white capitalize">
              {title}
            </ListItem.Title>
            <ListItem.Subtitle className="bg-light dark:bg-dark text-xs font-MEDIUM text-gray-400 dark:text-white capitalize">
              Tap to expand
            </ListItem.Subtitle>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={handleOpen}
      >
        {isArrayOfTypeString(items) ? (
          items.map((v: any, index) => {
            return (
              <ListItem
                containerStyle={{borderRadius: 8}}
                style={{...cardShadowStyles, marginTop: 10}}
                key={index}
              >
                <ListItem.Content>
                  <ListItem.Title className="bg-light dark:bg-dark text-base font-REGULAR text-dark dark:text-white capitalize">
                    {v}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            );
          })
        ) : (
          <ListItem
            containerStyle={{borderRadius: 8}}
            style={{...cardShadowStyles, marginTop: 10}}
          >
            <ListItem.Content>
              <View style={{flexDirection: "row"}}>
                {Object.keys(items[0]).map((key, index) => (
                  <Text
                    key={index}
                    style={{
                      flex: 1,
                      fontSize: 18,
                      textTransform: "uppercase",
                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    {key}
                  </Text>
                ))}
              </View>

              <View className="mt-5">
                {items.map((obj, index) => (
                  <View className="flex-row" key={index}>
                    {Object.values(obj).map((value, key) => (
                      <Text className="w-[33.4%] font-REGULAR" key={key}>
                        {value}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            </ListItem.Content>
          </ListItem>
        )}
      </ListItem.Accordion>
    </>
  );
}
