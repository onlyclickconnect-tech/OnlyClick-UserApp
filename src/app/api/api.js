import axios from "axios";
import supabase from "../../data/supabaseClient";

const api = axios.create({

  baseURL: "https://81cq2mbl-5500.inc1.devtunnels.ms",
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
