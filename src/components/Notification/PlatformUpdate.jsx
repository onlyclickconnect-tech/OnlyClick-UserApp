import { ScrollView, StyleSheet, View } from "react-native";
import PlatformUpdateBox from "./PlatformUpdateBox";

export default function PlatformUpdate() {
  const notifications = [
    {
      title: "New Services Added! 🎉",
      description:
        "We've added Electrical Services and HVAC Repair to our platform. Book now with trusted professionals in your area.",
      date: "Today",
      image: "https://picsum.photos/200/300",
    },
    {
      title: "Weekend Discounts Available 💰",
      description:
        "Get 15% off on all home cleaning and gardening services booked for this weekend. Limited time offer!",
      date: "Yesterday",
      image: "https://picsum.photos/201/301",
    },
    {
      title: "App Update - Version 2.1 📱",
      description:
        "New features: Real-time booking tracking, instant messaging with service providers, and improved payment options.",
      date: "2 days ago",
      image: "https://picsum.photos/202/302",
    },
    {
      title: "Safety Guidelines Updated 🛡️",
      description:
        "We've updated our safety protocols. All service providers are now required to follow enhanced safety measures for your protection.",
      date: "1 week ago",
      image: "https://picsum.photos/201/301",
    },
    {
      title: "Customer Referral Program 🎁",
      description:
        "Refer friends and earn credits! Get ₹100 credit for every successful referral. Share your unique referral code now.",
      date: "1 week ago",
      image: "https://picsum.photos/201/301",
    },
  ];
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          top: 20,
          alignItems: "center",
        }}
      >
        {notifications.map((notification, index) => (
          <PlatformUpdateBox key={index} notification={notification} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
