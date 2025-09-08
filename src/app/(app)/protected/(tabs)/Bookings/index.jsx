import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import AppHeader from '../../../../../components/common/AppHeader';

import getbookings from '../../../../../data/getdata/getbookings';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Bookings() {
  const router = useRouter();
  const { view } = useLocalSearchParams();
  const [bookings, setbookings] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];



  useEffect(() => {
    const getbookingsdata = async () => {
      const { arr, error } = await getbookings(); // ✅ use arr, not data
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setbookings(arr); // ✅ directly set array
      setLoading(false);
    };

    getbookingsdata();
  }, []);


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
    ? [...bookings].sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime))
    : bookings.filter(booking => booking.status === activeTab).sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Handle different time formats
    if (!timeString) return '';
    
    // If it's already in AM/PM format, return as is
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      return timeString;
    }
    
    // Parse time string (assuming format like "14:30" or "2:30")
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const minute = minutes || '00';
    
    // Convert to 12-hour format
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minute} ${ampm}`;
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

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Bookings"
        showBack
        onBack={() => router.back()}
        rightElement={null}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 4 }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >

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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3898B3" />
              <Text style={styles.loadingText}>Loading bookings...</Text>
            </View>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((item) => (
                <View
                  key={item.id}
                  style={styles.bookingCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.serviceInfo}>
                      <View style={styles.serviceTitleRow}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                        <Text style={styles.service_name}>{item.service_name}</Text>
                      </View>
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
                    <View style={styles.cardBodyLeft}>
                      <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{formatDate(item.date)} at {formatTime(item.time)}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Ionicons name="construct-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{item.provider}</Text>
                      </View>
                    </View>

                    {/* Show OTP on the right side for accepted bookings */}
                    {item.status === 'Accepted' && item.otp && (
                      <View style={styles.otpContainer}>
                        <View style={styles.otpBadge}>
                          <Text style={styles.otpNumber}>{item.otp}</Text>
                        </View>
                        <Text style={styles.otpLabel}>OTP</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <TouchableOpacity
                      style={styles.viewDetailsButton}
                      onPress={() => {
                        // Pass complete booking data as navigation params (excluding id since it's in pathname)
                        const params = {
                          serviceName: item.serviceName || item.service_name,
                          date: item.date,
                          time: item.time,
                          location: item.location,
                          status: item.status,
                          provider: item.provider,
                          price: item.price,
                          category: item.category,
                          contact: item.contact || item.Contact,
                          description: item.description,
                          otp: item.otp,
                          taskMaster: JSON.stringify(item.taskMaster),
                          estimatedDuration: item.estimatedDuration,
                          paymentMethod: item.paymentMethod,
                          bookingId: item.bookingId,
                          serviceNotes: item.serviceNotes
                        };
                        router.push({
                          pathname: `/protected/(tabs)/Bookings/${item.id}`,
                          params
                        });
                      }}
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
            )
}
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
    paddingTop: 80, // Adjusted for AppHeader height
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3898B3',
    paddingTop: screenHeight * 0.05, // Adjusted padding dynamically
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
    marginRight: 40, // Balance the back button
  },
  headerSubtitle: {
    // headerSubtitle removed - AppHeader has no subheading
  },
  filterButton: {
    padding: 5,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  timelineDay: {
    marginBottom: 18,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  timelineMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3898B3',
    marginRight: 12,
    marginTop: 8,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 12,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#3898B3',
    fontWeight: '600',
    marginRight: 6,
  },
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
  service_name: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardBodyLeft: {
    flex: 1,
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
  otpText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 15,
  },
  otpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  otpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 4,
  },
  otpNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000ff',
    marginLeft: 6,
  },
  otpLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});