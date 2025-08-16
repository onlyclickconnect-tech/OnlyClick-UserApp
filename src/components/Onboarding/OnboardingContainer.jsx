import { useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import OnboardingFooter from './OnboardingFooter';
import OnboardingHeader from './OnboardingHeader';
import OnboardingSlide from './OnboardingSlide';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: "Need help at your home or workspace?",
    description: "Electricians, Plumbers, Carpenters, Cleaners, Painters, and AC Experts — all in one place.\nTrained, verified, and just a tap away., we connect you with trusted Task Masters near you.\nTrained, verified, and ready to help — fast.",
    image: require('../../../assets/images/onboard1.png')
  },
  {
    title: "Book with ease and confidence.",
    description: "See real-time availability, pricing, and track your booking from start to finish.\nNo endless follow-ups. No confusion.\nJust tap, and we’ll handle the rest.",
    image: require('../../../assets/images/onboard2.png')
  },
  {
    title: "Professional service at your doorstep.",
    description: "We call them Task Masters for a reason.\nYou get reliable service, they get the respect they deserve.\nIt’s more than work. It’s pride.",
    image: require('../../../assets/images/onboard3.png')
  }
];

const OnboardingContainer = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const footerRef = useRef(null);

  // Unified completion function
  const handleComplete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onComplete();
    });
  };

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      handleComplete();
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentSlide(prev => prev + 1);
      
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handlePrevious = () => {
    if (currentSlide === 0) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentSlide(prev => prev - 1);
      
      fadeAnim.setValue(0);
      slideAnim.setValue(-50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  // Create PanResponder for swipe gestures - recreate when currentSlide changes
  const panResponder = useMemo(() => 
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Disable swiping completely on the last slide
        if (currentSlide === slides.length - 1) {
          return false;
        }
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Optional: Add visual feedback during swipe
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        
        // Swipe left (next slide)
        if (dx < -50) {
          handleNext();
        }
        // Swipe right (previous slide)
        else if (dx > 50) {
          handlePrevious();
        }
      },
    }), [currentSlide, handleNext, handlePrevious]);

  return (
    <View style={styles.container}>
      <OnboardingHeader />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <OnboardingSlide 
          title={slides[currentSlide].title}
          description={slides[currentSlide].description}
          image={slides[currentSlide].image}
        />
      </Animated.View>
      
      <OnboardingFooter 
        ref={footerRef}
        onNext={handleNext}
        onComplete={handleComplete}
        currentSlide={currentSlide}
        totalSlides={slides.length}
        isLastSlide={currentSlide === slides.length - 1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: width * 0.01, // 1% of screen width for padding
    paddingVertical: height * 0.01, // 1% of screen height for padding
  },
});

export default OnboardingContainer;