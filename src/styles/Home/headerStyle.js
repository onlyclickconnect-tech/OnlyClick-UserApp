import { StyleSheet } from "react-native";
import useDimension from "../../hooks/useDimensions";
export default function HeaderStyle() {
  const { screenHeight, screenWidth } = useDimension();
  const styles = StyleSheet.create({
    header: {
      height: screenHeight * 0.25,
      width: screenWidth,
      boxShadow: "0px 2px 6px 1px grey ",
      // display: "flex",
      paddingTop: screenHeight * 0.05,
    },
    locationAndNotification: {
      display: "flex",
      flexDirection: "row",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth,
      justifyContent: "space-between",
      alignContent: "center",
    },
    location: {
      display: "flex",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth * 0.7,
      paddingLeft: 15,
      gap: 5,
    },
    notification: {
      display: "flex",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth * 0.2,
      justifyContent: "center",
      alignContent: "center",
      paddingLeft: 10,
    },

    locationText: {
      display: "flex",
      flexDirection: "row",
      width: "auto",
      alignContent: "center",
      alignItems: "center",
      gap: 5,
      // justifyContent: "center",
      // alignContent: "center",
    },
    searchAndProfile: {
      display: "flex",
      flexDirection: "row",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth,
      justifyContent: "space-between",
      alignContent: "center",
    },
    search: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignContent: "flex-start",
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
      top: "50%",
      transform: [{ translateY: -12 }],
      zIndex: 1,
    },
    profile: {
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      height: screenHeight * 0.25 * 0.33,
      width: screenWidth * 0.2,
      paddingLeft: 20,
    },
  });
  return styles;
}
