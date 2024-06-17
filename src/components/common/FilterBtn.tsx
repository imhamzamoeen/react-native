import COLORS from "@/constants/Colors";
import {STYLES} from "@/constants/Styles";
import {Button} from "@rneui/themed";
import {View} from "../Themed";
import useLeadStore from "@/stores/useLeadsStore";
import {Filters} from "@/types/Lead";

type Props = {
  title: string | Filters;
  isSelected?: boolean;
};

export default function ({title}: Props) {
  const isSelected = () => {
    const filters = useLeadStore.getState().filters;

    return (
      filters.hasOwnProperty("app_filter_buttons_surveyor") &&
      filters.app_filter_buttons_surveyor === title
    );
  };

  return (
    <View className="flex-1 mx-1">
      <Button
        onPress={() =>
          useLeadStore.setState((state) => ({
            filters: isSelected()
              ? Object.fromEntries(
                  Object.entries(state.filters).filter(
                    ([key]) => key !== "app_filter_buttons_surveyor"
                  )
                )
              : {...state.filters, app_filter_buttons_surveyor: title},
          }))
        }
        title={title as string}
        type="outline"
        titleStyle={{
          fontFamily: STYLES.FONTS.REGULAR,
          fontSize: 12,
          color: isSelected() ? "#fff" : COLORS.default.navbarIcon,
        }}
        loading={false}
        buttonStyle={[
          isSelected() && {
            backgroundColor: COLORS.default.navbarIcon,
          },
          {
            borderColor: COLORS.default.navbarIcon,
            borderWidth: 1,
            borderRadius: 20,
          },
        ]}
      />
    </View>
  );
}
