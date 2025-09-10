import { View } from "react-native";
import Text from "../components/ui/Text"
import { useRouter } from "expo-router";
import * as NavigationBar from "expo-navigation-bar/src/NavigationBar.android";
import { useCallback, useEffect } from "react";
import { useAppStates } from "../context/AppStates";

export default function Index() {
  const { isAppOpenedFirstTime, isProfileCompleted } = useAppStates();
  const router = useRouter();
  
  const a = useCallback(async () => {
    await NavigationBar.setVisibilityAsync("hidden");
    // await NavigationBar.setBehaviorAsync("inset-swipe"); // This line causes the warning, commented out
  }, []);
  
  useEffect(() => {
    a();
  }, []);

  useEffect(() => {
    if (isAppOpenedFirstTime !== null && isProfileCompleted !== null) {
      if (isAppOpenedFirstTime) {
        // First time opening app - show onboarding
        router.replace("/intro");
      } else if (!isProfileCompleted) {
        // User has used app before but hasn't completed profile - go to signup success which will handle profile setup
        router.replace("/(app)/auth/signup-success");
      } else {
        // User has completed profile - go to main app
        router.replace("/(app)/protected/(tabs)/Home");
      }
    }
  }, [isAppOpenedFirstTime, isProfileCompleted, router]);

  // Show loading while checking app state
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}
