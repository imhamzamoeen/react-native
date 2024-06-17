import {Button} from "@rneui/base";
import COLORS from "@/constants/Colors";
import {STYLES} from "@/constants/Styles";
import {TextInputProps} from "react-native";
import {View} from "../Themed";

interface Props extends TextInputProps {
  title?: string;
  isFetching?: boolean;
  handlePress?: any;
  children?: any;
}

export default function ({
  title,
  isFetching,
  handlePress,
  children,
  ...rest
}: Props) {
  return (
    <View {...rest}>
      {children ?? (
        <Button
          title={title ?? "Login"}
          raised
          loading={isFetching}
          loadingProps={{
            size: "small",
            color: "#fff",
          }}
          titleStyle={{fontFamily: STYLES.FONTS.REGULAR, paddingHorizontal: 50}}
          containerStyle={{
            borderRadius: 12,
          }}
          buttonStyle={{
            backgroundColor: COLORS.default.primary,
            borderRadius: 12,
          }}
          onPress={handlePress}
        />
      )}
    </View>
  );
}
