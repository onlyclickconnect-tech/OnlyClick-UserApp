import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../../app/api/api";
import Text from "../ui/Text";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      api.post(
        "https://jqkb8s0g-5500.inc1.devtunnels.ms/api/v1/auth",
        {
          email,
        }
      );

      Alert.alert("Check your email", "Magic link sent!");
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


  return (
    <View style={styles.content}>
      <Text style={styles.title}>Login to your account</Text>

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
          <Text style={styles.signInButtonText}>Send Magic Link</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
    color: "#333",
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
});
