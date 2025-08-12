import { StyleSheet } from "react-native";
import useDimension from "../../hooks/useDimensions";

export default function HeaderStyle() {
  const { screenHeight, screenWidth } = useDimension();

  const styles = StyleSheet.create({
    header: {
      height: screenHeight * 0.25,
      width: screenWidth,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
      paddingTop: screenHeight * 0.05,
      backgroundColor: "white",
    },
    locationAndNotification: {
      flexDirection: "row",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth,
      justifyContent: "space-between",
      alignItems: "center",
    },
    location: {
      flexDirection: "column",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth * 0.7,
      paddingLeft: 15,
    },
    notification: {
      justifyContent: "center",
      alignItems: "center",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth * 0.2,
      paddingLeft: 10,
    },
    locationText: {
      flexDirection: "row",
      alignItems: "center",
    },
    searchAndProfile: {
      flexDirection: "row",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth,
      justifyContent: "space-between",
      alignItems: "center",
    },
    search: {
      position: "relative",
      justifyContent: "center",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth * 0.8,
      paddingLeft: 10,
    },
    searchText: {
      backgroundColor: "white",
      borderRadius: 8,
      height: screenHeight * 0.25 * 0.2,
      paddingLeft: 50,
      fontSize: 18,
    },
    searchIcon: {
      position: "absolute",
      left: 35,
      top: screenHeight * 0.25 * 0.33 * 0.5 - 12,
      zIndex: 1,
    },
    profile: {
      justifyContent: "center",
      alignItems: "center",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth * 0.2,
      paddingLeft: 20,
    },
  });

  return styles;
}
