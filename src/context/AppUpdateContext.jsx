import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform, Linking } from "react-native";
import Constants from "expo-constants";

const AppUpdateContext = createContext();

export const AppUpdateProvider = ({ children }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  // Get current app version
  const getCurrentVersion = () => {
    return Constants.expoConfig?.version || "1.0.0";
  };

  // Check for app updates
  const checkForUpdates = async () => {
    try {
      setIsCheckingUpdate(true);
      console.log("🔍 Checking for updates...");
      
      // Get the last update check time
      const lastCheckTime = await AsyncStorage.getItem("lastUpdateCheck");
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours
      
      // Check if user has already updated to the latest version
      const lastSkippedVersion = await AsyncStorage.getItem("lastSkippedVersion");
      const currentVersion = getCurrentVersion();
      
      console.log("📱 Current version:", currentVersion);
      console.log("⏰ Last check time:", lastCheckTime);
      console.log("🔄 Last skipped version:", lastSkippedVersion);
      
      // Only check once per day to avoid excessive API calls
      if (lastCheckTime && (now - parseInt(lastCheckTime)) < oneDayInMs) {
        console.log("⏭️ Skipping check - already checked today");
        // But still show popup if user hasn't updated and there's a pending update
        if (lastSkippedVersion && lastSkippedVersion !== currentVersion) {
          // User skipped an update, show popup again
          const updateInfo = await getStoredUpdateInfo();
          if (updateInfo) {
            console.log("📦 Showing stored update info");
            setUpdateInfo(updateInfo);
            setShowUpdateModal(true);
          }
        }
        setIsCheckingUpdate(false);
        return;
      }

      // For demo purposes, we'll simulate an update check
      // In production, you would call your backend API here
      const latestVersion = await fetchLatestVersion();
      
      if (latestVersion) {
        console.log("🎉 Update found! Preparing popup...");
        const updateInfoData = {
          currentVersion,
          latestVersion: latestVersion.latestVersion,
          isUpdateAvailable: true,
          updateUrl: latestVersion.updateUrl || getUpdateUrl(),
          forceUpdate: latestVersion.forceUpdate || false,
          updateMessage: latestVersion.updateMessage,
          features: latestVersion.features
        };
        
        console.log("📋 Update info:", updateInfoData);
        setUpdateInfo(updateInfoData);
        setShowUpdateModal(true);
        console.log("🚀 Update modal should now be visible!");
        
        // Store update info for persistent reminders
        await AsyncStorage.setItem("storedUpdateInfo", JSON.stringify(updateInfoData));
      } else {
        console.log("ℹ️ No update available");
      }

      // Save the check time
      await AsyncStorage.setItem("lastUpdateCheck", now.toString());
      
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  // Fetch latest version from your backend
  const fetchLatestVersion = async () => {
    try {
      const currentVersion = getCurrentVersion();
      const platform = Platform.OS;
      
      console.log("🌐 Fetching latest version...");
      console.log("📱 Current version:", currentVersion);
      console.log("📱 Platform:", platform);
      
      // Use the same IP address as the main API
      const API_URL = 'http://192.168.29.190:5500';
      const url = `${API_URL}/api/v1/version/check?currentVersion=${currentVersion}&platform=${platform}`;
      console.log("🔗 API URL:", url);
      
      const response = await fetch(url);
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error('Failed to check for updates');
      }
      
      const data = await response.json();
      console.log("📦 API Response:", data);
      
      if (data.success && data.data.isUpdateAvailable) {
        console.log("✅ Update available!");
        return {
          latestVersion: data.data.latestVersion,
          forceUpdate: data.data.forceUpdate,
          updateMessage: data.data.updateMessage,
          features: data.data.features,
          updateUrl: data.data.updateUrl
        };
      }
      
      console.log("❌ No update available");
      return null;
    } catch (error) {
      console.error("❌ Error fetching latest version:", error);
      return null;
    }
  };

  // Get the appropriate update URL based on platform
  const getUpdateUrl = () => {
    if (Platform.OS === 'android') {
      return 'https://play.google.com/store/apps/details?id=com.onlyclick.user';
    } else if (Platform.OS === 'ios') {
      return 'https://apps.apple.com/app/only-click/id123456789'; // Replace with actual App Store ID
    }
    return null;
  };

  // Handle update button press
  const handleUpdatePress = async () => {
    const updateUrl = getUpdateUrl();
    if (updateUrl) {
      try {
        const supported = await Linking.canOpenURL(updateUrl);
        if (supported) {
          await Linking.openURL(updateUrl);
        }
      } catch (error) {
        console.error("Error opening update URL:", error);
      }
    }
  };

  // Get stored update info
  const getStoredUpdateInfo = async () => {
    try {
      const storedInfo = await AsyncStorage.getItem("storedUpdateInfo");
      return storedInfo ? JSON.parse(storedInfo) : null;
    } catch (error) {
      console.error("Error getting stored update info:", error);
      return null;
    }
  };

  // Handle skip update (only if not forced)
  const handleSkipUpdate = async () => {
    if (!updateInfo?.forceUpdate) {
      setShowUpdateModal(false);
      // Store that user skipped this version - this will cause popup to show again next time
      await AsyncStorage.setItem("lastSkippedVersion", updateInfo?.latestVersion || "");
    }
  };

  // Check if user has skipped this version
  const hasUserSkippedVersion = async (version) => {
    const skipped = await AsyncStorage.getItem(`skippedVersion_${version}`);
    return skipped === "true";
  };

  // Force check for updates (can be called manually)
  const forceCheckForUpdates = async () => {
    console.log("🔄 Force checking for updates...");
    await AsyncStorage.removeItem("lastUpdateCheck");
    await AsyncStorage.removeItem("lastSkippedVersion");
    await AsyncStorage.removeItem("storedUpdateInfo");
    await checkForUpdates();
  };

  // Clear update reminders when user updates (call this when app version changes)
  const clearUpdateReminders = async () => {
    await AsyncStorage.removeItem("lastSkippedVersion");
    await AsyncStorage.removeItem("storedUpdateInfo");
    await AsyncStorage.removeItem("lastUpdateCheck");
  };

  // Check for updates when app starts
  useEffect(() => {
    checkForUpdates();
  }, []);

  // Check if app version has changed (user updated)
  useEffect(() => {
    const checkVersionChange = async () => {
      try {
        const storedVersion = await AsyncStorage.getItem("lastKnownVersion");
        const currentVersion = getCurrentVersion();
        
        if (storedVersion && storedVersion !== currentVersion) {
          // App version has changed, clear all update reminders
          await clearUpdateReminders();
        }
        
        // Store current version
        await AsyncStorage.setItem("lastKnownVersion", currentVersion);
      } catch (error) {
        console.error("Error checking version change:", error);
      }
    };
    
    checkVersionChange();
  }, []);

  return (
    <AppUpdateContext.Provider
      value={{
        showUpdateModal,
        setShowUpdateModal,
        updateInfo,
        setUpdateInfo,
        isCheckingUpdate,
        checkForUpdates,
        handleUpdatePress,
        handleSkipUpdate,
        forceCheckForUpdates,
        clearUpdateReminders,
        getCurrentVersion
      }}
    >
      {children}
    </AppUpdateContext.Provider>
  );
};

export const useAppUpdate = () => useContext(AppUpdateContext);
