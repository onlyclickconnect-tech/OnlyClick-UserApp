import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppStates } from '../../../../context/AppStates';

export default function MobileNumberScreen() {
  const router = useRouter();
  const { selectedMobileNumber, updateSelectedMobileNumber } = useAppStates();
  
  // Mobile number state management - use context value or default
  const [tempMobileNumber, setTempMobileNumber] = useState(
    selectedMobileNumber && selectedMobileNumber.length === 10 ? selectedMobileNumber : ""
  );

  const handleMobileSave = async () => {
    // Validate mobile number
    const cleanNumber = tempMobileNumber.replace(/[^\d]/g, '');
    if (cleanNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    // Save to context
    await updateSelectedMobileNumber(cleanNumber);
    router.back();
  };

  const formatMobileForDisplay = (number) => {
    // Format 10-digit number as +91 XXXXX XXXXX for display
    if (number.length === 10) {
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
    return `+91 ${number}`;
  };

  const handleNumberChange = (text) => {
    // Remove all non-digit characters and limit to 10 digits
    const cleaned = text.replace(/[^\d]/g, '').slice(0, 10);
    setTempMobileNumber(cleaned);
  };

  return (
    <View style={styles.container}>
      

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3898B3" />
          <Text style={styles.infoText}>
            We'll use this number to contact you about your service booking and send updates.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter your mobile number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              value={tempMobileNumber}
              onChangeText={handleNumberChange}
              placeholder="1234567890"
              keyboardType="phone-pad"
              maxLength={10}
              autoFocus
            />
          </View>
          <Text style={styles.helperText}>
            Enter 10-digit mobile number (without country code)
          </Text>
          
          
        </View>

        <View style={styles.currentNumberCard}>
          <Text style={styles.currentNumberLabel}>Current Number:</Text>
          <Text style={styles.currentNumberValue}>
            {selectedMobileNumber ? formatMobileForDisplay(selectedMobileNumber) : "No number set"}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleMobileSave}
        >
          <Text style={styles.saveButtonText}>Save Number</Text>
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  countryCode: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginLeft: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
  },
  previewNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3898B3',
  },
  currentNumberCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentNumberLabel: {
    fontSize: 14,
    color: '#666',
  },
  currentNumberValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 300,
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
  saveButton: {
    backgroundColor: '#3898B3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
