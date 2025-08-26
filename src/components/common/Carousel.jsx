import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Carousel({ data, autoPlay = true, interval = 3000, showIndicators = true, imageMode = 'cover', showCaptions = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(screenWidth);
  const [containerHeight, setContainerHeight] = useState(200);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (autoPlay && data.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % data.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * containerWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, data.length]);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const renderCarouselItem = (item, index) => (
    <View key={index} style={[styles.slide, { width: containerWidth, height: containerHeight }]}> 
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={[styles.carouselImage, { width: containerWidth, height: containerHeight }]} resizeMode={imageMode} />
        {showCaptions && item.subtitle ? (
          <View style={styles.overlay} pointerEvents="none">
            <View>
              <Text style={styles.carouselTitle}>{item.title || ''}</Text>
              <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );

  const renderIndicators = () => (
    <View style={styles.indicatorContainerAbsolute} pointerEvents="none">
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            {
              backgroundColor: currentIndex === index ? '#0097b3' : '#ccc',
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View
      style={[styles.container, { width: containerWidth }]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width && width !== containerWidth) setContainerWidth(width);
        if (height && height !== containerHeight) setContainerHeight(height);
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={[styles.scrollView, { width: containerWidth }]}
      >
        {data.map((item, index) => renderCarouselItem(item, index))}
      </ScrollView>
      {showIndicators && data.length > 1 && renderIndicators()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  width: screenWidth,
  },
  scrollView: {
  width: screenWidth,
  },
  slide: {
  position: 'relative',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  carouselImage: {
  width: '100%',
  height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  carouselTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carouselSubtitle: {
    color: 'white',
    fontSize: 14,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicatorContainerAbsolute: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  carouselTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  carouselSubtitle: {
    color: 'white',
    fontSize: 13,
  },
});
