// import { createContext, useContext, useMemo, useState } from "react";
// import getFullName from "../data/getdata/getProfile";

// // import axios from "axios";
// const AuthContext = createContext();

// //TODO
// // if (accessToken.expiryDate > new Date()) {
// //   // const {accessToken,refreshToken}=await axios.post("link to refresh accessToken",)
// //   setUser((prev) => {
// //     return { ...prev, accessToken, refreshToken };
// //   });
// // }

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState({
//     name: getFullName,
//     address: "Vijayawada,Andhra Pradesh",
//     phone: "1234567890",
//     email: "",
//     _id: "123abc",
//     taskMasterId: "123abc",
//     service: "Electrician",
//     profileImage: "https://picsum.photos/200/300",
//     reviews: 300,
//     ratings: 4.2,
//     authToken: {
//       token: "1234",
//       expiryDate: "",
//     },
//     refreshToken: {
//       token: "1234",
//       expiryDate: "",
//     },
//   });
//   const [authToken, setAuthToken] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   /*
//   const fetchDetails = async () => {
//   const userDetails = await getUserDetails();
//   if (userDetails) {
//     setUser(JSON.parse(userDetails));
//     setIsLoggedIn(true);
//     setAuthToken(JSON.parse(userDetails).accessToken);
//   }
  
//    useEffect(() => {
//     fetchDetails();
//   }, []);
//   useEffect(() => {
//     async function init() {
//       setUserDetails(user);
//     }
//     init();
//   }, [user]);
//   */
//   const value = useMemo(() => {
//     return {
//       user,
//       setUser,
//       isLoggedIn,
//       setIsLoggedIn,
//       authToken,
//       setAuthToken,
//     };
//   }, [user, setUser, isLoggedIn, setIsLoggedIn, authToken, setAuthToken]);
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
// export const useAuth = () => {
//   return useContext(AuthContext);
// };


//Amar's code

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getEmail, getFullName, getProfileImage } from "../data/getdata/getProfile";
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

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        console.error("No authenticated user found:", error);
        setIsLoggedIn(false);
        return;
      }

      const currentUser = session.user;
      const userId = currentUser.id; 

      const fullName = await getFullName(userId);
      const avatar = await getProfileImage(userId);
      const email = await getEmail(userId);

      setUser({
        name: fullName || "",
        address: "Vijayawada, Andhra Pradesh",
        phone: "",
        email: email|| "",
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
    }

    fetchUser();
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
