import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SuccessWelcome = ({ onComplete }) => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  
  // Check if we're in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
        return true;
      } else {
        Alert.alert(
          'Location Required',
          'Location access is required to show you nearby services and providers.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      // Check if we're in Expo Go
      const isExpoGo = Constants.appOwnership === 'expo';
      
      if (isExpoGo) {
        // In Expo Go, skip notification permission
        console.log('Skipping notification permission in Expo Go');
        setNotificationGranted(false);
        return true;
      }

      // Only try to import and use notifications in development builds
      const { requestPermissionsAsync } = await import('expo-notifications');
      const { status } = await requestPermissionsAsync();
      
      if (status === 'granted') {
        setNotificationGranted(true);
      }
      return true; // Non-blocking, so always return true
    } catch (error) {
      console.log('Notification permission not available:', error.message);
      setNotificationGranted(false);
      return true; // Non-blocking, so continue even if error
    }
  };

  const handleSetupPermissions = async () => {
    setIsRequestingPermissions(true);

    try {
      // Request location permission (mandatory)
      const locationGranted = await requestLocationPermission();
      
      if (locationGranted) {
        // Request notification permission (optional, but skip in Expo Go)
        await requestNotificationPermission();
        
        // Complete setup regardless of notification permission
        onComplete();
      }
    } catch (error) {
      console.error('Error during permission setup:', error);
      Alert.alert(
        'Setup Error',
        'There was an issue setting up permissions. Please try again.',
        [{ text: 'OK' }]
      );
    }
    
    setIsRequestingPermissions(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Great to have you!</Text>
      <Text style={styles.subtitle}>Let's set up a few permissions to enhance your experience</Text>
      
      <View style={styles.permissionsContainer}>
        <View style={styles.permissionItem}>
          <View style={styles.permissionIcon}>
            <Text style={styles.permissionEmoji}>📍</Text>
          </View>
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Location Access</Text>
            <Text style={styles.permissionDescription}>Find nearby services and providers</Text>
            <Text style={styles.requiredText}>Required</Text>
          </View>
          {locationGranted && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.permissionItem}>
          <View style={styles.permissionIcon}>
            <Text style={styles.permissionEmoji}>🔔</Text>
          </View>
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Notifications</Text>
            <Text style={styles.permissionDescription}>
              {isExpoGo 
                ? 'Available in production builds only' 
                : 'Get updates about your bookings and new services'
              }
            </Text>
            <Text style={styles.optionalText}>
              {isExpoGo ? 'Not available in Expo Go' : 'Optional'}
            </Text>
          </View>
          {notificationGranted && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
          {isExpoGo && (
            <View style={styles.infoIcon}>
              <Text style={styles.infoText}>ℹ️</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.setupButton, isRequestingPermissions && styles.setupButtonDisabled]} 
        onPress={handleSetupPermissions}
        disabled={isRequestingPermissions}
      >
        <Text style={styles.setupButtonText}>
          {isRequestingPermissions ? 'Setting up...' : 'Continue Setup'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3898B3',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  permissionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative',
  },
  permissionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  permissionEmoji: {
    fontSize: 24,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  requiredText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  optionalText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
  },
  setupButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 16,
  },
  setupButtonDisabled: {
    backgroundColor: '#ccc',
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default SuccessWelcome;