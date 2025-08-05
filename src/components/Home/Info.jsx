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
      image: require('../../../assets/images/carousal1.png'), // Replace with your actual image
    },
    {
      id: 2, 
      subtitle: "Second carousel item description",
      image: require('../../../assets/images/carousal2.png'), // Replace with your actual image
    },
    {
      id: 3,
      subtitle: "Third carousel item description", 
      image: require('../../../assets/images/carousal3.png'), // Replace with your actual image
    },
  ];
  const styles = StyleSheet.create({
    container: {
      height: screenHeight * 0.25,
      top: 10,
      width: "100%",
      paddingHorizontal: 10,
    },
    carouselContainer: {
      marginTop: 15,
      borderRadius: 10,
      overflow: 'hidden',
    },
  });
  const { name, service, userId, profileImage, reviews, ratings } =
    useCurrentUserDetails();
    
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 500 }}>Hello, User</Text>
      
      <View style={styles.carouselContainer}>
        <Carousel 
          data={carouselData}
          autoPlay={true}
          interval={3000}
          showIndicators={true}
        />
      </View>
    </View>
  );
}
