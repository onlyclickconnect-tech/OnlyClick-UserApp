// File: JobRequestCard.js

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useModal } from "../../../context/ModalProvider";
// Dummy job request data
const jobRequest = {
  image: "https://via.placeholder.com/300x150.png?text=Wire+Repair", // Replace with actual image if needed
  title: "Urgent Help Needed – Wire Snapped in Living Room",
  description:
    "Hey, I need an electrician asap. One of the wires behind my TV unit just snapped—probably from wear and tear. The power's gone from two plug points, and I'm worried it might be risky. Please send someone who can fix internal wiring and check for safety issues.",
  location: "LH-1, VIT-AP University, Inavolu, AP Secretariat",
  preferredTime: "3:00 PM - 7:00 PM",
};

export default function JobRequestCard() {
  const { setIsEnterAmountModalOpen } = useModal();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image */}
      <Image source={{ uri: jobRequest.image }} style={styles.image} />

      {/* Title */}
      <Text style={styles.title}>{jobRequest.title}</Text>

      {/* Description */}
      <Text style={[styles.description, { lineHeight: 25 }]}>
        {jobRequest.description}
      </Text>

      {/* Location */}
      <View
        style={{
          gap: 10,
          borderWidth: 1,
          borderColor: "#b3b3b3",
          paddingVertical: 10,
          paddingHorizontal: 5,
          borderRadius: 10,
          top: 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="location-outline" size={18} color="red" />
            <Text style={{ fontWeight: "bold" }}>Location:</Text>
          </View>
          <Text style={styles.infoText}>{jobRequest.location}</Text>
        </View>

        {/* Preferred Time */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="time-outline" size={18} color="red" />
            <Text style={{ fontWeight: "bold" }}>Preferred Time:</Text>
          </View>
          <Text style={styles.infoText}>{jobRequest.preferredTime}</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.acceptBtn}
        onPress={() => {
          setIsEnterAmountModalOpen(true);
        }}
      >
        <Text style={styles.acceptText}>ACCEPT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.declineBtn}>
        <Text style={styles.declineText}>DECLINE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  acceptBtn: {
    backgroundColor: "#3898b3",
    top: 20,
    paddingVertical: 12,
    borderRadius: 15,
    marginRight: 8,
    alignItems: "center",
  },
  declineBtn: {
    borderColor: "red",
    borderWidth: 1.5,
    paddingVertical: 12,
    top: 25,
    borderRadius: 15,
    alignItems: "center",
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  declineText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
});
