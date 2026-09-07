import { showMessage, MessageOptions } from "react-native-flash-message";

const typeColors: Record<string, string> = {
  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  info: "#3B82F6",
  default: "#1E293B",
};

export const showToast = (options: MessageOptions) => {
  const bg = options.backgroundColor || typeColors[options.type || "default"] || typeColors.default;
  showMessage({
    ...options,
    backgroundColor: bg,
    color: "#FFFFFF",
    titleStyle: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
    textStyle: { color: "#FFFFFF", fontSize: 13 },
    style: { borderRadius: 12, elevation: 6 },
  });
};
