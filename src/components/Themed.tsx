/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {Text as DefaultText, View as DefaultView} from "react-native";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const {style, className, ...otherProps} = props;

  return (
    <DefaultText
      className="text-dark dark:text-light font-MEDIUM"
      style={style}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const {style, ...otherProps} = props;

  return (
    <DefaultView
      className="bg-white-background dark:bg-dark-background"
      style={style}
      {...otherProps}
    />
  );
}
