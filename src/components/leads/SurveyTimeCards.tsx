import {TouchableOpacity} from "react-native";
import {Text, View} from "@/components/Themed";
import {cardShadowStyles} from "../../../assets/styles/global.styles";
import ClockTimer from "@/components/leads/ClockTimer";
import useTime from "@/libs/useTime";
import moment from "moment";
import {SurveyBooking} from "@/types/Lead";
import {STYLES} from "@/constants/Styles";

type Props = {
  bookingDetails: SurveyBooking;
};

export default function ({bookingDetails}: Props) {
  const time = useTime();

  const AMPM = time.formatDate(
    bookingDetails?.survey_to ?? bookingDetails.survey_at,
    "A"
  );
  const surveyDate = time.formatDate(bookingDetails.survey_at, "LL");
  const surveyTime = time.formatDate(bookingDetails.survey_at, "hh:mm");
  const surveyTimeTo = time.formatDate(bookingDetails.survey_to, "hh:mm");

  const totalTime = time.getDifferenceInSeconds(
    bookingDetails.created_at,
    bookingDetails.survey_at
  );

  const remainingTime = time.getDifferenceInSeconds(
    moment().format(),
    bookingDetails.survey_at
  );

  return (
    <View className="flex-1 gap-2 flex-row justify-between">
      <TouchableOpacity
        className="flex-[0.6] items-center bg-light dark:bg-dark rounded-xl"
        style={cardShadowStyles}
      >
        <View className="flex-1 flex-row justify-between items-center p-2 dark:bg-dark">
          <View className="bg-white dark:bg-dark">
            <View className="flex-row bg-white dark:bg-dark">
              <Text
                style={{
                  fontFamily: STYLES.FONTS.SEMIBOLD,
                  fontSize: bookingDetails?.survey_to ? 24 : 38,
                }}
              >
                {bookingDetails?.survey_to
                  ? `${surveyTime} - ${surveyTimeTo}`
                  : surveyTime}
              </Text>
              <Text>{AMPM}</Text>
            </View>

            <Text className="text-xs">
              {surveyDate}
              {bookingDetails?.preffered_time &&
                ` (${bookingDetails.preffered_time})`}
            </Text>

            {bookingDetails?.created_by.name && (
              <Text className="text-gray-500 mt-2">{`~ ${bookingDetails.created_by.name}`}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-[0.4] p-4 items-center justify-center bg-light dark:bg-dark rounded-xl"
        style={cardShadowStyles}
      >
        <ClockTimer totalSeconds={totalTime} remainingSeconds={remainingTime} />
      </TouchableOpacity>
    </View>
  );
}
