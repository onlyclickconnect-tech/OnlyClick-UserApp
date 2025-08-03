import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Data() {
  const data = [
    {
      number: 720,
      text: "Jobs Finished",
      bgColor: "#3ea2bb",
      textColor: "white",
    },
    {
      number: 723,
      text: "Total Requests",
      bgColor: "#ffecb1",
      textColor: "#3698b3",
    },
    {
      number: 722,
      text: "Total Assigned",
      bgColor: "#d6f4f9",
      textColor: "blue",
    },
  ];
  const styles = StyleSheet.create({
    container: {
      top: 15,
      height: "100%",
      width: "100%",
      paddingHorizontal: 20,
    },
  });
  return (
    <View style={styles.container}>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#4ab9cf",
          paddingVertical: 15,
          borderRadius: 15,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 600, color: "white" }}>
          Total Earnings
        </Text>
        <Text
          style={{
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            fontWeight: 500,
          }}
        >
          Rs. 22,789
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          top: 30,
          justifyContent: "space-around",
          gap: 10,
        }}
      >
        {data.map((item, index) => {
          return (
            <View key={index} style={{ alignItems: "center" }}>
              <View
                style={{
                  height: 80,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 40,
                  backgroundColor: item.bgColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: item.textColor,
                  }}
                >
                  {item.number}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  top: 10,
                  textAlign: "center",
                }}
              >
                {item.text}
              </Text>
            </View>
          );
        })}
      </View> */}
    </View>
  );
}
