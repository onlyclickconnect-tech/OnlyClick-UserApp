import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdvancedOptions from "../../../../../components/Profile/AdvancedOptions";
import BottomLinks from "../../../../../components/Profile/BottomLinks";
import ProfileForm from "../../../../../components/Profile/ProfileForm";
import ProfileHeader from "../../../../../components/Profile/ProfileHeader";
import { useAppStates } from "../../../../../context/AppStates";

const ProfilePage = () => {
  const [isGeneral, setIsGeneral] = useState(true);
  const { isProfileCompleted, markProfileCompleted } = useAppStates();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    // Show welcome message if profile is not completed
    if (isProfileCompleted === false) {
      setShowWelcomeMessage(true);
    }
  }, [isProfileCompleted]);

  const handleSaveProfile = async () => {
    try {
      await markProfileCompleted();
      Alert.alert(
        "Profile Saved!",
        "Your profile has been completed successfully.",
        [
          {
            text: "Continue to App",
            onPress: () => router.replace("/(app)/protected/(tabs)/Home")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3898B3" />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {showWelcomeMessage && (
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeIconContainer}>
                <Ionicons name="sparkles" size={24} color="#3898B3" />
              </View>
              <Text style={styles.welcomeTitle}>Complete Your Profile</Text>
            </View>
            <Text style={styles.welcomeText}>
              Help us personalize your TaskMaster experience by completing your profile details
            </Text>
            <View style={styles.progressIndicator}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>Just a few steps away!</Text>
            </View>
          </View>
        )}
        
        <ProfileHeader isGeneral={isGeneral} setIsGeneral={setIsGeneral} />
        
        <View style={styles.formContainer}>
          {isGeneral ? <ProfileForm /> : <AdvancedOptions />}
        </View>
        
        {showWelcomeMessage && isGeneral && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <View style={styles.buttonContent}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.saveButtonText}>Save Profile & Continue</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={() => router.replace("/(app)/protected/(tabs)/Home")}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
              <Ionicons name="arrow-forward" size={16} color="#3898B3" style={styles.skipIcon} />
            </TouchableOpacity>
          </View>
        )}
        
        <BottomLinks />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3898B3',
    paddingTop: 45,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    marginTop: 90,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  welcomeContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e8f4f8",
    shadowColor: "#3898B3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  welcomeIconContainer: {
    backgroundColor: "#e8f4f8",
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  welcomeText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  progressIndicator: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e8f4f8",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    width: "65%",
    backgroundColor: "#3898B3",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#3898B3",
    fontWeight: "600",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    marginTop: 10,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#3898B3",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#3898B3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  skipButtonText: {
    color: "#3898B3",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },
  skipIcon: {
    opacity: 0.8,
  },
});

export default ProfilePage;
