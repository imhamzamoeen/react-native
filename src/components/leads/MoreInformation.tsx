import useTime from "@/libs/useTime";
import SinglePoint from "@/components/common/SinglePoint";
import {View} from "@/components/Themed";

type Props = {
  lead: {[key: string]: any};
};

export default function ({lead}: Props) {
  const time = useTime();

  const points = {
    address: lead.address,
    datamatch:
      lead?.lead_customer_additional_detail?.datamatch_progress ?? "Not found",
    lead_generator: lead?.lead_generator?.name,
    _booking_comments: lead?.survey_booking?.comments,
    __name: `${lead.title}. ${lead.full_name}`,
    dob: time.formatDate(lead.dob, "LL"),
    benefits:
      lead.benefits.length > 0
        ? lead.benefits.map((b: any) => b.name).join("\n")
        : "No benefits",
  };

  return (
    <View className="flex-1">
      {Object.entries(points)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(
          ([key, value]: any) =>
            typeof value === "string" && (
              <SinglePoint key={key} label={key} point={value} />
            )
        )}
    </View>
  );
}
