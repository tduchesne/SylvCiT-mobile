/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#232825";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    buttonText: "#fff",
    buttonBackground: "#046122",
    background: "#fff",
    mainBackground: "#aae9b7",
    tint: "#176934",
    inactive: "#95ae9a",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#d2d3d2",
    buttonText: "#11181C",
    buttonBackground: "#7bb586",
    background: "#232825",
    mainBackground: "#65976f",
    tint: tintColorDark,
    inactive: "#95ae9a",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
