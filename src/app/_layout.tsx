import { Stack } from "expo-router";
import { View } from "react-native";
import AuthProvider from "../context/AuthProvider";
import ModalProvider from "../context/ModalProvider";
import { AppStatesProvider } from "../context/AppStates";

export default function RootLayout() {
  return (
    <AppStatesProvider>
      <AuthProvider>
        <ModalProvider>
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="intro" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack>
          </View>
        </ModalProvider>
      </AuthProvider>
    </AppStatesProvider>
  );
}
