import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAppStates } from "../../context/AppStates";
import useCurrentUserDetails from "../../hooks/useCurrentUserDetails";
import useDimension from "../../hooks/useDimensions";
import headerStyle from "../../styles/Home/headerStyle";
import Badge from "../common/Badge";
import PressableScale from '../common/PressableScale';

function Header() {
  const [hasNotification, setHasNotification] = useState(true);
  const { screenHeight, screenWidth } = useDimension();
  const [search, setSearch] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const { userAddress } = useCurrentUserDetails();
  const { selectedLocation, updateSelectedLocation } = useAppStates();
  const router = useRouter();
  const styles = headerStyle();
  
  const searchService = async () => {
    console.log("user searched");
  };
  
  useEffect(() => {
    if (userAddress && (!selectedLocation || selectedLocation === "Tap to set location")) {
      updateSelectedLocation(userAddress);
    }
    setManualLocation(selectedLocation || "");
  }, [userAddress, selectedLocation]);
  
  // Location functions - similar to Post tab
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
      const addressResult = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressResult.length > 0) {
        const addr = addressResult[0];
        const formattedAddress = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        updateSelectedLocation(formattedAddress);
        setManualLocation(formattedAddress);
        setShowLocationModal(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    }
    setIsLocationLoading(false);
  };
  
  const saveManualLocation = () => {
    if (manualLocation && manualLocation.trim()) {
      updateSelectedLocation(manualLocation.trim());
      setShowLocationModal(false);
    }
  };
  
  const changeAddress = () => {
    setShowLocationModal(true);
  };
  
  return (
    <>
      {/* Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLocationModal}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalHeader}>
              <Text style={modalStyles.modalTitle}>📍 Update Location</Text>
              <TouchableOpacity 
                onPress={() => setShowLocationModal(false)}
                style={modalStyles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={modalStyles.modalContent}>
              {/* Current Location Option */}
              <TouchableOpacity 
                style={[modalStyles.locationOption, isLocationLoading && modalStyles.locationOptionDisabled]}
                onPress={getCurrentLocation}
                disabled={isLocationLoading}
              >
                <View style={modalStyles.locationOptionLeft}>
                  <View style={modalStyles.locationIconContainer}>
                    <Ionicons 
                      name={isLocationLoading ? "refresh" : "location"} 
                      size={20} 
                      color="#007AFF" 
                    />
                  </View>
                  <View>
                    <Text style={modalStyles.locationOptionTitle}>
                      {isLocationLoading ? "Getting Location..." : "Use Current Location"}
                    </Text>
                    <Text style={modalStyles.locationOptionSubtitle}>
                      Automatically detect your location
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {/* Manual Location Input */}
              <View style={modalStyles.manualSection}>
                <Text style={modalStyles.sectionTitle}>Enter Location Manually</Text>
                <View style={modalStyles.inputContainer}>
                  <Ionicons name="location-outline" size={20} color="#666" style={modalStyles.inputIcon} />
                  <TextInput
                    style={modalStyles.textInput}
                    placeholder="Type your address here..."
                    placeholderTextColor="#999"
                    value={manualLocation}
                    onChangeText={setManualLocation}
                    multiline={true}
                    numberOfLines={2}
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity 
                  style={modalStyles.cancelButton}
                  onPress={() => setShowLocationModal(false)}
                >
                  <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    modalStyles.saveButton,
                    (!manualLocation || !manualLocation.trim()) && modalStyles.saveButtonDisabled
                  ]}
                  onPress={saveManualLocation}
                  disabled={!manualLocation || !manualLocation.trim()}
                >
                  <Text style={modalStyles.saveButtonText}>Save Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <LinearGradient colors={["#4cb6c9", "#3898b3"]} style={styles.header}>
        <View style={styles.rowTop}>
          <View style={styles.locationWrap}>
            <Text style={styles.locationLabel}>Location</Text>
            <PressableScale accessibilityRole="button" onPress={changeAddress} style={styles.locationButton}>
              <Entypo
                name="location-pin"
                size={18}
                color={isLocationLoading ? "#FFD58A" : "#FFEA85"}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                {isLocationLoading ? "Getting location..." : selectedLocation || "Tap to set location"}
              </Text>
              <AntDesign name="down" size={12} color="#FFEA85" style={{ marginLeft: 8 }} />
            </PressableScale>
          </View>

          <View style={styles.iconGroup}>
      <PressableScale accessibilityRole="button" onPress={() => router.navigate('/protected/Notifications')} style={styles.iconButton}>
              <Badge
                pressable={false}
                hasBadge={hasNotification}
                badgeSize={10}
                badgeColor="red"
                badgeTop={-6}
                badgeRight={-6}
        element={<Ionicons name="notifications" size={20} color="white" />}
              />
            </PressableScale>
          </View>
        </View>

        <View style={styles.rowBottom}>
          <View style={styles.searchWrap}>
            <FontAwesome name="search" size={16} color="#3898B3" style={styles.searchIcon} />
            <TextInput
              placeholder="Find services ..."
              style={styles.searchText}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              placeholderTextColor={"#9AA8AE"}
              onSubmitEditing={searchService}
              accessibilityLabel="Search"
            />
          </View>

          <PressableScale accessibilityRole="button" onPress={() => router.push('/(modal)/cart')} style={styles.cartButton}>
            <View style={styles.cartInner}>
              <Feather name="shopping-cart" size={20} color="#3898B3" />
            </View>
          </PressableScale>
        </View>
      </LinearGradient>
    </>
  );
}

// Modal Styles
const modalStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  locationOptionDisabled: {
    opacity: 0.6,
  },
  locationOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  locationOptionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  manualSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    minHeight: 40,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#B3D9FF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
};

export default Header;
