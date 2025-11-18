import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    maxHeight: 205,
    overflow: "hidden",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.text,
  },

  emptyText: {
    color: "#888",
    fontStyle: "italic",
  },

  pbRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  iconContainer: {
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  metric: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },

  measurement: {
    width: 80,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },

  date: {
    width: 90,
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
});
