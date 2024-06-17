import {Link} from "expo-router";
import SinglePoint from "@/components/common/SinglePoint";
import {Text, View} from "@/components/Themed";
import Accordion from "@/components/leads/Accordion";
import {MaterialCommunityIcons} from "@expo/vector-icons";

type Props = {
  lead: {[key: string]: any};
  onAccordionExpand: any;
};

const keysToIgnore = ["type_of_assessment"];

export default function ({lead, onAccordionExpand}: Props) {
  return lead?.epc_details ? (
    Object.entries(lead.epc_details)
      .sort(([keyA, valueA], [keyB, valueB]) => {
        if (typeof valueA === "string" && typeof valueB !== "string") {
          return -1;
        } else if (typeof valueA !== "string" && typeof valueB === "string") {
          return 1;
        } else {
          return keyA.localeCompare(keyB);
        }
      })
      .map(([key, value]: any) =>
        typeof value === "string"
          ? !keysToIgnore.includes(key) && (
              <SinglePoint key={key} label={key} point={value} />
            )
          : Array.isArray(value) && (
              <Accordion
                key={key}
                title={key}
                items={value}
                onExpand={onAccordionExpand}
              />
            )
      )
  ) : (
    <View className="flex-1 items-center">
      <Text className="text-gray-500 font-REGULAR">
        No EPC information available 😞
      </Text>

      <Link
        className="text-blue-500 mt-2 underline"
        href={`https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${lead.post_code}`}
      >
        UK GOV site&nbsp;
        <MaterialCommunityIcons name="open-in-new" size={16} />
      </Link>
    </View>
  );
}
