import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from "react-native";
import Text from "../components/ui/Text";
import { AppStatesProvider } from "../context/AppStates";
import AuthProvider from "../context/AuthProvider";
import ModalProvider from "../context/ModalProvider";

import * as Linking from "expo-linking";


export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log("Deep link received:", url);

      // Handle auth callback URLs
      if (
        url.includes("/auth/callback") ||
        url.includes("access_token") ||
        url.includes("refresh_token")
      ) {
        console.log("Processing magic link:", url);

        try {
          // Import supabase
          const supabase = (await import("../data/supabaseClient")).default;

          // Extract tokens from URL
          const accessTokenMatch = url.match(/access_token=([^&]+)/);
          const refreshTokenMatch = url.match(/refresh_token=([^&]+)/);

          if (accessTokenMatch && refreshTokenMatch) {
            const accessToken = accessTokenMatch[1];
            const refreshToken = refreshTokenMatch[1];

            console.log("Setting session with tokens");

            // Manually set the session
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error("Auth error:", error);
            } else if (data.session) {
              console.log("Session set successfully");
              router.replace("/(app)/protected/(tabs)/Home");
            }
          }
        } catch (err) {
          console.error("Deep link processing error:", err);
        }
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, []);







  if (!fontsLoaded) {
    return null;
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
