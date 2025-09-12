import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../app/api/api.js";
import SuccessIndicator from "../common/SuccessIndicator";
import Text from "../ui/Text";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-close success modal after 2 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleLogin = async () => {
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {


      const response = await api.post("/api/v1/auth", {
        email,
      });

      setShowSuccessModal(true);
    } catch (err) {


      if (err.response) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Success Modal Component
  const SuccessModal = () => {
    return (
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <SuccessIndicator
              title="Email Sent!"
              subtitle="Check your inbox"
              message="We've sent an email. Click the link to sign in to your account."
              iconColor="#2082AA"
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.content}>
      <SuccessModal />
      <Text style={styles.title}>Create/Login to your account</Text>

      <View style={styles.inputContainer}>
        <View
          style={[
            styles.emailInputWrapper,
            error ? styles.emailInputError : null,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color="#666"
            style={styles.emailIcon}
          />
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.signInButton, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signInButtonText}>Proceed</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 0.4,
    paddingHorizontal: 30,
    paddingTop: 0,
    marginTop: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
    color: "#333",
    textAlign: "left",
  },
  inputContainer: {
    marginBottom: 20,
  },
  emailInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  emailInputError: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFF5F5",
  },
  emailIcon: {
    marginRight: 12,
  },
  emailInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 16,
    color: "#333",
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  signInButton: {
    backgroundColor: "#2082AA",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#2082AA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    margin: 20,
    maxWidth: 400,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
