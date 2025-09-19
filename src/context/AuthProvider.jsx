
import * as Linking from "expo-linking";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getAddress,
  getEmail,
  getFullName,
  getPhone,
  getProfileImage,
} from "../data/getdata/getProfile";
import supabase from "../data/supabaseClient";
import { useAppStates } from "./AppStates";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const { markAppOpened } = useAppStates();
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(null);
  const [error, setError] = useState("");
  const [isProcessingDeepLink, setIsProcessingDeepLink] = useState(false);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log('Initializing authentication...');

      // Check for existing Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Supabase session check:', session ? 'Session found' : 'No session');

      if (session?.user && !error) {
        console.log('Valid Supabase session found');
        await processUserSession(session);

        // Only mark app as opened for existing sessions, not deep link auth
        // This will be handled by the routing logic instead
      } else {
        console.log('No authenticated session found');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await clearAuthState();
    } finally {
      setIsLoading(false);
      console.log('Auth initialization complete');
    }
  };

  // Process user session and populate user data
  const processUserSession = async (session) => {
    try {
      const currentUser = session.user;
      const userId = currentUser.id;

      const fullName = await getFullName(userId);
      const avatar = await getProfileImage(userId);
      const email = await getEmail(userId);
      const phone = await getPhone(userId);
      const address = await getAddress(userId);

      const userData = {
        name: fullName || "",
        address: address,
        phone: phone,
        email: email || "",
        _id: userId,
        taskMasterId: "",
        service: "",
        profileImage: avatar,
        reviews: 0,
        ratings: 0,
        authToken: {
          token: session.access_token,
          expiryDate: "",
        },
        refreshToken: {
          token: session.refresh_token,
          expiryDate: "",
        },
      };

      // Set all authentication state together
      setUser(userData);
      setAuthToken(session.access_token || "");
      setIsLoggedIn(true);

      console.log('User session processed successfully - isLoggedIn state updated to true');
      console.log('User data:', {
        hasName: !!userData.name,
        hasPhone: !!userData.phone,
        userId: userData._id
      });
    } catch (error) {
      console.error('Error processing user session:', error);
      throw error;
    }
  };

  // Handle deep links
  const handleDeepLink = async (url) => {
    try {
      if (!url) return;

      console.log('Handling deep link:', url);

      // Check if this is an auth deep link
      if (url.startsWith("onlyclick://") && (url.includes('access_token') || url.includes('refresh_token'))) {
        // Set loading to true and mark deep link processing to prevent premature routing
        setIsLoading(true);
        setIsProcessingDeepLink(true);
        console.log('Processing onlyclick deep link:', url);

        // Extract tokens from URL
        const accessTokenMatch = url.match(/access_token=([^&]+)/);
        const refreshTokenMatch = url.match(/refresh_token=([^&]+)/);

        if (accessTokenMatch && refreshTokenMatch) {
          const accessToken = accessTokenMatch[1];
          const refreshToken = refreshTokenMatch[1];

          console.log("Extracted tokens, calling backend callback...");

          // Call backend callback first to get isNewUser
          try {
            const api = (await import("../app/api/api.js")).default;
            const callbackResponse = await api.post("/api/v1/callback", {
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            const backendIsNewUser = callbackResponse.data.data.isNewUser;
            setIsNewUser(backendIsNewUser);
            console.log("Backend callback successful, isNewUser:", backendIsNewUser);
          } catch (callbackError) {
            console.error("Backend callback error:", callbackError);
            setIsNewUser(false); // Default to existing user if backend fails
          }

          // Set Supabase session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Auth error:', error);
            setError(error.message);
            setIsLoading(false);
            return;
          }

          if (data.session) {
            console.log('Session set successfully via deep link');
            await processUserSession(data.session);
            console.log('Deep link authentication complete, user data processed');
          } else {
            console.log('No session data received from setSession');
          }
        } else {
          console.log("No tokens found in URL");
        }

        console.log('Deep link processing complete, setting loading to false');
        setIsLoading(false);
        setIsProcessingDeepLink(false);
      } else {
        console.log('URL does not contain authentication tokens');
      }
    } catch (error) {
      console.error('Deep link handling error:', error);
      setError(error.message);
      setIsLoading(false);
      setIsProcessingDeepLink(false);
    }
  };

  // Clear authentication state
  const clearAuthState = async () => {
    setUser(null);
    setIsLoggedIn(false);
    setAuthToken("");
    setIsNewUser(null);
    setError("");
  };


  // Function to refresh user details
  const refreshUserDetails = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      await processUserSession(session);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Set error
  const setErrorState = (errorMessage) => {
    setError(errorMessage);
  };

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Set up deep link handler for when app is already open
    const subscription = Linking.addEventListener('url', (event) => {
      const url = event.url;
      console.log('Deep link received while app is open:', url);

      // Force immediate processing of the deep link
      if (url) {
        // Use setTimeout to ensure this runs after the current execution context
        setTimeout(() => {
          handleDeepLink(url);
        }, 0);
      }
    });

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('App opened via deep link:', url);
        handleDeepLink(url);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn,
      setIsLoggedIn,
      authToken,
      setAuthToken,
      refreshUserDetails,
      isLoading,
      isNewUser,
      setIsNewUser,
      error,
      setError: setErrorState,
      updateUser,
      isProcessingDeepLink,
    }),
    [user, isLoggedIn, authToken, isLoading, isNewUser, error, isProcessingDeepLink]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
