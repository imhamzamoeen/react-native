import {Platform, StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputFieldFocus: {
    borderColor: "#007bff",
  },
});

export const shadowStyle = Platform.select({
  ios: {
    shadowColor: "rgba(76, 78, 100, 0.1)",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
  },
  android: {
    elevation: 2,
  },
});

export const cardShadowStyles = {
  shadowColor: "#000",
  shadowRadius: 3,
  shadowOffset: {width: 0, height: 3},
  shadowOpacity: 0.1,
  elevation: 0,
};
