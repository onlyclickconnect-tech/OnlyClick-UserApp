import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getServiceById } from "../../../../../data/servicesData";

export default function ServiceDetails() {
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  // Get service data from servicesData.js
  const service = getServiceById(serviceId);

  // Handle case where service is not found
  if (!service) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Not Found</Text>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Service with ID "{serviceId}" not found</Text>
          <TouchableOpacity 
            style={styles.backToServicesButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backToServicesText}>Back to Services</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    Alert.alert(
      'Added to Cart! 🛒',
      `${service.title} has been added to your cart.`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => router.back()
        },
        {
          text: 'View Cart',
          onPress: () => router.push("/(modal)/cart")
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.category.charAt(0).toUpperCase() + service.category.slice(1)}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Image */}
        <View style={styles.imageContainer}>
          <Image source={service.image} style={styles.serviceImage} />
          {service.tags && service.tags.length > 0 && (
            <View style={styles.tagContainer}>
              {service.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Service Content */}
        <View style={styles.serviceContent}>
          {/* Service Title */}
          <Text style={styles.serviceName}>{service.title}</Text>
          
          
          {/* Service Description */}
          <Text style={styles.serviceDescription}>{service.description}</Text>

          {/* Rating and Reviews */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingSection}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{service.rating}</Text>
              <Text style={styles.reviewsText}>({service.reviews} reviews)</Text>
            </View>
            <View style={styles.durationSection}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.durationText}>{service.duration}</Text>
            </View>
          </View>

          
          
          

          {/* Professional Info */}
          {service.professional && (
            <View style={styles.professionalSection}>
              <Text style={styles.sectionTitle}>👨‍🔧 Professional</Text>
              <Text style={styles.professionalText}>{service.professional}</Text>
            </View>
          )}

          {/* Included Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Included</Text>
            {service.includes && service.includes.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Not Included Section */}
          {service.notIncluded && service.notIncluded.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>❌ Not included</Text>
              {service.notIncluded.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Add bottom padding to ensure content doesn't get hidden behind fixed button */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomCurrentPrice}>₹{service.price}</Text>
          {service.originalPrice && service.originalPrice > service.price && (
            <Text style={styles.bottomOriginalPrice}>₹{service.originalPrice}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={addToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 5,
    marginRight: 10,
  },
  shareButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tagContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  priceTag: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#00BCD4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priceTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  serviceContent: {
    padding: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  durationSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  priceSection: {
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 20,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  professionalSection: {
    marginBottom: 20,
  },
  professionalText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginTop: 8,
    marginRight: 12,
  },
  listItemText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    lineHeight: 22,
  },
  priceSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  finalPriceLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    borderRadius: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomPadding: {
    height: 200,
  },
  bottomPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomCurrentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bottomOriginalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    marginLeft: 15,
    minHeight: 50,
  },
  cartIcon: {
    marginRight: 10,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToServicesButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToServicesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
