import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Text from "../../../../components/ui/Text.jsx"
import { useAppStates } from '../../../../context/AppStates';

const { width: screenWidth } = Dimensions.get("window");

export default function LocationScreen() {
  const router = useRouter();
  const { selectedLocation, updateSelectedLocation, selectedLocationObject, updateSelectedLocationObject } = useAppStates();

  // Location state management
  const [manualLocation, setManualLocation] = useState("");
  
  // Location form fields
  const [houseNumber, setHouseNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [pincode, setPincode] = useState("");

  // Validation helper
  const isFormValid = () => {
    return houseNumber.trim() && city.trim() && pincode.trim();
  };

  // Field navigation refs
  const houseNumberRef = useRef(null);
  const roadRef = useRef(null);
  const districtRef = useRef(null);
  const cityRef = useRef(null);
  const additionalInfoRef = useRef(null);
  const pincodeRef = useRef(null);

  // Smooth field navigation
  const focusNextField = (nextRef) => {
    setTimeout(() => {
      nextRef.current?.focus();
    }, 100);
  };

  // Initialize location on component mount
  useEffect(() => {
    if (selectedLocation) {
      setManualLocation(selectedLocation);
    }
  }, [selectedLocation]);

  // Prefill form fields from saved location object
  useEffect(() => {
    if (selectedLocationObject && Object.keys(selectedLocationObject).length > 0) {
      setHouseNumber(selectedLocationObject.houseNumber || "");
      setDistrict(selectedLocationObject.district || "");
      setCity(selectedLocationObject.city || "");
      setPincode(selectedLocationObject.pincode || "");
      setAdditionalInfo(selectedLocationObject.additionalInfo || "");
    }
  }, [selectedLocationObject]);

  const handleManualLocationSave = () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all required fields (House Number, City, and Pincode)');
      return;
    }

    // Create address parts array and filter out empty values
    const addressParts = [
      houseNumber.trim(),
      district.trim(),
      city.trim(),
      pincode.trim(),
      additionalInfo.trim()
    ].filter(part => part); // Remove empty strings
    
    const formattedAddress = addressParts.join(', ');
    
    // Create location object
    const locationObj = {
      houseNumber: houseNumber.trim(),
      district: district.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      additionalInfo: additionalInfo.trim()
    };
    
    
    setManualLocation(formattedAddress);
    updateSelectedLocation(formattedAddress);
    updateSelectedLocationObject(locationObj);
    
    // Navigate back to cart with updated location
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Detailed Address Form */}
        <View style={styles.detailedForm}>
          <Text style={styles.formTitle}>Enter Detailed Address</Text>
          <Text style={styles.formSubtitle}>
            Fields marked with <Text style={styles.requiredAsterisk}>*</Text> are required
          </Text>
          
          {/* Show prefill indicator if form has existing data */}
          {(selectedLocationObject && Object.keys(selectedLocationObject).length > 0) && (
            <View style={styles.prefillIndicator}>
              <Ionicons name="information-circle" size={16} color="#3898B3" />
              <Text style={styles.prefillText}>Form prefilled with saved location data</Text>
            </View>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>
              House Number <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={houseNumberRef}
              style={[
                styles.textInput,
                !houseNumber.trim() && styles.invalidInput
              ]}
              value={houseNumber}
              onChangeText={setHouseNumber}
              placeholder="Enter house/flat number"
              onSubmitEditing={() => focusNextField(roadRef)}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Area/District</Text>
            <TextInput
              ref={districtRef}
              style={styles.textInput}
              value={district}
              onChangeText={setDistrict}
              placeholder="Enter area/district"
              onSubmitEditing={() => focusNextField(cityRef)}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>
              City <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={cityRef}
              style={[
                styles.textInput,
                !city.trim() && styles.invalidInput
              ]}
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              onSubmitEditing={() => focusNextField(pincodeRef)}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>
              Pincode <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={pincodeRef}
              style={[
                styles.textInput,
                !pincode.trim() && styles.invalidInput
              ]}
              value={pincode}
              onChangeText={setPincode}
              placeholder="Enter pincode"
              keyboardType="numeric"
              maxLength={6}
              onSubmitEditing={() => focusNextField(additionalInfoRef)}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Additional Info</Text>
            <TextInput
              ref={additionalInfoRef}
              style={[styles.textInput, styles.additionalInfoInput]}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholder="Landmark, floor, etc."
              multiline
              numberOfLines={2}
              returnKeyType="done"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton, 
            styles.confirmButton,
            !isFormValid() && styles.disabledButton
          ]}
          onPress={handleManualLocationSave}
          disabled={!isFormValid()}
        >
          <Text style={[
            styles.confirmButtonText,
            !isFormValid() && styles.disabledButtonText
          ]}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    borderColor: '#3898B3',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 20,
  },
  currentLocationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3898B3',
    fontWeight: '500',
  },
  locationInputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  detailedForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  prefillIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#3898B3',
  },
  prefillText: {
    fontSize: 14,
    color: '#3898B3',
    marginLeft: 8,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  requiredAsterisk: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  invalidInput: {
    borderColor: '#FFB3B3',
    backgroundColor: '#FFF8F8',
  },
  additionalInfoInput: {
    textAlignVertical: 'top',
    minHeight: 60,
  },
  saveFormButton: {
    backgroundColor: '#3898B3',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveFormButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#3898B3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  disabledButtonText: {
    color: '#999',
  },
});
