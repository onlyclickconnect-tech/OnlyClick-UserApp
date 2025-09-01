import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useCurrentUserDetails from "../../hooks/useCurrentUserDetails";
import useDimension from "../../hooks/useDimensions";

const ProfileHeader = ({ isGeneral = true, setIsGeneral = () => {} }) => {
  const { name, email, profileImage, userId } = useCurrentUserDetails();
  const sliderPosition = useRef(new Animated.Value(isGeneral ? 0 : 1)).current;
  const { screenWidth } = useDimension();
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(name || "User's Name");

  const toggleWidth = Math.min(screenWidth * 0.9, 340);

  const sliderStyle = {
    width: toggleWidth * 0.42,
    transform: [{
      translateX: sliderPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [toggleWidth * 0.03, toggleWidth * 0.45],
      })
    }]
  };

  useEffect(() => {
    Animated.timing(sliderPosition, {
      toValue: isGeneral ? 0 : 1,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isGeneral]);

  const handleProfileImagePress = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose an option to update your profile picture",
      [
        {
          text: "Take Photo",
          onPress: () => {
            // Here you would integrate with camera
            Alert.alert("Camera", "Camera functionality would be implemented here");
          }
        },
        {
          text: "Choose from Gallery",
          onPress: () => {
            // Here you would integrate with image picker
            Alert.alert("Gallery", "Gallery picker functionality would be implemented here");
          }
        },
        {
          text: "Remove Photo",
          onPress: () => {
            // Here you would remove the profile image
            Alert.alert("Remove", "Profile photo removal would be implemented here");
          },
          style: "destructive"
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleNameSave = () => {
    if (userName.trim()) {
      setIsEditingName(false);
      // Here you would typically save to backend
      Alert.alert("Success", "Name updated successfully!");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileIconContainer} onPress={handleProfileImagePress}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <FontAwesome name="user" size={60} color="gray" />
          )}
          <View style={styles.editImageOverlay}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          {isEditingName ? (
            <View style={styles.nameEditContainer}>
              <TextInput
                style={styles.nameInput}
                value={userName}
                onChangeText={setUserName}
                autoFocus
                maxLength={50}
              />
              <View style={styles.nameEditActions}>
                <TouchableOpacity onPress={handleNameSave}>
                  <Ionicons name="checkmark" size={20} color="#0097B3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setUserName(name || "User's Name");
                  setIsEditingName(false);
                }}>
                  <Ionicons name="close" size={20} color="#FF4D4F" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingName(true)}>
              <Text style={styles.username}>{userName}</Text>
              <Ionicons name="pencil" size={14} color="#0097B3" style={styles.editIcon} />
            </TouchableOpacity>
          )}
          <Text style={styles.userid}>ID: {userId || 'N/A'}</Text>
          <Text style={styles.email}>{email || 'No email provided'}</Text>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <Animated.View style={[styles.slider, sliderStyle]} />
        
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setIsGeneral(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, isGeneral && styles.activeToggleText]}>
            General
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setIsGeneral(false)}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, !isGeneral && styles.activeToggleText]}>
            Advanced
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    width: '85%',
    maxWidth: 400,
  },
  profileIconContainer: {
    width: 131,
    height: 131,
    borderRadius: 65.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    position: 'relative',
  },
  profileImage: {
    width: 131,
    height: 131,
    borderRadius: 65.5,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0097B3',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'black',
    marginBottom: 4,
  },
  editIcon: {
    marginLeft: 8,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#0097B3',
    paddingVertical: 4,
  },
  nameEditActions: {
    flexDirection: 'row',
    marginLeft: 8,
    gap: 8,
  },
  userid: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    color: "#666",
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    width: '94%',
    maxWidth: 340,
    height: 66,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
  },

  slider: {
    position: 'absolute',
    height: 51,
    backgroundColor: '#0097B3',
    borderRadius: 38,
    marginTop: 7.5,
    marginLeft: 3,
  },


  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleText: {
    color: '#616161',
    fontSize: 16,
    fontWeight: '500',
  },
  activeToggleText: {
    color: 'white',
  },
});

export default ProfileHeader;