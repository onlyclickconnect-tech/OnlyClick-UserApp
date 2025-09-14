export default {
  expo: {
    name: "Only Click",
    slug: "only-click-user",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/mainicon.png",
    scheme: "onlyclick",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/mainicon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      icon: "./assets/images/mainicon.png",
      bundleIdentifier: "com.onlyclick.userapp",
    },
    android: {
      icon: "./assets/images/mainicon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/images/mainicon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.onlyclick.user",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "This app needs access to your location to show nearby services and providers.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share images of your service requests.",
          cameraPermission:
            "The app accesses your camera to let you take photos of your service requests.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "49154165-ce38-4c75-a522-54d98a82bb22",
      },
      expoPublicSupabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      expoPublicSupabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      expoPublicRazorPayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
      expoPublicApiUrl: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};
