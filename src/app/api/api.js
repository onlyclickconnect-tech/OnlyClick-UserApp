import axios from "axios";
import Constants from 'expo-constants';
import supabase from "../../data/supabaseClient.js";

const api = axios.create({
  baseURL: "http://192.168.29.190:5500",
  timeout: 10000, // 10 second timeout
  // Constants.expoConfig?.extra?.expoPublicApiUrl || "http://192.168.29.190:5500",
  // process.env.EXPO_PUBLIC_API_URL,
  // Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  // "https://jqkb8s0g-5500.inc1.devtunnels.ms/",
});

// Debug logging
console.log("API Base URL:", Constants.expoConfig?.extra?.expoPublicApiUrl);
console.log("Full API URL:", api.defaults.baseURL);
console.log("Environment check:", process.env.NODE_ENV);

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);
    console.error("API Error Details:", error.response?.data);
    console.error("API Error Status:", error.response?.status);
    console.error("API Error URL:", error.config?.url);
    return Promise.reject(error);
  }
);

export default api;
