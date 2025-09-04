import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import AppHeader from '../../../../../components/common/AppHeader';
import PressableScale from '../../../../../components/common/PressableScale';
import {
  allServices,
  getServicesByCategory,
  serviceCategories
} from "../../../../../data/servicesData";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function ServicesPage() {
  const router = useRouter();
  const { selectedCategory: categoryParam } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const ITEM_CARD_HEIGHT = 170 + 16; // card height + marginBottom

  // Transform service categories for the UI with proper counts
  const categories = [
    { id: 'all', name: 'All', icon: 'apps', count: allServices.length, color: '#3898B3' },
    ...serviceCategories.map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      count: getServicesByCategory(cat.id).length,
      color: cat.color
    }))
  ];

  // Filter categories to show only those with services available
  const filteredCategories = categories.filter(category => category.count > 0);

  // Handle category selection from navigation params
  useEffect(() => {
    if (categoryParam) {
      // Find the category by ID and set its name
      const category = serviceCategories.find(cat => cat.id === categoryParam);
      if (category) {
        setSelectedCategory(category.name);
      }
    }
  }, [categoryParam]);

  // Use imported services data
  const services = allServices;

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Handle category filtering - convert category names to match our data structure
    let categoryMatches = false;
    if (selectedCategory === 'All') {
      categoryMatches = true;
    } else {
      // Map UI category names to our data structure
      const categoryMapping = {
        'Electrical': 'electrical',
        'Plumbing': 'plumbing', 
        'Carpentry': 'carpentry',
        'Cleaning': 'cleaning',
        'AC Service': 'ac_service',
        'Consultation': 'consultation'
      };
      const mappedCategory = categoryMapping[selectedCategory] || selectedCategory.toLowerCase();
      categoryMatches = service.category === mappedCategory;
    }
    
    return matchesSearch && categoryMatches;
  });

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.name);
    // Scroll to top when category changes
    if (category.name !== selectedCategory) {
      // Optional: Add scroll to top functionality here if needed
    }
  };

  const addToCart = (service) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.serviceId === service.serviceId);
    
    if (existingItem) {
      // Update quantity if item exists
      setCartItems(cartItems.map(item => 
        item.serviceId === service.serviceId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...service, quantity: 1 }]);
    }
    
    // Show success feedback (you can customize this)
    alert(`${service.title} added to cart!`);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Popular': return '#FF6B35';
      case 'Best Seller': return '#28A745';
      case 'Trusted': return '#3898B3';
      case 'New': return '#DC3545';
      case 'Quick': return '#FFC107';
      case 'Premium': return '#6F42C1';
      case 'Same Day': return '#17A2B8';
      case 'Emergency': return '#DC3545';
      case 'Quick Service': return '#FFC107';
      case 'Quick Fix': return '#FD7E14';
      case 'Professional': return '#6610F2';
      case 'Essential': return '#198754';
      case 'Modern': return '#0D6EFD';
      case 'Space Saver': return '#6F42C1';
      case 'Weather Resistant': return '#0DCAF0';
      case 'Decorative': return '#D63384';
      case 'Repair': return '#FD7E14';
      default: return '#6C757D';
    }
  };

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === item.name && styles.selectedCategoryCard
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={[styles.categoryIconContainer]}>
        <Image
          source={getCategoryImage(item.id)}
          style={{ width: 84, height: 84 }}
          resizeMode="contain"
        />
      </View>
      {/* <Text style={[
        styles.categoryName,
        selectedCategory === item.name && styles.selectedCategoryName
      ]}>
        {item.name}
      </Text> */}
      <Text style={styles.categoryCount}>
        {item.count} services
      </Text>
    </TouchableOpacity>
  );

  // Memoized service card for performance
  const ServiceCard = React.memo(function ServiceCard({ item }) {
    return (
      <PressableScale style={styles.serviceCard} onPress={() => { /* open details if needed */ }}>
        <View style={styles.cardContentHorizontal}>
          <View style={styles.serviceDetailsLeft}>
            <View>
              <Text style={styles.serviceName} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.serviceCategory}>{item.subCategory}</Text>
            </View>

            <Text style={styles.serviceDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.bottomRow}>
              <View style={styles.priceRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.currentPrice}>₹{item.price}</Text>
                  {item.originalPrice && <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>}
                </View>

                <View style={styles.ratingInline}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingTextSmall}>{item.rating || 0.0}</Text>
                </View>
              </View>

              <View style={styles.controlsRight}>
                <PressableScale style={styles.addToCartButton} onPress={() => addToCart(item)}>
                  <Ionicons name="cart-outline" size={16} color="#fff" />
                </PressableScale>
              </View>
            </View>
          </View>

          <View style={styles.serviceImageContainer}>
            <Image
              source={item.image || { uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png" }}
              style={styles.serviceImage}
              resizeMode="cover"
              onError={e => console.log(e.nativeEvent?.error)}
            />
          </View>
        </View>
      </PressableScale>
    );
  });

  ServiceCard.displayName = 'ServiceCard';

  const getCategoryImage = (categoryId) => {
    const imageMap = {
      'electrical': require("../../../../../../assets/images/electrical.png"),
      'plumbing': require("../../../../../../assets/images/plumbing.png"),
      'carpentry': require("../../../../../../assets/images/carpentry.png"),
      'cleaning': require("../../../../../../assets/images/cleaning.png"),
      'ac_service': require("../../../../../../assets/images/ACservices.png"),
      'consultation': require("../../../../../../assets/images/painting.png"),
    };
    return imageMap[categoryId] || require("../../../../../../assets/images/allServices.png");
  };

  const renderItem = ({ item }) => <ServiceCard item={item} />;

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <AppHeader
        title="Services"
        showBack
        onBack={() => router.back()}
        rightElement={
          <PressableScale style={styles.cartButton} onPress={() => router.push('/(modal)/cart')}>
            <View style={styles.cartIconContainer}>
              <Ionicons name="cart" size={24} color="#fff" />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </PressableScale>
        }
      />

      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={(item, index) => `service-${item.serviceId}-${index}`}
        getItemLayout={(data, index) => (
          {length: 170 + 16, offset: (170 + 16) * index, index}
        )}
        ListHeaderComponent={
          <View>
            {/* Search Bar */}
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity>
                    <Ionicons name="filter" size={20} color="#3898B3" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                data={filteredCategories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              />
            </View>

            {/* Services Section Header */}
            <View style={styles.servicesSection}>
              <View style={styles.servicesSectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'All' ? 'All Services' : `${selectedCategory} Services`}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#DDD" />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with different keywords
            </Text>
          </View>
        }
  initialNumToRender={6}
  windowSize={5}
  removeClippedSubviews={false}
  maxToRenderPerBatch={6}
  updateCellsBatchingPeriod={50}
  contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
    </View>
  );
}

