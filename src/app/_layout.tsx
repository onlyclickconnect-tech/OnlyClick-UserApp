import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from "react-native";
import Toast from 'react-native-toast-message';
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
            <Toast
              position="bottom"
              bottomOffset={20}
              config={{
                success: (props) => (
                  <View style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: 10,
                    padding: 12,
                    marginHorizontal: 16,
                    marginBottom: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: '#00D4AA',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 6,
                    borderWidth: 1,
                    borderColor: '#333',
                    minWidth: 280,
                    maxWidth: 320,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: '#00D4AA',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          color: '#FFFFFF',
                          fontSize: 14,
                          fontWeight: '600',
                          marginBottom: 1,
                          fontFamily: 'Poppins_600SemiBold'
                        }}>
                          {props.text1}
                        </Text>
                        <Text style={{
                          color: '#E0E0E0',
                          fontSize: 12,
                          fontFamily: 'Poppins_400Regular'
                        }}>
                          Added to cart successfully
                        </Text>
                      </View>
                    </View>
                  </View>
                ),
                error: (props) => (
                  <View style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: 10,
                    padding: 12,
                    marginHorizontal: 16,
                    marginBottom: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: '#FF6B6B',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 6,
                    borderWidth: 1,
                    borderColor: '#333',
                    minWidth: 280,
                    maxWidth: 320,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: '#FF6B6B',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                        <Ionicons name="close" size={14} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          color: '#FFFFFF',
                          fontSize: 14,
                          fontWeight: '600',
                          marginBottom: 1,
                          fontFamily: 'Poppins_600SemiBold'
                        }}>
                          {props.text1}
                        </Text>
                        <Text style={{
                          color: '#E0E0E0',
                          fontSize: 12,
                          fontFamily: 'Poppins_400Regular'
                        }}>
                          {props.text2}
                        </Text>
                      </View>
                    </View>
                  </View>
                ),
              }}
            />
          </View>
        </ModalProvider>
      </AuthProvider>
    </AppStatesProvider>
  );
}
