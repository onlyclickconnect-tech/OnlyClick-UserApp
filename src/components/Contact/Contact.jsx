import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Contact = () => {
  return (
    <View style={{position: 'absolute', bottom: 20, right: 15, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{position: 'absolute', bottom: 20, right: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: "#159b77", borderRadius: 50, width: 50, height: 50}}>
      <TouchableOpacity onPress={() => {}}>
        <FontAwesome5 name="headset" size={30} color="white" />
      </TouchableOpacity>
    </View>
      <Text style={{color: 'black', fontSize: 12, right: 5}}>Need help?</Text>
      </View>
  );
};

export default Contact;
