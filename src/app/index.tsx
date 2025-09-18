import * as NavigationBar from "expo-navigation-bar/src/NavigationBar.android";
import { usePathname, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Text from "../components/ui/Text";
import { useAppStates } from "../context/AppStates";
import { useAuth } from "../context/AuthProvider";

export default function Index() {
  const { isAppOpenedFirstTime, markAppOpened } = useAppStates();
  const { 
    isLoggedIn, 
    isLoading, 
    user, 
    isNewUser,
    isProcessingDeepLink
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const a = useCallback(async () => {
    await NavigationBar.setVisibilityAsync("hidden");
    // await NavigationBar.setBehaviorAsync("inset-swipe"); // This line causes the warning, commented out
  }, []);
  
  useEffect(() => {
    a();
  }, []);

  useEffect(() => {
    // Wait for app states to be loaded, but don't wait for auth loading if we already have auth state
    if (isAppOpenedFirstTime !== null) {
      console.log('App state:', {
        isAppOpenedFirstTime,
        isLoggedIn,
        hasUser: !!user,
        isNewUser,
        currentPath: pathname || 'unknown',
        isLoading,
        isProcessingDeepLink
      });

      // CRITICAL: Don't route anything if deep link authentication is in progress
      if (isProcessingDeepLink) {
        console.log('Deep link processing in progress, waiting...');
        return;
      }

      // Don't redirect if user is already on profile-setup page
      if (pathname === '/(app)/auth/profile-setup') {
        console.log('User is on profile setup page, not redirecting');
        return;
      }

      // PRIORITY 1: Handle authenticated users first (regardless of first-time status or loading state)
      if (isLoggedIn && isNewUser === true) {
        // User is logged in but is new user - needs profile setup
        console.log('Routing to profile setup (new user)');
        // Mark app as opened since user is successfully authenticated
        if (isAppOpenedFirstTime) markAppOpened();
        router.replace("/(app)/auth/profile-setup");
        return;
      } else if (isLoggedIn && !user && !isLoading) {
        // User is logged in but user data not yet loaded and not loading - wait
        console.log('User logged in but user data not loaded yet, waiting...');
        return;
      } else if (isLoggedIn && user && (!user.name || !user.phone)) {
        // User logged in but profile incomplete - go to profile setup
        console.log('Routing to profile setup (profile incomplete)');
        console.log('Missing data - name:', user.name, 'phone:', user.phone);
        // Mark app as opened since user is successfully authenticated
        if (isAppOpenedFirstTime) markAppOpened();
        router.replace("/(app)/auth/profile-setup");
        return;
      } else if (isLoggedIn && user) {
        // User is logged in and has completed profile - go to main app
        console.log('Routing to home (authenticated and profile complete)');
        // Mark app as opened since user is successfully authenticated
        if (isAppOpenedFirstTime) markAppOpened();
        router.replace("/(app)/protected/(tabs)/Home");
        return;
      }

      // PRIORITY 2: Handle non-authenticated users (only if not currently loading auth)
      if (!isLoading) {
        if (isAppOpenedFirstTime) {
          // First time opening app - show onboarding
          console.log('Routing to intro (first time)');
          router.replace("/intro");
        } else if (!isLoggedIn) {
          // User not logged in - go to sign in
          console.log('Routing to sign-in (not logged in)');
          router.replace("/(app)/auth/sign-in");
        }
      } else {
        console.log('Auth is still loading, waiting for completion...');
      }
    } else {
      console.log('Waiting for app state to load:', {
        isAppOpenedFirstTime,
        isLoading,
        hasAppStates: isAppOpenedFirstTime !== null,
        notLoading: !isLoading
      });
    }
  }, [isAppOpenedFirstTime, isLoggedIn, isLoading, user, isNewUser, isProcessingDeepLink, router, pathname, markAppOpened]);

  // Show loading while checking app state
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    }}>
      <ActivityIndicator size="large" color="#3898b3" />
      <Text style={{ marginTop: 20, color: '#666' }}>
        {isLoading ? "Loading OnlyClick..." : "Loading..."}
      </Text>
    </View>
  );
}
