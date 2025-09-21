import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <TabNavigator router={router} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabNavigator({ router }) {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
          letterSpacing: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 1,
          margin: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarButton: (props) => (
          <TouchableOpacity {...props} activeOpacity={0.8} />
        ),
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 4,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.05)",
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 2,
          backgroundColor: Platform.OS === 'ios' ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 1)",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backdropFilter: Platform.OS === 'ios' ? "blur(20px)" : undefined,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 32,
                width: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="home"
                size={24}
                color={focused ? "#000" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Services"
        options={{
          headerShown: false,
          tabBarLabel: "Services",
          animation: "shift",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 32,
                width: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="grid-outline"
                size={24}
                color={focused ? "#000" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Post"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabel: "Post",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 54,
                width: 54,
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: 8,
                borderRadius: 42,
                backgroundColor: "#3898b3",
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                marginBottom: 12,
                borderWidth: 2,
                borderColor: "#fff",
                marginTop: -10,
              }}
            >
              <AntDesign
                name="plus"
                size={36}
                color="#ffffff"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Bookings"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabel: "Bookings",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 32,
                width: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="calendar-check-o"
                size={24}
                color={focused ? "#000" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          headerShown: false,
          animation: "shift",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 32,
                width: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="person-sharp"
                size={24}
                color={focused ? "#000" : "#8E8E93"}
              />
            </View>
          ),
        }}
      />

      {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
    </Tabs>
  );
}