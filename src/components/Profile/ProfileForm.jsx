import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useModal } from '../../context/ModalProvider';
import { useUpdateProfile } from '../../hooks/seeUpdateProfile';
import useCurrentUserDetails from "../../hooks/useCurrentUserDetails";
import LoadinScreen from '../common/LoadingScreen';
import SuccessModal from '../common/SuccessModal';

const screenWidth = Dimensions.get("window").width;

const ProfileForm = ({ onValidationChange, onSave }) => {
  const { name, email, userAddress, phone, profileImage, _id, reviews, ratings, userId, service } = useCurrentUserDetails();
  const { setIsSuccessModalOpen } = useModal();

  const [formData, setFormData] = useState({
    fullName: name || '',
    email: email || '',
    phone: phone || '',
    address: userAddress || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loadingspin, setLoadingspin] = useState(false)

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange && onValidationChange(isValid);
    return isValid;
  };

  // Only validate after user has interacted with the form
  useEffect(() => {
    if (hasInteracted) {
      validateForm();
    }
  }, [formData, hasInteracted]);

  // Check if form is initially valid (for first-time users)
  useEffect(() => {
    const isInitiallyValid = formData.fullName.trim() && 
                           (formData.email.trim() === '' || /\S+@\S+\.\S+/.test(formData.email)) && 
                           formData.phone.trim() && 
                           formData.address.trim();
    onValidationChange && onValidationChange(isInitiallyValid);
  }, []);

  const animateLabel = (fieldName, toValue) => {
    // Simplified - no animation needed
  };

  const handleInputFocus = (name) => {
    // Simplified - no animation needed
  };

  const handleInputBlur = (name) => {
    // Simplified - no animation needed
  };

  const handleInputChange = (name, value) => {
    setHasInteracted(true); // Mark that user has interacted with the form
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      return updatedForm;
    });
  };
  const [refreshKey, setRefreshKey] = useState(0);
   const { updateProfile, loading, error } = useUpdateProfile();

  const handleSave = async () => {
    setLoadingspin(true);
    if (!validateForm()) return; // optional, validate before saving
    setIsSaving(true);

    // Map frontend formData keys to backend table columns
    const updates = {
      full_name: formData.fullName,
      email: formData.email,
      address: formData.address,
    };

    const result = await updateProfile(updates);
    console.log("result", result)
    if (result?.data?.updated) {
      setIsSuccessModalOpen(true);
      setIsEditing(false);
      setRefreshKey((prev) => prev + 1);
    } else {
      alert("Failed to update profile");
    }
    setLoadingspin(false)
    setIsSaving(false);
  };


  const handleCancel = () => {
    setFormData({
      fullName: name || '',
      email: email || '',
      phone: phone || '',
      address: userAddress || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const renderInputField = (name, icon, placeholder, keyboardType = 'default', additionalProps = {}) => (
    <View style={styles.inputGroup}>
      <FontAwesome name={icon} size={18} color="#0097B3" style={styles.icon} />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors[name] && styles.inputError, name === "phone" ? styles.inputBlur : null]}
          value={formData[name]}
          onChangeText={(text) => handleInputChange(name, text)}
          onFocus={() => setHasInteracted(true)} // Mark interaction on focus
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#808080"
          editable={name === "phone" ? false : isEditing}
          {...additionalProps}
        />
        {hasInteracted && errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
      </View>
    </View>
  );

  if (loadingspin) return <LoadinScreen />;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Profile Details</Text>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={20} color="#0097B3" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderInputField("fullName", "user", "Full Name")}
          {renderInputField(
            "email",
            "envelope",
            "Email Address (Optional)",
            "email-address",
            { autoCapitalize: "none" }
          )}
          {renderInputField("phone", "phone", "Phone Number", "phone-pad")}

          {/* Address Information */}
          <Text style={styles.sectionTitle}>Permanent Address Information</Text>
          {renderInputField(
            "address",
            "map-marker",
            "Complete Address",
            "default",
            { multiline: true }
          )}
        </View>
      </View>
      <SuccessModal />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#0097B3',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#0097B3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  icon: {
    marginLeft: 16,
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF4D4F',
    backgroundColor: '#FFF5F5',
  },
  inputBlur: {
    opacity: 0.7,
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default ProfileForm;