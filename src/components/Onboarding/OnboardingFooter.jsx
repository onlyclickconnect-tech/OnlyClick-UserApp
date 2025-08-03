import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

const OnboardingFooter = ({ onNext, onSkip, isLastSlide }) => {
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true,
      delay: 600
    }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.footer,
      {
        opacity: buttonAnim,
        transform: [{
          translateY: buttonAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })
        }]
      }
    ]}>
      <TouchableOpacity onPress={onSkip}>
        <Text style={styles.skipButton}>Skip</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={onNext}
      >
        <Text style={styles.nextButtonText}>
          {isLastSlide ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  skipButton: {
    color: '#8C8C8C',
    fontSize: 16,
    padding: 12,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#3898b3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingFooter;