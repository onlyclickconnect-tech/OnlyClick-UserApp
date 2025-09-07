import axios from "axios";
import supabase from "../../data/supabaseClient";

const api = axios.create({

  baseURL: "https://giant-steaks-occur.loca.lt",
  // baseURL: "onlyclickdeveloper.up.railway.app",
})


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
