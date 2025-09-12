import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";


export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // This page will handle the auth callback
    // The deep link processing in _layout.tsx will handle the actual authentication
    console.log("Auth callback page loaded");

    // Navigate to home after a brief moment
    setTimeout(() => {
      // this line is taking to home
      router.replace("/auth/profile-setup");
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Authenticating...</Text>
    </View>
  );
}
