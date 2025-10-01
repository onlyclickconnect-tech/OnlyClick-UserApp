import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import api from "../../app/api/api.js";
import Text from "../ui/Text";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSentMessage, setEmailSentMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "terms" or "privacy"

  const handleLogin = async () => {
    setError("");
    setEmailSentMessage("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {

      const response = await api.post("/api/v1/auth", {
        email,
      });

      setEmailSentMessage("An email is sent, please verify in email");
      setEmailSent(true);
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

  const openTermsModal = (type) => {
    setModalType(type);
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
    setModalType("");
  };

  // Terms Modal Component
  const TermsModal = () => {
    const getModalContent = () => {
      if (modalType === "terms") {
        return {
          title: "Terms of Service",
          content: `Welcome to OnlyClick! By using our service, you agree to the following terms:

1. Service Description
OnlyClick connects you with verified Task Masters for home and workspace services including electrical work, plumbing, carpentry, cleaning, painting, and AC services.

2. User Responsibilities
- Provide accurate information when booking services
- Respect Task Masters and maintain professional communication
- Pay for services as agreed upon booking

3. Task Master Standards
All Task Masters are verified, trained professionals committed to quality service and customer satisfaction.

4. Payment Terms
Payments are processed securely through our platform. Service fees are clearly communicated before booking confirmation.

5. Cancellation Policy
Cancellations made 24 hours before service time are eligible for full refund. Late cancellations may incur fees.

6. Liability
OnlyClick facilitates connections but is not responsible for service quality. Users should verify work satisfaction before final payment.

7. Privacy
Your personal information is protected and used only for service facilitation as outlined in our Privacy Policy.

8. Service Modifications
We reserve the right to modify or discontinue services with reasonable notice.

By using OnlyClick, you acknowledge that you have read, understood, and agree to these terms.`
        };
      } else if (modalType === "privacy") {
        return {
          title: "Privacy Policy",
          content: `Your privacy is important to us. This policy explains how OnlyClick collects, uses, and protects your information:

1. Information We Collect
- Email address for account creation and communication
- Profile information (name, phone, address) for service matching
- Location data for finding nearby Task Masters
- Booking history and preferences for service improvement

2. How We Use Your Information
- Facilitate connections between users and Task Masters
- Send service-related notifications and updates
- Improve our platform and service quality
- Ensure platform security and prevent fraud

3. Information Sharing
We only share your information with:
- Task Masters you book services with (necessary contact details)
- Payment processors for secure transactions
- Legal authorities when required by law

4. Data Security
We implement industry-standard security measures to protect your personal information including encryption and secure servers.

5. Data Retention
We retain your information only as long as necessary for service provision and legal requirements.

6. Your Rights
You have the right to:
- Access your personal information
- Correct inaccurate data
- Request data deletion (subject to legal requirements)
- Opt-out of marketing communications

7. Cookies and Tracking
We may use cookies and similar technologies to improve your experience and analyze platform usage.

8. Third-Party Services
Our app may contain links to third-party services. We are not responsible for their privacy practices.

9. Children's Privacy
Our service is not intended for children under 13. We do not knowingly collect information from children.

10. Changes to This Policy
We may update this policy periodically. Significant changes will be communicated to users.

For questions about this privacy policy, please contact us through the app.`
        };
      }
      return { title: "", content: "" };
    };

    const { title, content } = getModalContent();

    return (
      <Modal visible={showTermsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.termsModalContainer}>
            <View style={styles.termsModalHeader}>
              <Text style={styles.termsModalTitle}>{title}</Text>
              <TouchableOpacity
                onPress={closeTermsModal}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.termsModalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.termsModalText}>{content}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.termsModalButton}
              onPress={closeTermsModal}
              activeOpacity={0.8}
            >
              <Text style={styles.termsModalButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.content}>
      <TermsModal />
      
      {emailSentMessage ? (
        <View style={styles.emailSentContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.emailSentText}>{emailSentMessage}</Text>
        </View>
      ) : null}
      
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
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
              if (emailSentMessage) {
                setEmailSentMessage("");
                setEmailSent(false);
              }
            }}
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

      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
            {acceptTerms && (
              <Ionicons name="checkmark" size={14} color="#fff" />
            )}
          </View>
          <Text style={styles.termsText}>
            I agree to the{" "}
            <Text style={styles.termsLink} onPress={() => openTermsModal("terms")}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={styles.termsLink} onPress={() => openTermsModal("privacy")}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.signInButton, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : emailSent ? (
          <Text style={styles.signInButtonText}>Email Sent</Text>
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
  emailSentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  emailSentText: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
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
  termsContainer: {
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 0,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#2082AA",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#2082AA",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "#2082AA",
    fontWeight: "600",
  },
  // Terms Modal Styles
  termsModalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    maxHeight: "100%",
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  termsModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  termsModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  termsModalContent: {
    padding: 20,
    maxHeight: 400,
  },
  termsModalText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    paddingBottom: 40,
  },
  termsModalButton: {
    backgroundColor: "#2082AA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    margin: 20,
    marginTop: 10,
  },
  termsModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
