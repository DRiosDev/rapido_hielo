import { Colors } from "@/constants/Colors";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    secondary: Colors.primarySoft,
    error: "#EF4444",
  },
};

export default theme;
