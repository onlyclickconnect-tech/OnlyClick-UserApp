import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from "../ui/Text"
const OnboardingFooter = forwardRef(function OnboardingFooter({ onNext, onComplete, currentSlide, totalSlides, isLastSlide, isTransitioning, isCompleting }, ref) {
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true,
      delay: 600
    }).start();
  }, []);

  const handleButtonPress = () => {
    // Prevent button press during transition or completion
    if (isTransitioning || isCompleting) {
      return;
    }

    if (isLastSlide) {
      onComplete();
    } else {
      onNext();
    }
  };

  // Expose the button press function to parent component
  useImperativeHandle(ref, () => ({
    pressButton: handleButtonPress
  }));

  const renderDots = () => {
    // Hide dots on the last slide
    if (isLastSlide) {
      return null;
    }
    
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentSlide ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Animated.View style={[
      styles.footer,
      isLastSlide && styles.footerLastSlide, // Add special styling for last slide
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
      {renderDots()}
      
      <TouchableOpacity 
        style={[
          styles.nextButton,
          isLastSlide && styles.getStartedButton, // Add special styling for last slide button
          (isTransitioning || isCompleting) && styles.disabledButton // Add disabled styling
        ]} 
        onPress={handleButtonPress}
        disabled={isTransitioning || isCompleting}
      >
        {(isTransitioning || isCompleting) ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={[styles.nextButtonText, styles.loadingText]}>
              {isCompleting ? 'Starting...' : 'Loading...'}
            </Text>
          </View>
        ) : (
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  footerLastSlide: {
    bottom: 50, // More space from bottom when no dots
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3898b3',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
  nextButton: {
    backgroundColor: '#3898b3',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  getStartedButton: {
    paddingHorizontal: 50, // Wider button for "Get Started"
    paddingVertical: 18, // Slightly taller
    minWidth: 160, // Wider minimum width
  },
  disabledButton: {
    opacity: 0.6, // Make button appear disabled
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8, // Space between spinner and text
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

OnboardingFooter.displayName = 'OnboardingFooter';
export default OnboardingFooter;