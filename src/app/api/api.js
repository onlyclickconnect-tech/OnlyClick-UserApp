import axios from "axios";
import supabase from "../../data/supabaseClient.js";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  // process.env.EXPO_PUBLIC_API_URL,
  // Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  // "https://jqkb8s0g-5500.inc1.devtunnels.ms/",
});

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

export default api;
