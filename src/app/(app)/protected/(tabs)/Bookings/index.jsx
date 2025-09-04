import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
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

  // Default to timeline view if no view parameter or view=timeline is passed
  const isTimelineView = !view || view === 'timeline';
  const [activeTab, setActiveTab] = useState(isTimelineView ? 'Timeline' : 'All');

  const tabs = isTimelineView
    ? ['Timeline', 'All', 'Pending', 'Accepted', 'Completed', 'Cancelled']
    : ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];



  useEffect(() => {
    const getbookingsdata = async () => {
      const { arr, error } = await getbookings(); // ✅ use arr, not data
      if (error) {
        console.error(error);
        return;
      }
      setbookings(arr); // ✅ directly set array
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
    ? bookings
    : activeTab === 'Timeline'
      ? [...bookings].sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime))
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
          <View style={styles.serviceTitleRow}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={styles.service_name}>{item.service_name}</Text>
          </View>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={14} color="white" style={styles.statusIcon} />
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
          <Ionicons name="construct-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.provider}</Text>
        </View>

        {activeTab === 'Timeline' && (
          <View style={styles.timelineInfo}>
            <View style={styles.timelineRow}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.timelineText}>
                Booked on {new Date(item.bookingTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        )}
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
          {view === 'timeline' ? (
            // Group bookings by date and render timeline
            (() => {
              const grouped = filteredBookings.reduce((acc, b) => {
                acc[b.date] = acc[b.date] || [];
                acc[b.date].push(b);
                return acc;
              }, {});
              const dates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

              return dates.map(dateKey => (
                <View key={dateKey} style={styles.timelineDay}>
                  <Text style={styles.timelineDate}>{new Date(dateKey).toLocaleDateString()}</Text>
                  {grouped[dateKey].map(item => (
                    <View key={item.id} style={styles.timelineItem}>
                      <View style={styles.timelineMarker} />
                      <View style={styles.timelineCard}>
                        <View style={styles.cardHeader}>
                          <View style={styles.serviceInfo}>
                            <Text style={styles.service_name}>{item.service_name}</Text>
                            <Text style={styles.category}>{item.category}</Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                            <Ionicons name={getStatusIcon(item.status)} size={14} color="white" style={styles.statusIcon} />
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
                    </View>
                  ))}
                </View>
              ));
            })()
          ) : (
            filteredBookings.length > 0 ? (
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
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={16} color="#666" />
                      <Text style={styles.infoText}>{formatDate(item.date)} at {item.time}</Text>
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
            )
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
  timelineInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontStyle: 'italic',
  },
});
