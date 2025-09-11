import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import CustomServiceModal from "../../../components/common/CustomServiceModal";
import EnterAmountModal from "../../../components/common/EnterAmountModal";
import LoadingScreen from "../../../components/common/LoadingScreen";
import PressableScale from "../../../components/common/PressableScale";
import SuccessModal from "../../../components/common/SuccessModal";
import { useAuth } from "../../../context/AuthProvider";

export default function RootLayout() {
  const router = useRouter();
  const { isLoggedIn, authToken } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !authToken) {
      router.replace("/(app)/auth/sign-in");
    }
  }, [isLoggedIn, authToken]);

  if (!isLoggedIn || !authToken) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Notification" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="[customJob]"
          options={{
            headerTitle: "Custom Job",
            headerLeft: () => {
              return (
                <PressableScale
                  onPress={() => {
                    router.back("");
                  }}
                  style={{ left: 10, marginRight: 50 }}
                >
                  <Ionicons name="arrow-back" size={25} color="black" />
                </PressableScale>
              );
            },
          }}
        />
      </Stack>
      <CustomServiceModal />
      <EnterAmountModal />
      <SuccessModal />
    </View>
  );
}
