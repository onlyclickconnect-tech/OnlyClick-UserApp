import { useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import OnboardingFooter from './OnboardingFooter';
import OnboardingHeader from './OnboardingHeader';
import OnboardingSlide from './OnboardingSlide';

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

  const handleNext = () => {
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
      setCurrentSlide(prev => {
        const nextSlide = prev < slides.length - 1 ? prev + 1 : prev;
        if (nextSlide === prev) onComplete();
        return nextSlide;
      });
      
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

  const handleSkip = () => onComplete();

  return (
    <View style={styles.container}>
      <OnboardingHeader />
      
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        <OnboardingSlide 
          title={slides[currentSlide].title}
          description={slides[currentSlide].description}
          image={slides[currentSlide].image}
        />
      </Animated.View>
      
      <OnboardingFooter 
        onNext={handleNext}
        onSkip={handleSkip}
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
  },
});

export default OnboardingContainer;