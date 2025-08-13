import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function Bookings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

  // Mock booking data
  const bookings = [
    {
      id: 1,
      serviceName: 'Plumbing Repair',
      date: '2025-08-08',
      time: '10:00 AM',
      location: '123 Main Street, Downtown',
      status: 'Pending',
      provider: 'AquaFix Services',
      price: 299,
      category: 'Plumbing',
      bookingTime: '2025-08-06 14:30',
      maskedContact: '+91 *****43210'
    },
    {
      id: 2,
      serviceName: 'Electrical Installation',
      date: '2025-08-09',
      time: '2:00 PM',
      location: '456 Oak Avenue, Uptown',
      status: 'Accepted',
      provider: 'PowerPro Electricians',
      price: 599,
      category: 'Electrical',
      bookingTime: '2025-08-05 11:15',
      maskedContact: '+91 *****32109'
    },
    {
      id: 3,
      serviceName: 'AC Maintenance',
      date: '2025-08-05',
      time: '9:00 AM',
      location: '789 Pine Street, Midtown',
      status: 'Completed',
      provider: 'CoolAir Services',
      price: 450,
      category: 'AC Repair',
      bookingTime: '2025-08-03 16:45',
      maskedContact: '+91 *****67890'
    },
    {
      id: 4,
      serviceName: 'Cleaning Service',
      date: '2025-08-07',
      time: '11:00 AM',
      location: '321 Elm Drive, Southside',
      status: 'Cancelled',
      provider: 'SparkleClean Co.',
      price: 200,
      category: 'Cleaning',
      bookingTime: '2025-08-04 09:20',
      maskedContact: '+91 *****54321'
    },
    {
      id: 5,
      serviceName: 'Garden Maintenance',
      date: '2025-08-10',
      time: '8:00 AM',
      location: '654 Maple Road, Northside',
      status: 'Pending',
      provider: 'GreenThumb Gardens',
      price: 350,
      category: 'Gardening',
      bookingTime: '2025-08-06 13:10',
      maskedContact: '+91 *****98765'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'Accepted': return '#4CAF50';
      case 'Completed': return '#2196F3';
      case 'Cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return 'time-outline';
      case 'Accepted': return 'checkmark-circle-outline';
      case 'Completed': return 'checkmark-done-circle';
      case 'Cancelled': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const filteredBookings = activeTab === 'All' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderTabButton = (tab, index) => {
    const isActive = activeTab === tab;
    
    return (
      <View key={tab} style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            isActive && styles.activeTabButton
          ]}
          onPress={() => setActiveTab(tab)}
          activeOpacity={1}
        >
          <View style={styles.tabContent}>
            <Text style={[
              styles.tabText,
              isActive && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBookingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
    >
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={14} 
            color="white" 
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{formatDate(item.date)} at {item.time}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.provider}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>₹{item.price}</Text>
        <TouchableOpacity 
        style={styles.viewDetailsButton} 
        onPress={() => router.push(`/protected/(tabs)/Bookings/${item.id}`)}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#3898B3" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Bookings</Text>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialIcons name="filter-list" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Track and manage your service appointments</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Prominent OTP Notice */}
        {/* <View style={styles.otpNoticeContainer}>
          <View style={styles.otpNoticeCard}>
            <View style={styles.otpNoticeHeader}>
              <View style={styles.otpNoticeIconContainer}>
                <Ionicons name="shield-checkmark" size={24} color="#fff" />
              </View>
              <View style={styles.otpNoticeContent}>
                <Text style={styles.otpNoticeTitle}>🔐 OTP Verification Required</Text>
                <Text style={styles.otpNoticeText}>
                  For your security, service providers will send an OTP during service delivery. Please verify the OTP to confirm service completion.
                </Text>
              </View>
            </View>
            <View style={styles.otpNoticeFooter}>
              <Ionicons name="information-circle" size={16} color="#3898B3" />
              <Text style={styles.otpNoticeFooterText}>
                No OTP verification needed during booking - only at service completion
              </Text>
            </View>
          </View>
        </View> */}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {tabs.map((tab, index) => renderTabButton(tab, index))}
          </ScrollView>
        </View>

        {/* Bookings List */}
        <View style={styles.listContainer}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((item) => (
              <View
                key={item.id}
                style={styles.bookingCard}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Ionicons 
                      name={getStatusIcon(item.status)} 
                      size={14} 
                      color="white" 
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{formatDate(item.date)} at {item.time}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="business-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.provider}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => router.push(`/protected/(tabs)/Bookings/${item.id}`)}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color="#3898B3" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#DDD" />
              <Text style={styles.emptyTitle}>No bookings found</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'All' 
                  ? 'You haven\'t made any bookings yet' 
                  : `No ${activeTab.toLowerCase()} bookings`}
              </Text>
            </View>
          )}
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
  scrollContent: {
    paddingTop: 120, // Height of the fixed header
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
    marginRight: 40, // Balance the back button
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F4F8',
    textAlign: 'center',
    opacity: 0.9,
  },
  filterButton: {
    padding: 5,
  },
  // otpNoticeContainer: {
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 20,
  //   paddingVertical: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E5E5E5',
  //   marginTop: 20,
  // },
  // otpNoticeCard: {
  //   backgroundColor: 'linear-gradient(135deg, #4A90E2 0%, #3898B3 100%)',
  //   backgroundColor: '#4A90E2',
  //   borderRadius: 12,
  //   padding: 16,
  //   elevation: 3,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.15,
  //   shadowRadius: 6,
  // },
  // otpNoticeHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-start',
  //   marginBottom: 12,
  // },
  // otpNoticeIconContainer: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.2)',
  //   borderRadius: 20,
  //   padding: 8,
  //   marginRight: 12,
  // },
  // otpNoticeContent: {
  //   flex: 1,
  // },
  // otpNoticeTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#fff',
  //   marginBottom: 6,
  // },
  // otpNoticeText: {
  //   fontSize: 14,
  //   color: '#fff',
  //   lineHeight: 20,
  //   opacity: 0.9,
  // },
  // otpNoticeFooter: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingTop: 12,
  //   borderTopWidth: 1,
  //   borderTopColor: 'rgba(255, 255, 255, 0.2)',
  // },
  // otpNoticeFooterText: {
  //   fontSize: 12,
  //   color: '#fff',
  //   marginLeft: 6,
  //   fontWeight: '500',
  //   opacity: 0.8,
  // },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 15,
    marginTop: 10,
  },
  tabsContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  tabContainer: {
    marginRight: 12,
  },
  tabButton: {
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    width: 85,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#3898B3',
  },
  tabContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100, // Extra space at the bottom
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3898B3',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#3898B3',
    fontWeight: '500',
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
