
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getAddress,
  getEmail,
  getFullName,
  getPhone,
  getProfileImage,
} from "../data/getdata/getProfile";
import supabase from "../data/supabaseClient";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    _id: "",
    taskMasterId: "",
    service: "",
    profileImage: "",
    reviews: 0,
    ratings: 0,
    authToken: {
      token: "",
      expiryDate: "",
    },
    refreshToken: {
      token: "",
      expiryDate: "",
    },
  });
  const [authToken, setAuthToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   async function fetchUser() {
  //     const {
  //       data: { session },
  //       error,
  //     } = await supabase.auth.getSession();

  //     if (error || !session?.user) {
  //       console.error("No authenticated user found:", error);
  //       setIsLoggedIn(false);
  //       return;
  //     }

  //     const currentUser = session.user;
  //     const userId = currentUser.id;

  //     const fullName = await getFullName(userId);
  //     const avatar = await getProfileImage(userId);
  //     const email = await getEmail(userId);
  //     const phone = await getPhone(userId);
  //     const address = await getAddress(userId);

  //     setUser({
  //       name: fullName || "",
  //       address: address,
  //       phone: phone,
  //       email: email || "",
  //       _id: userId,
  //       taskMasterId: "",
  //       service: "",
  //       profileImage: avatar,
  //       reviews: 0,
  //       ratings: 0,
  //       authToken: {
  //         token: session.access_token,
  //         expiryDate: "",
  //       },
  //       refreshToken: {
  //         token: session.refresh_token,
  //         expiryDate: "",
  //       },
  //     });

  //     setIsLoggedIn(true);
  //     setAuthToken(session.access_token || "");
  //   }

  //   fetchUser();
  // }, []);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Initial session check:", session);

      if (session?.user) {
        console.log("Found existing session, setting up user");
        const currentUser = session.user;
        const userId = currentUser.id;

        const fullName = await getFullName(userId);
        const avatar = await getProfileImage(userId);
        const email = await getEmail(userId);
        const phone = await getPhone(userId);
        const address = await getAddress(userId);

        setUser({
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
        });

        setIsLoggedIn(true);
        setAuthToken(session.access_token || "");
        console.log(
          "User setup complete, token:",
          session.access_token?.substring(0, 20) + "..."
        );
      } else {
        console.log("No existing session found");
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (session?.user) {
        console.log("New session detected, updating user");
        const currentUser = session.user;
        const userId = currentUser.id;

        const fullName = await getFullName(userId);
        const avatar = await getProfileImage(userId);
        const email = await getEmail(userId);
        const phone = await getPhone(userId);
        const address = await getAddress(userId);

        setUser({
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
        });

        setIsLoggedIn(true);
        setAuthToken(session.access_token || "");
      } else {
        console.log("No session found, user logged out");
        setIsLoggedIn(false);
        setAuthToken("");
      }
    });

    return () => subscription?.unsubscribe();
  }, []);



  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn,
      setIsLoggedIn,
      authToken,
      setAuthToken,
    }),
    [user, isLoggedIn, authToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
