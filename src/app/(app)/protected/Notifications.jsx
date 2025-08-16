import { Dimensions, StyleSheet, View } from "react-native";
import SinglePageSwitch from "../../../components/common/SinglePageSwitch";
import JobAlert from "../../../components/Notification/JobAlert";
import PlatformUpdates from "../../../components/Notification/PlatformUpdate";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
export default function Notifications() {
  return (
    <View style={styles.container}>
      <SinglePageSwitch
        leftText={"Booking Updates"}
        rightText={"App Updates"}
        leftElement={<JobAlert />}
        rightElement={<PlatformUpdates />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: screenWidth * 0.05, // 5% padding for responsiveness
    paddingVertical: screenHeight * 0.02, // 2% padding for responsiveness
  },
});
