
import * as Linking from "expo-linking";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import OfflinePage from "../components/common/OfflinePage";
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
  const [isConnected, setIsConnected] = useState(true);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
     

      // Check for existing Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
     

      if (session?.user && !error) {
       
        await processUserSession(session);

        // Only mark app as opened for existing sessions, not deep link auth
        // This will be handled by the routing logic instead
      } else {
       
        setIsLoggedIn(false);
      }
    } catch (error) {
     
      await clearAuthState();
    } finally {
      setIsLoading(false);
    
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

   
    } catch (error) {
     
      throw error;
    }
  };

  // Handle deep links
  const handleDeepLink = async (url) => {
    try {
      if (!url) return;

    

      // Check if this is an auth deep link
      if (url.startsWith("onlyclick://") && (url.includes('access_token') || url.includes('refresh_token'))) {
        // Set loading to true and mark deep link processing to prevent premature routing
        setIsLoading(true);
        setIsProcessingDeepLink(true);
      

        // Extract tokens from URL
        const accessTokenMatch = url.match(/access_token=([^&]+)/);
        const refreshTokenMatch = url.match(/refresh_token=([^&]+)/);

        if (accessTokenMatch && refreshTokenMatch) {
          const accessToken = accessTokenMatch[1];
          const refreshToken = refreshTokenMatch[1];

         

          // Call backend callback first to get isNewUser
          try {
            const api = (await import("../app/api/api.js")).default;
            const callbackResponse = await api.post("/api/v1/callback", {
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            const backendIsNewUser = callbackResponse.data.data.isNewUser;
            setIsNewUser(backendIsNewUser);
       
          } catch (callbackError) {
           
            setIsNewUser(false); // Default to existing user if backend fails
          }

          // Set Supabase session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
           
            setError(error.message);
            setIsLoading(false);
            return;
          }

          if (data.session) {
           
            await processUserSession(data.session);
           
          } else {
          
          }
        } else {
          
        }

        
        setIsLoading(false);
        setIsProcessingDeepLink(false);
      } else {
       
      }
    } catch (error) {
     
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
    

      // Force immediate processing of the deep link
      if (url) {
        // Use setTimeout to ensure this runs after the current execution context
        // setTimeout(() => {
          handleDeepLink(url);
        // }, 0);
      }
    });

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then(url => {
      if (url) {
       
        handleDeepLink(url);
      }
    });

    // Network monitoring with fetch-based detection
    const checkNetworkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout
        
        await fetch('https://www.google.com', {
          method: 'HEAD',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    // Initial network check
    checkNetworkConnection();

    // Periodic network check (every 10 seconds)
    const networkInterval = setInterval(checkNetworkConnection, 10000);

    return () => {
      subscription?.remove();
      clearInterval(networkInterval);
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
      isConnected,
    }),
    [user, isLoggedIn, authToken, isLoading, isNewUser, error, isProcessingDeepLink, isConnected]
  );

  return (
    <AuthContext.Provider value={value}>
      {isConnected ? children : <OfflinePage />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
