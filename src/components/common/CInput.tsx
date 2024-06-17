import {styles as GLOBAL_STYLES} from "../../../assets/styles/global.styles";
import {useState} from "react";
import {TextInputProps, StyleSheet, TextInput} from "react-native";
import {Text} from "@/components/Themed";
import {Ionicons} from "@expo/vector-icons";
import Animated from "react-native-reanimated";

interface Props extends TextInputProps {
  errors?: string[];
  icon?: keyof typeof Ionicons.glyphMap;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function CInput({errors = [], icon, ...rest}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <AnimatedTextInput
        className="bg-black/5 dark:bg-dark p-4 rounded-2xl dark:text-white"
        style={[isFocused && GLOBAL_STYLES.inputFieldFocus]}
        placeholderTextColor={"gray"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize={"none"}
        maxLength={40}
        {...rest}
      />

      {errors.length > 0 &&
        errors.map((e: string) => {
          return (
            <Text className="text-red-600 text-center py-1" key={e}>
              {e}
            </Text>
          );
        })}
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    left: 15,
    zIndex: 1,
  },
});
