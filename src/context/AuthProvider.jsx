import { useState, useContext, createContext, useEffect, useMemo } from "react";
import { getUserDetails, setUserDetails } from "../utils/storage";

// import axios from "axios";
const AuthContext = createContext();

//TODO
// if (accessToken.expiryDate > new Date()) {
//   // const {accessToken,refreshToken}=await axios.post("link to refresh accessToken",)
//   setUser((prev) => {
//     return { ...prev, accessToken, refreshToken };
//   });
// }

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: "Vivek",
    address: "Vijayawada,Andhra Pradesh",
    phone: "1234567890",
    email: "vivek",
    _id: "123abc",
    taskMasterId: "123abc",
    service: "Electrician",
    profileImage: "https://picsum.photos/200/300",
    reviews: 300,
    ratings: 4.2,
    authToken: {
      token: "1234",
      expiryDate: "",
    },
    refreshToken: {
      token: "1234",
      expiryDate: "",
    },
  });
  const [authToken, setAuthToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  /*
  const fetchDetails = async () => {
  const userDetails = await getUserDetails();
  if (userDetails) {
    setUser(JSON.parse(userDetails));
    setIsLoggedIn(true);
    setAuthToken(JSON.parse(userDetails).accessToken);
  }
  
   useEffect(() => {
    fetchDetails();
  }, []);
  useEffect(() => {
    async function init() {
      setUserDetails(user);
    }
    init();
  }, [user]);
  */
  const value = useMemo(() => {
    return {
      user,
      setUser,
      isLoggedIn,
      setIsLoggedIn,
      authToken,
      setAuthToken,
    };
  }, [user, setUser, isLoggedIn, setIsLoggedIn, authToken, setAuthToken]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  return useContext(AuthContext);
};
