import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Use Expo SecureStore if you want stronger security
const SUPABASE_URL = Constants.expoConfig?.extra
  ?.expoPublicSupabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra
  ?.expoPublicSupabaseAnonKey;


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, //changed to true
  },
})

supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session?.user?.id);
});

export default supabase