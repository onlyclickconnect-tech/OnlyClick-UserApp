import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import Text from "../../../../../components/ui/Text"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import AppHeader from '../../../../../components/common/AppHeader';


export default function BookingDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasLoadedRef = useRef(false);

  // Gesture handling for modals
  const modalY = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical gestures at the top of the modal
        return Math.abs(gestureState.dy) > 5 && gestureState.y0 < 100;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && 
               Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          modalY.setValue(gestureState.dy);
          modalOpacity.setValue(1 - gestureState.dy / 300);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Close modal with animation
          Animated.parallel([
            Animated.timing(modalY, {
              toValue: screenHeight,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowCancellationModal(false);
            modalY.setValue(0);
            modalOpacity.setValue(1);
          });
        } else {
          // Reset position with animation
          Animated.parallel([
            Animated.timing(modalY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Reset if gesture is terminated
        Animated.parallel([
          Animated.timing(modalY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(modalOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const handleCancellation = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Handle cancellation logic
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
            router.back();
          }
        }
      ]
    );
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

  // Load booking data from params instead of API calls
  useEffect(() => {
    // Prevent multiple loads
    if (hasLoadedRef.current) return;

    const loadBookingDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if booking data was passed from previous screen
        if (params.serviceName) {
          // Get the ID from the route parameter
          const bookingId = parseInt(params.id) || 1;
          
          const bookingFromParams = {
            id: bookingId,
            serviceName: params.serviceName,
            date: params.date,
            time: params.time,
            location: params.location,
            status: params.status,
            provider: params.provider,
            price: parseFloat(params.price) || 0,
            category: params.category,
            contact: params.contact,
            description: params.description,
            otp: parseInt(params.otp),
            taskMaster: params.taskMaster ? JSON.parse(params.taskMaster) : {
              name: params.provider,
              contact: params.contact,
              photo: 'https://via.placeholder.com/150'
            },
            estimatedDuration: params.estimatedDuration || '1-2 hours',
            paymentMethod: params.paymentMethod || 'Cash on Delivery',
            bookingId: params.bookingId || `BK${bookingId.toString().padStart(10, '0')}`,
            serviceNotes: params.serviceNotes || 'Our technician will call 15 minutes before arrival.',
            bookingTime: params.date
          };

          setBooking(bookingFromParams);
          setOtp(bookingFromParams.otp.toString());
        } else {
          // If no complete booking data passed, show error
          throw new Error("Incomplete booking data provided. Please go back and try again.");
        }
      } catch (err) {
        console.error("Error loading booking details:", err);
        setError(err.message || "Failed to load booking details");
      } finally {
        setLoading(false);
        hasLoadedRef.current = true;
      }
    };

    if (params.serviceName && !hasLoadedRef.current) {
      loadBookingDetails();
    }
  }, []); // Empty dependency array to run only once

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

  const getStatusMessage = (status) => {
    switch (status) {
      case 'Pending': return 'A Service Provider will be assigned to you soon.';
      case 'Accepted': return 'Your Service Provider is on the way!';
      case 'Completed': return 'Service completed successfully';
      case 'Cancelled': return 'This booking has been cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            // Handle cancellation logic
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
            router.back();
          }
        }
      ]
    );
  };

  const CancellationRulesModal = () => (
    <Modal visible={showCancellationModal} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
        <Animated.View 
          style={[styles.modalContent, { transform: [{ translateY: modalY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Gesture Indicator Bar - Enhanced touch area */}
          <TouchableOpacity 
            style={styles.gestureIndicator}
            activeOpacity={1}
            onPress={() => {}} // Empty onPress to ensure touch area
          >
            <View style={styles.indicatorBar} />
          </TouchableOpacity>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cancellation Rules</Text>
            <TouchableOpacity onPress={() => setShowCancellationModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.rulesContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.policyIntro}>
              At Only Click, we strive to provide seamless and professional service at all times. However, we understand that sometimes cancellations are necessary. Our cancellation policy is designed to be fair to both our valued customers and our service providers.
            </Text>
            
            <Text style={styles.sectionTitle}>1. Cancellation by Customer</Text>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>Free Cancellation:</Text> You can cancel your service appointment free of charge up to 2 hours before the scheduled service time.
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>Late Cancellations:</Text> If you cancel within 2 hours of the scheduled appointment, a cancellation fee of 50% of the total service fee will be charged. This helps us cover the costs incurred by the service provider's time and travel.
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>No-Show:</Text> If you fail to be present at the scheduled appointment time or do not inform us of your cancellation in advance, a full cancellation fee (100% of the service cost) will apply.
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>Emergency Situations:</Text> In case of an emergency or unforeseen event (e.g., hospitalization, urgent personal matters), please inform us as soon as possible. We will assess each case on an individual basis and make necessary accommodations.
              </Text>
            </View>
            
            <Text style={styles.sectionTitle}>2. Cancellation by Only Click or Service Provider</Text>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>Service Provider Unavailability:</Text> If a service provider is unable to attend to the scheduled task due to personal reasons, bad weather, or any other unforeseeable situation, Only Click will promptly inform you and offer an alternative time slot or a different provider, subject to availability.
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.boldText}>Right to Cancel:</Text>
              <Text style={styles.policyText}> Only Click reserves the right to cancel or reschedule the service if the provider cannot reach the location due to unforeseen circumstances like traffic, roadblocks, etc., after prior communication with the customer.</Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>Refunds:</Text> In case the service is canceled by us or the service provider, full refunds will be issued to the customer within 7 working days.
              </Text>
            </View>
            
            <Text style={styles.sectionTitle}>3. How to Cancel</Text>
            <Text style={styles.policyText}>
              You can cancel your appointment via the Only Click app, or by calling our customer support team at <Text style={styles.contactText}>+91-9121377419</Text> or emailing <Text style={styles.contactText}>onlyclick.connect@gmail.com</Text>.
            </Text>
            <Text style={styles.policyText}>
              For cancellations made via customer support, please provide your booking details, including the service type, provider name, and scheduled time.
            </Text>
            
            <Text style={styles.sectionTitle}>4. Refunds</Text>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>Refunds for cancellations made before the 2-hour cutoff will be processed immediately.</Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>For late cancellations or no-shows, refunds will not be applicable, and the cancellation fee will be charged.</Text>
            </View>
            
            <Text style={styles.sectionTitle}>5. Special Cases</Text>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>Bulk Bookings & B2B Services:</Text> For bulk bookings (gated communities, commercial spaces, etc.), cancellations must be made at least 48 hours prior to the scheduled service, failing which a 20% cancellation fee will be applied.
              </Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.policyText}>
                <Text style={styles.boldText}>Holiday/Peak Time Bookings:</Text> During high-demand periods (holidays, special events, etc.), a higher cancellation fee may be applicable due to increased demand and scheduling complexity.
              </Text>
            </View>
            
            <Text style={styles.sectionTitle}>6. Customer Support</Text>
            <Text style={styles.policyText}>
              For any questions or concerns about the cancellation policy or if you require assistance with rescheduling, please contact our customer support team via the app or at <Text style={styles.contactText}>+91-9121377419</Text>.
            </Text>
            
            <Text style={styles.policyFooter}>
              By placing a booking, you agree to adhere to this cancellation policy. We appreciate your understanding and cooperation.
            </Text>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => setShowCancellationModal(false)}
          >
            <Text style={styles.confirmButtonText}>I Understand</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Shared App Header */}
      <AppHeader
        title="Booking Details"
        showBack={true}
        onBack={() => router.back()}
      />

      {/* Main Content Area */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3898B3" />
            <Text style={styles.loadingText}>Loading booking details...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
            <Text style={styles.errorTitle}>Failed to Load Booking</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
                // Re-load data from params
                const loadBookingDetails = async () => {
                  try {
                    if (params.serviceName) {
                      const bookingFromParams = {
                        id: parseInt(params.id) || 1,
                        serviceName: params.serviceName,
                        date: params.date,
                        time: params.time,
                        location: params.location,
                        status: params.status,
                        provider: params.provider,
                        price: parseFloat(params.price) || 0,
                        category: params.category,
                        contact: params.contact,
                        description: params.description,
                        otp: parseInt(params.otp) || Math.floor(1000 + Math.random() * 9000),
                        taskMaster: params.taskMaster ? JSON.parse(params.taskMaster) : {
                          name: params.provider,
                          contact: params.contact,
                          photo: 'https://via.placeholder.com/150'
                        },
                        estimatedDuration: params.estimatedDuration || '1-2 hours',
                        paymentMethod: params.paymentMethod || 'Cash on Delivery',
                        bookingId: params.bookingId || `BK${(parseInt(params.id) || 1).toString().padStart(10, '0')}`,
                        serviceIncludes: params.serviceIncludes ? JSON.parse(params.serviceIncludes) : [
                          params.serviceName,
                          'Professional service',
                          'Quality assurance',
                          'Post-service cleanup'
                        ],
                        serviceNotes: params.serviceNotes || 'Our technician will call 15 minutes before arrival.',
                        bookingTime: params.date
                      };
                      setBooking(bookingFromParams);
                    } else {
                      throw new Error("No booking data available");
                    }
                  } catch (err) {
                    console.error("Error loading booking details:", err);
                    setError("Failed to load booking details. Please go back and try again.");
                  } finally {
                    setLoading(false);
                    hasLoadedRef.current = true;
                  }
                };
                loadBookingDetails();
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Booking Content - Only show when data is loaded */}
        {booking && !loading && booking.serviceName && (
          <View>


        {/* Service Header */}
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.scheduledTime}>
            {formatDate(booking.date)} at {formatTime(booking.time)}
          </Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
              <Ionicons 
                name={getStatusIcon(booking.status)} 
                size={16} 
                color="white" 
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>{booking.status}</Text>
            </View>
          </View>
          <Text style={styles.statusMessage}>{getStatusMessage(booking.status)}</Text>
        </View>

        {/* Service Provider Details */}
        {booking.taskMaster && (booking.status === 'Accepted' || booking.status === 'Completed') && (
          <View style={styles.providerDetailsContainer}>
            <Text style={styles.sectionTitle}>Service Provider</Text>
            <View style={styles.providerDetails}>
              <Image source={{ uri: booking.taskMaster.photo }} style={styles.providerPhoto} />
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{booking.taskMaster.name}</Text>
                <Text style={styles.providerContact}>{booking.taskMaster.contact}</Text>
              </View>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => {
                  const phoneNumber = booking.taskMaster.contact;
                  Linking.openURL(`tel:${phoneNumber}`);
                }}
              >
                <Ionicons name="call-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* OTP Display Section */}
        {booking.status === 'Accepted' && (
          <View style={styles.otpDisplayContainer}>
            <Text style={styles.sectionTitle}>Your OTP</Text>
            <Text style={styles.otpCode}>{booking.otp}</Text>
            <Text style={styles.otpInstruction}>Please share this OTP with the service provider upon arrival.</Text>
          </View>
        )}

        

        {/* Booking Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Booking Information</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#3898B3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>
                {formatDate(booking.date)} at {formatTime(booking.time)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#3898B3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{booking.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#3898B3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Contact Info</Text>
              <Text style={styles.infoValue}>{booking.contact}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="construct" size={20} color="#3898B3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Service Provider</Text>
              <Text style={styles.infoValue}>{booking.provider}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#3898B3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estimated Duration</Text>
              <Text style={styles.infoValue}>{booking.estimatedDuration}</Text>
            </View>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          
          <View style={styles.descriptionSection}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.description}>{booking.description}</Text>
          </View>

          

          {booking.serviceNotes && (
            <View style={styles.notesSection}>
              <Text style={styles.infoLabel}>Important Notes</Text>
              <Text style={styles.notes}>{booking.serviceNotes}</Text>
            </View>
          )}
        </View>

        {/* Payment Information */}
        <View style={booking.status === 'Completed' ? styles.infoCardCompleted : styles.infoCard}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Service Charge</Text>
            <Text style={styles.paymentAmount}>₹{booking.price}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <Text style={styles.paymentMethod}>{booking.paymentMethod}</Text>
          </View>
        </View>

        {/* Cancellation Rules */}
        {(booking.status === 'Accepted' || booking.status === 'Pending') && (
          <View style={styles.cancellationCard}>
            <TouchableOpacity 
              style={styles.cancellationHeader}
              onPress={() => setShowCancellationModal(true)}
            >
              <View style={styles.cancellationTitleRow}>
                <MaterialIcons name="policy" size={20} color="#F44336" />
                <Text style={styles.cancellationTitle}>Cancellation Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.cancellationHighlight}>
              Free cancellation up to 2 hours before scheduled time
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {(booking.status === 'Pending' || booking.status === 'Accepted') && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelBooking}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}
          </View>
        )}


      </ScrollView>

      <CancellationRulesModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  serviceHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginTop: screenHeight * 0.01,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  scheduledTime: {
    fontSize: 16,
    color: '#666',
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  statusHeader: {
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  statusMessage: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
    infoCardCompleted: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 50,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  includesSection: {
    marginBottom: 20,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  includeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  notesSection: {},
  notes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3898B3',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3898B3',
  },
  paymentMethod: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  cancellationCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  cancellationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cancellationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancellationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  cancellationHighlight: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 100,
    paddingHorizontal: 20,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3898B3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  rulesContent: {
    maxHeight: 300,
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginLeft: 12,
  },
  ruleTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  confirmButton: {
    backgroundColor: '#3898B3',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Provider Details Styles
  providerDetailsContainer: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  providerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  providerContact: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  // OTP Display Styles
  otpDisplayContainer: {
    marginBottom: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  otpCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3898B3',
    marginVertical: 4,
  },
  otpInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // Cancellation Policy Modal Styles
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  gestureIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 10,
  },
  indicatorBar: {
    width: 100,
    height: 5,
    marginTop: -15,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  rulesContent: {
    maxHeight: 400,
    marginBottom: 20,
  },
  policyIntro: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3898B3',
    marginTop: 15,
    marginBottom: 10,
  },
  policyItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 5,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#3898B3',
    marginRight: 8,
    marginTop: 2,
  },
  policyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  contactText: {
    color: '#3898B3',
    textDecorationLine: 'underline',
  },
  policyFooter: {
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
