import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from '../../context/AuthProvider';

const screenWidth = Dimensions.get("window").width;

const AdvancedOptions = () => {
  const { setUser, setIsLoggedIn } = useAuth();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // placeholder: clear auth and navigate to sign in
          setUser(null);
          setIsLoggedIn(false);
          router.replace('/auth/sign-in');
        } }
      ]
    );
  };
  return (
    <View style={styles.container}>
  <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
        <View style={styles.buttonContent}>
          <FontAwesome name="credit-card" size={18} color="#808080" style={styles.icon} />
          <Text style={styles.buttonText}>Bank Details</Text>
        </View>
        <FontAwesome name="chevron-right" size={14} color="#808080" />
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
        <View style={styles.buttonContent}>
          <FontAwesome name="calendar-check-o" size={18} color="#808080" style={styles.icon} />
          <Text style={styles.buttonText}>Subscriptions</Text>
        </View>
        <FontAwesome name="chevron-right" size={14} color="#808080" />
      </TouchableOpacity> */}

  <TouchableOpacity style={styles.optionButton} onPress={() => { router.push('/protected/(tabs)/Bookings?view=timeline'); }}>
        <View style={styles.buttonContent}>
          <FontAwesome name="history" size={18} color="#808080" style={styles.icon} />
          <Text style={styles.buttonText}>Booking History</Text>
        </View>
        <FontAwesome name="chevron-right" size={14} color="#808080" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionButton, styles.deleteButton]} onPress={handleDeleteAccount}>
        <View style={styles.buttonContent}>
          <FontAwesome name="trash" size={18} color="#FF4D4F" style={styles.icon} />
          <Text style={[styles.buttonText, { color: '#FF4D4F' }]}>Delete Account</Text>
        </View>
        <FontAwesome name="chevron-right" size={14} color="#808080" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  optionButton: {
    width: screenWidth * 0.9,
    height: 66,
    borderWidth: 1,
    borderColor: '#8080805c',
    borderRadius: 12,
    paddingHorizontal: 40,
    fontSize: 16,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#808080',
  },
  deleteButton: {
    borderColor: '#FF4D4F',
  },
});

export default AdvancedOptions;