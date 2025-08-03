import { Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeLayout() {
  const router = useRouter();

  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Jobs",

          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ left: 10, marginRight: 50 }}
              >
                <Ionicons name="arrow-back" size={25} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen
        name="[bookingId]"
        options={{
          headerTitle: "Service Name",
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ left: 10, marginRight: 50 }}
              >
                <Ionicons name="arrow-back" size={25} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
     
    </Stack>
  );
}