ServicesPage.displayName = 'ServicesPage';

export default ServicesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3898B3',
    paddingTop: screenHeight * 0.06, // Adjusted padding dynamically
    paddingBottom: screenHeight * 0.03, // Adjusted padding dynamically
    borderBottomLeftRadius: screenWidth * 0.08, // Dynamic radius
    borderBottomRightRadius: screenWidth * 0.08, // Dynamic radius
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  cartButton: {
    padding: 5,
    marginLeft: 10,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // headerSubtitle removed - AppHeader has no subheading
  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  // spacing adjusted to sit closer under AppHeader
  marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  categoriesSection: {
    marginTop: 25,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    minWidth: 90,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategoryCard: {
    borderColor: '#3898B3',
    backgroundColor: '#F0F8FF',
  },
  categoryIconContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedCategoryName: {
    color: '#3898B3',
  },
  categoryCount: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  servicesSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  servicesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3898B3',
    fontWeight: '600',
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  serviceRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  serviceCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  marginBottom: 16,
  marginHorizontal: 16,
  height: 170,
  elevation: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#F0F0F0',
  padding: 0,
  },
  cardContentHorizontal: {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 140,
  },
  serviceDetailsLeft: {
  flex: 1,
  paddingVertical: 14,
  paddingLeft: 16,
  justifyContent: 'space-between',
  paddingRight: 12,
  },
  serviceBadge: {
  // removed
  },
  badgeText: {
  // removed
  },
  serviceImageContainer: {
  position: 'relative',
  width: 120,
  height: 165,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  overflow: 'hidden',
  alignSelf: 'center',
  },
  serviceImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  },
  imageOverlay: {
  // removed
  },
  favoriteButton: {
  // removed
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  ratingTextSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
    marginLeft: 6,
  },
  metricsCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  addToCartButton: {
    backgroundColor: '#3898B3',
    padding: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    lineHeight: 22,
  },
  serviceCategory: {
    fontSize: 11,
    color: '#3898B3',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  featureText: {
    fontSize: 9,
    color: '#3898B3',
    fontWeight: '500',
  },
  serviceMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 2,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 2,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28A745',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  addToCartButton: {
    backgroundColor: '#3898B3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 0,
    marginTop: -8,
    zIndex: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
