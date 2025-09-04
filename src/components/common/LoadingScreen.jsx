import React from 'react'
import { View, ActivityIndicator, Text } from 'react-native';

const LoadingScreen = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F9FAFB", // light background
            }}
        >
            <ActivityIndicator size="large" color="#2CA6A4" />
            <Text
                style={{
                    marginTop: 12,
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#374151", // dark gray text
                }}
            >
                Loading...
            </Text>
        </View>
    );

}

export default LoadingScreen
