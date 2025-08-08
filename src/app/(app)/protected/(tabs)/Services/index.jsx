import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);

  // Service categories with counts
  const categories = [
    { id: 1, name: 'All', icon: 'apps', count: 24, color: '#3898B3' },
    { id: 2, name: 'Plumbing', icon: 'water', count: 6, color: '#2196F3' },
    { id: 3, name: 'Electrical', icon: 'flash', count: 4, color: '#FF9800' },
    { id: 4, name: 'Cleaning', icon: 'home', count: 5, color: '#4CAF50' },
    { id: 5, name: 'AC Service', icon: 'snow', count: 3, color: '#9C27B0' },
    { id: 6, name: 'Carpentry', icon: 'hammer', count: 4, color: '#795548' },
    { id: 7, name: 'Painting', icon: 'color-palette', count: 2, color: '#E91E63' },
  ];

  // Featured services data
  const services = [
    {
      id: 1,
      name: 'Professional Plumbing',
      category: 'Plumbing',
      description: 'Expert pipe repair, installation and maintenance',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 156,
      duration: '1-2 hours',
      image: require("../../../../../../assets/images/react-logo.png"),
      badge: 'Popular',
      features: ['Quick Service', 'Warranty', 'Expert Technician'],
    },
    {
      id: 2,
      name: 'Deep House Cleaning',
      category: 'Cleaning',
      description: 'Complete home cleaning and sanitization',
      price: 599,
      originalPrice: 799,
      rating: 4.9,
      reviews: 234,
      duration: '3-4 hours',
      image: require("../../../../../../assets/images/react-logo.png"),
      badge: 'Best Seller',
      features: ['Eco-friendly', 'Insured', 'Same Day'],
    },
    {
      id: 3,
      name: 'Electrical Repair',
      category: 'Electrical',
      description: 'Safe electrical installation and repair services',
      price: 199,
      originalPrice: 299,
      rating: 4.7,
      reviews: 189,
      duration: '1-3 hours',
      image: require("../../../../../../assets/images/react-logo.png"),
      badge: 'Trusted',
      features: ['Licensed', '24/7 Support', 'Safety First'],
    },
    {
      id: 4,
      name: 'AC Installation & Repair',
      category: 'AC Service',
      description: 'Professional AC installation and maintenance',
      price: 899,
      originalPrice: 1199,
      rating: 4.6,
      reviews: 98,
      duration: '2-4 hours',
      image: require("../../../../../../assets/images/react-logo.png"),
      badge: 'New',
      features: ['All Brands', 'Warranty', 'Expert Team'],
    },
    {
      id: 5,
      name: 'Furniture Assembly',
      category: 'Carpentry',
      description: 'Professional furniture assembly and repair',
      price: 149,
      originalPrice: 199,
      rating: 4.5,
      reviews: 67,
      duration: '1-2 hours',
      image: require("../../../../../../assets/images/react-logo.png"),
      badge: 'Quick',
      features: ['Fast Service', 'Tool Included', 'Assembly Expert'],
    },
    {
      id: 6,
      name: 'Wall Painting Service',
      category: 'Painting',
      description: 'Professional interior and exterior painting',
      price: 449,
      originalPrice: 599,
      rating: 4.4,
      reviews: 45,
      duration: '1 Day',
      image: require("../../../../../../assets/images/react-logo.png"),
      badge: 'Premium',
      features: ['Quality Paint', 'Clean Work', 'Color Consultation'],
    },
  ];

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    const existingItem = cartItems.find(item => item.id === service.id);
    
    if (existingItem) {
      // Update quantity if item exists
      setCartItems(cartItems.map(item => 
        item.id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...service, quantity: 1 }]);
    }
    
    // Show success feedback (you can customize this)
    alert(`${service.name} added to cart!`);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Popular': return '#FF6B35';
      case 'Best Seller': return '#28A745';
      case 'Trusted': return '#3898B3';
      case 'New': return '#DC3545';
      case 'Quick': return '#FFC107';
      case 'Premium': return '#6F42C1';
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
      <View style={[styles.categoryIconContainer, { backgroundColor: item.color }]}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color="#fff" 
        />
      </View>
      <Text style={[
        styles.categoryName,
        selectedCategory === item.name && styles.selectedCategoryName
      ]}>
        {item.name}
      </Text>
      <Text style={styles.categoryCount}>
        {item.count} services
      </Text>
    </TouchableOpacity>
  );

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => router.push(`/protected/(tabs)/Services/${item.id}`)}
      activeOpacity={0.8}
    >
      {/* Service Badge */}
      <View style={[styles.serviceBadge, { backgroundColor: getBadgeColor(item.badge) }]}>
        <Text style={styles.badgeText}>{item.badge}</Text>
      </View>

      {/* Service Image */}
      <View style={styles.serviceImageContainer}>
        <Image source={item.image} style={styles.serviceImage} />
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Content */}
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.serviceCategory}>{item.category}</Text>
        </View>

        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {item.features.slice(0, 2).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Rating and Duration */}
        <View style={styles.serviceMetrics}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>

        {/* Price and Book Button */}
        <View style={styles.serviceFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>₹{item.price}</Text>
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            <Ionicons name="cart" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Services</Text>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => router.push('/(modal)/cart')}
            >
              <View style={styles.cartIconContainer}>
                <Ionicons name="cart" size={24} color="#fff" />
                {cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Professional home services at your doorstep</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
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
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Services List */}
        <View style={styles.servicesSection}>
          <View style={styles.servicesSectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'Featured Services' : `${selectedCategory} Services`}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Services Grid */}
          <View style={styles.servicesContainer}>
            {filteredServices.length > 0 ? (
              filteredServices.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.serviceCard}
                  onPress={() => router.push(`/protected/(tabs)/Services/${item.id}`)}
                  activeOpacity={0.8}
                >
                  {/* Service Badge */}
                  <View style={[styles.serviceBadge, { backgroundColor: getBadgeColor(item.badge) }]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>

                  {/* Service Image */}
                  <View style={styles.serviceImageContainer}>
                    <Image source={item.image} style={styles.serviceImage} />
                    <View style={styles.imageOverlay}>
                      <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Service Content */}
                  <View style={styles.serviceContent}>
                    <View style={styles.serviceHeader}>
                      <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.serviceCategory}>{item.category}</Text>
                    </View>

                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {item.description}
                    </Text>

                    {/* Features */}
                    <View style={styles.featuresContainer}>
                      {item.features.slice(0, 2).map((feature, index) => (
                        <View key={index} style={styles.featureTag}>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Rating and Duration */}
                    <View style={styles.serviceMetrics}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                        <Text style={styles.reviewsText}>({item.reviews})</Text>
                      </View>
                      <View style={styles.durationContainer}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.durationText}>{item.duration}</Text>
                      </View>
                    </View>

                    {/* Price and Add to Cart Button */}
                    <View style={styles.serviceFooter}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.currentPrice}>₹{item.price}</Text>
                        <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.addToCartButton}
                        onPress={() => addToCart(item)}
                      >
                        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                        <Ionicons name="cart" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#DDD" />
                <Text style={styles.emptyTitle}>No services found</Text>
                <Text style={styles.emptySubtitle}>
                  Try searching with different keywords
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#3898B3',
    paddingTop: 45,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F4F8',
    opacity: 0.9,
    textAlign: 'center',
  },
  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
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
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
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
    fontSize: 10,
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
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  serviceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  serviceImageContainer: {
    position: 'relative',
    height: 140,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 12,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 12,
    color: '#3898B3',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  featureText: {
    fontSize: 10,
    color: '#3898B3',
    fontWeight: '500',
  },
  serviceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28A745',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addToCartButton: {
    backgroundColor: '#3898B3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
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
