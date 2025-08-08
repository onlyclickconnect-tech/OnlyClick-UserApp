import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function CategoryServices() {
  const { categoryName } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock subcategorized services data
  const getServicesForCategory = (category) => {
    const allServices = {
      'Plumbing': [
        {
          id: 1,
          name: 'Pipe Repair & Installation',
          description: 'Complete pipe repair, replacement and new installation services',
          price: 299,
          rating: 4.8,
          reviews: 156,
          duration: '1-2 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 2,
          name: 'Tap & Faucet Services',
          description: 'Tap installation, repair, and faucet replacement services',
          price: 199,
          rating: 4.6,
          reviews: 89,
          duration: '30-60 mins',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 3,
          name: 'Bathroom Plumbing',
          description: 'Complete bathroom plumbing solutions and maintenance',
          price: 499,
          rating: 4.9,
          reviews: 234,
          duration: '2-3 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 4,
          name: 'Kitchen Plumbing',
          description: 'Kitchen sink, dishwasher and appliance plumbing services',
          price: 399,
          rating: 4.7,
          reviews: 178,
          duration: '1-2 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 5,
          name: 'Drain Cleaning',
          description: 'Professional drain cleaning and unclogging services',
          price: 249,
          rating: 4.5,
          reviews: 92,
          duration: '45-90 mins',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 6,
          name: 'Water Heater Services',
          description: 'Water heater installation, repair and maintenance',
          price: 599,
          rating: 4.8,
          reviews: 145,
          duration: '2-4 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        }
      ],
      'Electrical': [
        {
          id: 7,
          name: 'Wiring & Rewiring',
          description: 'Complete electrical wiring and rewiring services',
          price: 799,
          rating: 4.9,
          reviews: 203,
          duration: '3-5 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 8,
          name: 'Switch & Socket Installation',
          description: 'Installation and repair of switches, sockets and outlets',
          price: 149,
          rating: 4.6,
          reviews: 156,
          duration: '30-60 mins',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 9,
          name: 'Fan Installation',
          description: 'Ceiling fan and exhaust fan installation services',
          price: 299,
          rating: 4.7,
          reviews: 189,
          duration: '1-2 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 10,
          name: 'Light Fixture Installation',
          description: 'Professional lighting installation and setup',
          price: 199,
          rating: 4.8,
          reviews: 167,
          duration: '45-90 mins',
          image: require("../../../../../../../assets/images/react-logo.png"),
        }
      ],
      'Cleaning': [
        {
          id: 11,
          name: 'Deep House Cleaning',
          description: 'Complete deep cleaning service for your entire home',
          price: 899,
          rating: 4.9,
          reviews: 345,
          duration: '4-6 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 12,
          name: 'Bathroom Cleaning',
          description: 'Professional bathroom deep cleaning and sanitization',
          price: 299,
          rating: 4.7,
          reviews: 234,
          duration: '1-2 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 13,
          name: 'Kitchen Cleaning',
          description: 'Complete kitchen cleaning including appliances',
          price: 399,
          rating: 4.8,
          reviews: 198,
          duration: '2-3 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 14,
          name: 'Sofa & Carpet Cleaning',
          description: 'Professional upholstery and carpet cleaning service',
          price: 499,
          rating: 4.6,
          reviews: 156,
          duration: '2-3 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        }
      ],
      'AC Service': [
        {
          id: 15,
          name: 'AC Installation',
          description: 'Professional air conditioner installation service',
          price: 1299,
          rating: 4.8,
          reviews: 289,
          duration: '3-4 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 16,
          name: 'AC Repair',
          description: 'Complete AC repair and troubleshooting service',
          price: 599,
          rating: 4.7,
          reviews: 234,
          duration: '1-3 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        },
        {
          id: 17,
          name: 'AC Service & Maintenance',
          description: 'Regular AC servicing and maintenance package',
          price: 399,
          rating: 4.9,
          reviews: 456,
          duration: '1-2 hours',
          image: require("../../../../../../../assets/images/react-logo.png"),
        }
      ]
    };
    
    return allServices[category] || [];
  };

  const services = getServicesForCategory(categoryName);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => router.push(`/protected/(tabs)/Services/${item.id}`)}
    >
      <Image source={item.image} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.serviceFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{item.price}</Text>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName} Services</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${categoryName} services...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Services List */}
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#DDD" />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#3898B3',
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  filterButton: {
    padding: 5,
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  listContainer: {
    padding: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  serviceContent: {
    padding: 15,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3898B3',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#3898B3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
