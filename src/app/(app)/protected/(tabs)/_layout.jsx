import { Tabs } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
export default function RootLayout() {
  const router = useRouter();
  return (
    <Tabs
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#3898b3",
        tabBarLabelStyle: {
          top: 12,
          color: "#a0a0a0",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabelStyle: { top: 12 },
          tabBarStyle: {
            height: 90,
            paddingTop: 15,
          },
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 25,
                  backgroundColor: focused ? "#e6f5f8" : "",
                }}
              >
                <AntDesign
                  name="home"
                  size={30}
                  color={focused ? "#3898b3" : "#a0a0a0"}
                />
              </View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="Jobs"
        options={{
          headerShown: false,
          tabBarLabelStyle: { top: 12 },
          tabBarStyle: { display: "none" },
          animation: "shift",
          tabBarIcon: ({ focused }) => {
            return (
              !focused && (
                <View
                  style={{
                    height: 50,
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25,
                    backgroundColor: focused ? "#e6f5f8" : "",
                  }}
                >
                  <FontAwesome
                    name="briefcase"
                    size={30}
                    color={focused ? "#3898b3" : "#a0a0a0"}
                  />
                </View>
              )
            );
          },
        }}
      />
      <Tabs.Screen
        name="Earnings"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabelStyle: { top: 12 },
          tabBarStyle: {
            height: 90,
            paddingTop: 15,
          },
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 25,
                  backgroundColor: focused ? "#e6f5f8" : "",
                }}
              >
                <FontAwesome6
                  name="sack-dollar"
                  size={30}
                  color={focused ? "#3898b3" : "#a0a0a0"}
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="Training"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabelStyle: { top: 12 },
          tabBarStyle: {
            height: 90,
            paddingTop: 15,
          },
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 25,
                  backgroundColor: focused ? "#e6f5f8" : "",
                }}
              >
                <FontAwesome6
                  name="person-chalkboard"
                  size={30}
                  color={focused ? "#3898b3" : "#a0a0a0"}
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabelStyle: { top: 12 },
          tabBarStyle: {
            height: 90,
            paddingTop: 15,
          },
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 25,
                  backgroundColor: focused ? "#e6f5f8" : "",
                }}
              >
                <Ionicons
                  name="person-sharp"
                  size={30}
                  color={focused ? "#3898b3" : "#a0a0a0"}
                />
              </View>
            );
          },
        }}
      />

      {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
    </Tabs>
  );
}
