import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { createCustomPost } from "../../../../api/post";

import AppHeader from '../../../../../components/common/AppHeader';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function PostRequest() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [problemDescription, setProblemDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [urgency, setUrgency] = useState(null);
  const [contractorPreference, setContractorPreference] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const urgencyOptions = [
    { label: "Normal", value: "normal", icon: "schedule" },
    { label: "Urgent", value: "urgent", icon: "priority-high" },
  ];

  const contractorOptions = [
    { label: "Auto-assign", value: "auto", icon: "auto-fix-high" },
    { label: "Previously used", value: "previous", icon: "history" },
  ];

  // Camera function
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Camera permission is needed to take photos");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Camera error:", error);
      Alert.alert("Error", `Failed to take photo: ${error.message}`);
    }
  };

  // Gallery function - opens system gallery
  const pickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Gallery permission is needed to select photos");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Gallery error:", error);
      Alert.alert("Error", `Failed to pick image: ${error.message}`);
    }
  };

  // Location functions
  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission required", "Location permission is needed to get your current location");
        setIsLocationLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const formattedAddress = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        setLocation(formattedAddress);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    }
    setIsLocationLoading(false);
  };

  // AI assistance for problem description
  const getAIHelp = () => {
    Alert.alert(
      "AI Assistant",
      "Describe your problem in detail. For example:\n• What needs to be fixed?\n• When did the issue start?\n• What have you tried?\n• Any specific requirements?",
      [{ text: "Got it", style: "default" }]
    );
  };

  // Submit function
  const handleSubmitRequest = async () => {
    if (!problemDescription.trim()) {
      Alert.alert("Missing Information", "Please describe your problem");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Missing Information", "Please provide a location");
      return;
    }
    if (!urgency) {
      Alert.alert("Missing Information", "Please select urgency level");
      return;
    }
    if (!contractorPreference) {
      Alert.alert("Missing Information", "Please select contractor preference");
      return;
    }

    try {
      const postData = {
        image: selectedImage,
        description: problemDescription,
        location: location,
        urgency: urgency,
        contractorPreference: contractorPreference,
      };

      const result = await createCustomPost(postData);

      if (result.error) {
        Alert.alert("Error", "Failed to submit request");
        return;
      }

      Alert.alert(
        "Request Submitted!",
        "Your custom request has been posted. Contractors will be notified shortly.",
        [
          {
            text: "View in Cart",
            style: "default",
            onPress: () => router.push("/(app)/(modal)/cart"),
          },
          { text: "OK", style: "default", onPress: () => router.back() },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit request");
    }
  };

  // Help Modal Component
  const HelpModal = () => (
    <Modal visible={showHelpModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.helpModalContent}>
          <View style={styles.helpModalHeader}>
            <View style={styles.helpIconContainer}>
              <MaterialIcons name="help-outline" size={28} color="#007AFF" />
            </View>
            <Text style={styles.helpModalTitle}>📝 How to Post a Request</Text>
            <TouchableOpacity onPress={() => setShowHelpModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.helpContent} showsVerticalScrollIndicator={false}>
            {/* Step 1 */}
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>📸 Add Photos (Optional)</Text>
                <Text style={styles.stepDescription}>
                  Take clear photos of the problem area. This helps contractors understand your needs better and provide accurate quotes.
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>📝 Describe the Problem</Text>
                <Text style={styles.stepDescription}>
                  Be specific! Include:
                  {'\n'}• What needs to be fixed/done
                  {'\n'}• When the problem started
                  {'\n'}• What you've tried already
                  {'\n'}• Any specific requirements
                </Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleTitle}>💡 Good Example:</Text>
                  <Text style={styles.exampleText}>
                    "My kitchen sink faucet is leaking from the base. Started 3 days ago and drips every few seconds. Need replacement or repair. Prefer eco-friendly fixtures."
                  </Text>
                </View>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>📍 Set Location</Text>
                <Text style={styles.stepDescription}>
                  Use GPS for accuracy or enter manually. This helps contractors in your area find your request.
                </Text>
              </View>
            </View>

            {/* Step 4 */}
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>⏰ Choose Urgency</Text>
                <Text style={styles.stepDescription}>
                  • Normal: Standard response time
                  {'\n'}• Urgent: Faster response, may cost more
                </Text>
              </View>
            </View>

            {/* Step 5 */}
            <View style={styles.helpStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>👷 Contractor Preference</Text>
                <Text style={styles.stepDescription}>
                  • Auto-assign: We'll find the best match
                  {'\n'}• Previously used: Work with trusted contractors
                </Text>
              </View>
            </View>

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>🎯 Pro Tips</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>✅ Be honest about your budget expectations</Text>
                <Text style={styles.tipItem}>✅ Mention preferred time slots</Text>
                <Text style={styles.tipItem}>✅ Include material preferences if any</Text>
                <Text style={styles.tipItem}>✅ Add emergency contact if urgent</Text>
              </View>
            </View>

            {/* Pricing Info */}
            <View style={styles.pricingInfo}>
              <Text style={styles.pricingTitle}>💰 Pricing</Text>
              <Text style={styles.pricingText}>
                • Free to post requests
                {'\n'}• Pay only when you hire
                {'\n'}• Compare multiple quotes
                {'\n'}• No hidden fees
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.helpCloseButton}
            onPress={() => setShowHelpModal(false)}
          >
            <Text style={styles.helpCloseButtonText}>Got it! Let's post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title={'📝 Post Request'}
        showBack
        onBack={() => router.back()}
        rightElement={
          <TouchableOpacity style={styles.helpButton} onPress={() => setShowHelpModal(true)}>
            <MaterialIcons name="help-outline" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

      {/* Image Upload Section */}
      <View style={styles.camerasection}>
        <View style={styles.sectionHeaderWithIcon}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="camera-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Upload Image</Text>
            </View>
          </View>
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>Optional</Text>
          </View>
        </View>
        
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.removeImageBtn}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageUploadOptions}>
            <TouchableOpacity 
              style={styles.imageUploadButton}
              onPress={takePhoto}
            >
              <View style={styles.imageUploadIconContainer}>
                <Ionicons name="camera" size={28} color="#007AFF" />
              </View>
              <Text style={styles.imageUploadTitle}>Camera</Text>
              <Text style={styles.imageUploadSubtitle}>Take a photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.imageUploadButton}
              onPress={pickFromGallery}
            >
              <View style={styles.imageUploadIconContainer}>
                <Ionicons name="images" size={28} color="#007AFF" />
              </View>
              <Text style={styles.imageUploadTitle}>Gallery</Text>
              <Text style={styles.imageUploadSubtitle}>Choose from gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Problem Description Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderWithIcon}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Describe Problem</Text>
            </View>
          </View>
          <TouchableOpacity onPress={getAIHelp} style={styles.aiBtn}>
            <Ionicons name="bulb-outline" size={16} color="#FFB800" />
            <Text style={styles.aiBtnText}>AI Help</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.problemInput}
          multiline
          numberOfLines={4}
          placeholder="e.g., My kitchen sink is leaking from the faucet base. It started yesterday and water drips every few seconds. I need someone to fix or replace the faucet..."
          placeholderTextColor="#999"
          value={problemDescription}
          onChangeText={setProblemDescription}
          textAlignVertical="top"
        />
        <View style={styles.inputFooter}>
          <Text style={styles.characterCount}>{problemDescription.length}/500</Text>
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderWithIcon}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <TextInput
            style={styles.locationInput}
            placeholder="Enter location manually or use GPS"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity 
            style={[styles.locationBtn, isLocationLoading && styles.locationBtnDisabled]}
            onPress={getCurrentLocation}
            disabled={isLocationLoading}
          >
            <Ionicons 
              name={isLocationLoading ? "refresh" : "location"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Urgency Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderWithIcon}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="timer-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Urgency Level</Text>
            </View>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          {urgencyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionBtn,
                urgency === option.value && (option.value === "urgent" ? styles.optionBtnUrgentSelected : styles.optionBtnSelected)
              ]}
              onPress={() => setUrgency(option.value)}
            >
              <MaterialIcons 
                name={option.icon} 
                size={20} 
                color={urgency === option.value ? "#fff" : option.value === "urgent" ? "#FF6B6B" : "#666"}
              />
              <Text style={[
                styles.optionText,
                urgency === option.value && styles.optionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contractor Preference Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderWithIcon}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="people-outline" size={20} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Contractor Preference</Text>
            </View>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          {contractorOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionBtn,
                contractorPreference === option.value && (
                  option.value === "auto" ? styles.optionBtnAutoSelected : 
                  option.value === "previous" ? styles.optionBtnPreviousSelected : 
                  styles.optionBtnSelected
                )
              ]}
              onPress={() => setContractorPreference(option.value)}
            >
              <MaterialIcons 
                name={option.icon} 
                size={20} 
                color={contractorPreference === option.value ? "#fff" : 
                  option.value === "auto" ? "#28a745" : 
                  option.value === "previous" ? "#FF8C00" : "#666"}
              />
              <Text style={[
                styles.optionText,
                contractorPreference === option.value && styles.optionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitRequest}>
          <View style={styles.submitContent}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.submitBtnText}>Post Request</Text>
          </View>
          <Text style={styles.submitSubtext}>Free to post  •  Pay only when hired</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      <HelpModal />
    </View>
  );
}

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
    paddingTop: screenHeight * 0.05, // Adjusted padding dynamically
    paddingBottom: screenHeight * 0.03, // Adjusted padding dynamically
    borderBottomLeftRadius: screenWidth * 0.08, // Dynamic radius
    borderBottomRightRadius: screenWidth * 0.08, // Dynamic radius
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Balance the back button
  },
  headerSubtitle: {
    // headerSubtitle removed - AppHeader has no subheading
  },
  helpButton: {
    padding: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
  paddingTop: 0,
  paddingHorizontal: 10,
  paddingBottom: 40,
  },
  camerasection: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  // spacing adjusted to sit under AppHeader
  marginTop: 64,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionHeaderWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  optionalBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  optionalText: {
    color: "#28a745",
    fontSize: 12,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    paddingTop: 8,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: 80,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  imageUploadOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  imageUploadButton: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  imageUploadIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  imageUploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 2,
  },
  imageUploadSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  aiBtnText: {
    marginLeft: 4,
    color: "#856404",
    fontSize: 12,
    fontWeight: "500",
  },
  problemInput: {
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: "#FAFAFA",
    color: "#1a1a1a",
    lineHeight: 24,
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationInput: {
    flex: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fafafa",
    marginRight: 10,
  },
  locationBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  locationBtnDisabled: {
    backgroundColor: "#ccc",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: "#e9ecef",
    minHeight: 56,
  },
  optionBtnSelected: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  optionBtnUrgentSelected: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  optionBtnAutoSelected: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  optionBtnPreviousSelected: {
    backgroundColor: "#FF8C00",
    borderColor: "#FF8C00",
  },
  optionText: {
    marginLeft: 8,
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#fff",
  },
  submitContainer: {
    marginTop: 30,
    marginBottom: 100,
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  submitSubtext: {
    color: "#B3D9FF",
    fontSize: 12,
    fontWeight: "500",
  },
  // Help Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  helpModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  helpModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  helpContent: {
    maxHeight: '80%',
    paddingHorizontal: 20,
  },
  helpStep: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingTop: 10,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  exampleBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 13,
    color: '#495057',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  tipsSection: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57F17',
    marginBottom: 10,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 14,
    color: '#F57F17',
    lineHeight: 20,
  },
  pricingInfo: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 8,
  },
  pricingText: {
    fontSize: 14,
    color: '#28a745',
    lineHeight: 20,
  },
  helpCloseButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  helpCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
