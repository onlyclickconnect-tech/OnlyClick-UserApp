import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import SinglePageSwitch from "../../../../../components/common/SinglePageSwitch";
import LeftPage from "../../../../../components/Jobs/LeftPage";
import RightPage from "../../../../../components/Jobs/RightPage";
import useDimension from "../../../../../hooks/useDimensions";
export default function Index() {
  const { screenHeight, screenWidth } = useDimension();
  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        backgroundColor:"white"
      }}
    >
      <SinglePageSwitch
        leftText="Pending"
        rightText="Completed"
        leftElement={<LeftPage />}
        rightElement={<RightPage />}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
