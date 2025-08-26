import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, View } from 'react-native';

const OnboardingSlide = ({ title, description, image }) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: imageAnim,
            transform: [
              {
                translateY: imageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Image 
          source={image}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <LinearGradient
        colors={['#3898B3', '#FFFFFF']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.95 }}
        style={styles.modal}
      >
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {title}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.description,
            {
              opacity: descAnim,
              transform: [
                {
                  translateY: descAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {description}
        </Animated.Text>
      </LinearGradient>
    </View>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing helpers (conservative clamps to preserve layout)
const IMAGE_AREA = Math.round(screenHeight * 0.48);
const MODAL_AREA = Math.round(screenHeight * 0.52);
const IMAGE_WIDTH = Math.round(screenWidth * 0.9);
const IMAGE_HEIGHT = Math.round(IMAGE_AREA * 0.9);
const TITLE_FONT = Math.round(Math.max(20, Math.min(34, screenWidth * 0.065)));
const DESC_FONT = Math.round(Math.max(13, Math.min(18, screenWidth * 0.04)));
const HORIZONTAL_PADDING = Math.round(Math.max(18, screenWidth * 0.06));
const BOTTOM_PADDING = Platform.OS === 'ios' ? 34 : 22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_AREA,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Math.round(-screenHeight * 0.03),
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  modal: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 22,
    paddingBottom: BOTTOM_PADDING + 8,
    height: MODAL_AREA,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: TITLE_FONT,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'left',
    marginBottom: 18,
    lineHeight: Math.round(TITLE_FONT * 1.05),
    letterSpacing: 0.2,
  },
  description: {
    fontSize: DESC_FONT,
    color: '#444',
    textAlign: 'left',
    lineHeight: Math.round(DESC_FONT * 1.6),
    letterSpacing: 0.2,
  },
});

export default OnboardingSlide;