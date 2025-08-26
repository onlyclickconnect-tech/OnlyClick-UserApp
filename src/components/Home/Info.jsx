import { StyleSheet, Text, View } from "react-native";
import useCurrentUserDetails from "../../hooks/useCurrentUserDetails";
import useDimension from "../../hooks/useDimensions";
import Carousel from "../common/Carousel";

export default function Info() {
  const { screenHeight, screenWidth } = useDimension();
  
  // Sample carousel data - you can replace with your actual data
  const carouselData = [
    {
      id: 1,
      subtitle: "First carousel item description",
      image: require('../../../assets/images/carousal1.jpg'), // Replace with your actual image
    },
    {
      id: 2, 
      subtitle: "Second carousel item description",
      image: require('../../../assets/images/carousal2.jpg'), // Replace with your actual image
    },
    {
      id: 3,
      subtitle: "Third carousel item description", 
      image: require('../../../assets/images/carousal3.jpg'), // Replace with your actual image
    },
  ];
  const styles = StyleSheet.create({
    container: {
      height: screenHeight * 0.35,
      top: 10,
      width: "100%",
      paddingHorizontal: 12,
    },
    carouselContainer: {
      marginTop: 15,
      overflow: 'hidden',
      height: screenHeight * 0.33,
      width: '100%',
      alignSelf: 'center',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
  });
  const { name, service, userId, profileImage, reviews, ratings } =
    useCurrentUserDetails();
    
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: '500' }}>Hello, User</Text>
      
      <View style={styles.carouselContainer}>
        <Carousel 
          data={carouselData}
          autoPlay={true}
          interval={3000}
          showIndicators={true}
          imageMode={'cover'}
          showCaptions={false}
        />
      </View>
    </View>
  );
}
