import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { AppStatesProvider } from "../context/AppStates";
import AuthProvider from "../context/AuthProvider";
import ModalProvider from "../context/ModalProvider";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Create a custom Text component to apply the default font family
  const AppText = (props: React.ComponentProps<typeof Text>) => (
    <Text {...props} style={[{ fontFamily: 'Poppins_400Regular' }, props.style]} />
  );
  // For TextInput, wrap it in a custom component if you want to apply default styles
  // Example:
  // const CustomTextInput = (props) => <TextInput style={[{ fontFamily: 'Poppins_400Regular' }, props.style]} {...props} />;

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
