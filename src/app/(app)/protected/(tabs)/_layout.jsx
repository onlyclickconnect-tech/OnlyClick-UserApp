import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { Platform, View, TouchableOpacity } from "react-native";
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
        tabBarItemStyle: {
          paddingVertical: 0,
          margin: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarButton: (props) => (
          <TouchableOpacity {...props} activeOpacity={0.4} />
        ),
        tabBarStyle: {
          height: 90,
          paddingTop: 15,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 1,
          shadowRadius: 10,
          backgroundColor: Platform.OS === 'ios' ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.99)",
          position: "absolute",
          borderTopColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabelStyle: { top: 12 },
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: focused ? "#e6f5f8" : "transparent",
                }}
              >
                <AntDesign
                  name="home"
                  size={focused ? 28 : 24}
                  color={focused ? "#3898b3" : "#a0a0a0"}
                />
              </View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="Services"
        options={{
          headerShown: false,
          tabBarLabelStyle: { top: 12 },
          animation: "shift",
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: focused ? "#e6f5f8" : "transparent",
                }}
              >
                <Ionicons
                  name="grid-outline"
                  size={focused ? 28 : 24}
                  color={focused ? "#3898b3" : "#a0a0a0"}
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="Post"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabelStyle: { top: 12 },
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 70,
                  width: 70,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 35,
                  backgroundColor: focused ? "#3898b3" : "#3898b3",
                  elevation: 8,
                  shadowColor: "#3898b3",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  marginBottom: 35,
                  borderWidth: 3,
                  borderColor: "#fff",
                  marginTop: -10,
                }}
              >
                <AntDesign
                  name="plus"
                  size={35}
                  color="#ffffff"
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="Bookings"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabelStyle: { top: 12 },
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: focused ? "#e6f5f8" : "transparent",
                }}
              >
                <FontAwesome
                  name="calendar-check-o"
                  size={focused ? 28 : 24}
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
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: focused ? "#e6f5f8" : "transparent",
                }}
              >
                <Ionicons
                  name="person-sharp"
                  size={focused ? 28 : 24}
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