import { StyleSheet, View } from "react-native";
import SinglePageSwitch from "../../../components/common/SinglePageSwitch";
import JobAlert from "../../../components/Notification/JobAlert";
import PlatformUpdates from "../../../components/Notification/PlatformUpdate";
export default function Notifications() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SinglePageSwitch
        leftText={"Booking Updates"}
        rightText={"App Updates"}
        leftElement={<JobAlert />}
        rightElement={<PlatformUpdates />}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
