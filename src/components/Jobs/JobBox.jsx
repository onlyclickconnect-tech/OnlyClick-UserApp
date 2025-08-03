import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
export default function JobBox({ data, isPending }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.navigate({
          pathname: "protected/Jobs/[bookingId]",
          params: { bookingId: data._id },
        });
      }}
      style={{
        height: 120,
        width: "100%",
        // marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderColor: "#b3b3b3",
      }}
    >
      <View
        style={{ width: "30%", height: "80%", backgroundColor: "grey" }}
      ></View>
      <View
        style={{
          width: "70%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View style={{ justifyContent: "space-around", left: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{data.customerName}</Text>
          <Text style={{ fontWeight: "bold", color: "#3ea2bb" }}>
            {data.serviceName}
          </Text>
          <Text style={{ fontSize: 15, color: "#b3b3b3" }}>{data.address}</Text>
        </View>
        {isPending && (
          <View style={{ justifyContent: "flex-end" }}>
            <Text
              style={{
                backgroundColor: "white",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#3ea2bb",
                color: "#3ea2bb",
              }}
            >
              Enter Otp
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
