import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Text from "../../../../components/ui/Text.jsx";
import { useAppStates } from '../../../../context/AppStates';
import RazorpayCheckout from 'react-native-razorpay';


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import AppHeader from '../../../../components/common/AppHeader';
import fetchCart from '../../../../data/getdata/getCart';
import { addOneInCart, removeAllFromCart, removeOneFromCart } from '../../../api/cart';
import confirmbookings from '../../../api/confirmbookings.js';
import { confirmRazorpayPayment, createRazorpayOrder } from '../../../api/razoroay.js';

export default function Cart() {
  const router = useRouter();


  const { selectedLocation, updateSelectedLocation, selectedMobileNumber, updateSelectedMobileNumber, selectedLocationObject, updateSelectedLocationObject } = useAppStates();

  // Helper function to format mobile number safely
  const formatMobileNumber = (number) => {
    if (!number || typeof number !== 'string' || number.length < 10) {
      return "Tap to set mobile number";
    }
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
  };

  // Helper function to format location object for display
  const formatLocationDisplay = (locationObj) => {
    if (!locationObj || Object.keys(locationObj).length === 0) {
      return "Tap to set location";
    }

    // Extract and format location parts in proper order
    const parts = [];
    if (locationObj.houseNumber) parts.push(locationObj.houseNumber);
    if (locationObj.district) parts.push(locationObj.district);
    if (locationObj.city) parts.push(locationObj.city);
    if (locationObj.pincode) parts.push(locationObj.pincode);
    if (locationObj.additionalInfo) parts.push(locationObj.additionalInfo);

    return parts.length > 0 ? parts.join(', ') : "Tap to set location";
  };

  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showServiceFeeTooltip, setShowServiceFeeTooltip] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Online Payment');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateItem, setSelectedDateItem] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [service_charge, setSetservice_charge] = useState()
  const [totalTax, setTotalTax] = useState()
  const [total, setTotal] = useState()
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState({});

  const [paymentmethod, setPaymentmethod] = useState();


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
            setShowCancellationPolicy(false);
            setShowPaymentModal(false);
            setShowDateTimeModal(false);
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


  // Interactive kindness reminder
  const [hasClickedKindness, setHasClickedKindness] = useState(false);

  // Auto-hide tooltip after 3 seconds
  useEffect(() => {
    if (showServiceFeeTooltip) {
      const timer = setTimeout(() => {

      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showServiceFeeTooltip]);

  const kindnessMessages = [
    "💧 Offer water to service providers",
    "☕ A cup of tea brightens their day",
    "🙏 Show gratitude for their service",
    "😊 A smile goes a long way",
    "🏠 Keep workspace clean for them"
  ];

  // Helper function to compare dates without time
  // This fixes the issue where selected dates weren't highlighting properly
  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const [dates, setdates] = useState([])
  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
          date: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate().toString().padStart(2, '0'),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          isToday: i === 0,
          isTomorrow: i === 1
        });
      }
      setdates(dates)
    };
    generateDates();
  }, [])


  const timeSlots = [
    { id: 1, time: '09:00 AM', label: 'Morning', available: true },
    { id: 2, time: '10:00 AM', label: 'Morning', available: true },
    { id: 3, time: '11:00 AM', label: 'Morning', available: false },
    { id: 4, time: '12:00 PM', label: 'Afternoon', available: true },
    { id: 5, time: '01:00 PM', label: 'Afternoon', available: true },
    { id: 6, time: '02:00 PM', label: 'Afternoon', available: true },
    { id: 7, time: '03:00 PM', label: 'Afternoon', available: false },
    { id: 8, time: '04:00 PM', label: 'Evening', available: true },
    { id: 9, time: '05:00 PM', label: 'Evening', available: true },
    { id: 10, time: '06:00 PM', label: 'Evening', available: true },
  ];

  const handleKindnessClick = () => {
    setHasClickedKindness(!hasClickedKindness);
  };

  // Mock cart data grouped by category
  // const cartData = [
  //   {
  //     category: 'Plumbing',
  //     items: [
  //       {
  //         id: 1,
  //         name: 'Pipe Repair',
  //         price: 299,
  //         quantity: 1,
  //         duration: '1-2 hours'
  //       },
  //       {
  //         id: 2,
  //         name: 'Tap Installation',
  //         price: 150,
  //         quantity: 2,
  //         duration: '30 min each'
  //       }
  //     ]
  //   },
  //   {
  //     category: 'Electrical',
  //     provider: {
  //       name: 'PowerPro Electricians',
  //       rating: 4.9,
  //       phone: '+91 87654 32109'
  //     },
  //     items: [
  //       {
  //         id: 3,
  //         name: 'Switch Replacement',
  //         price: 199,
  //         quantity: 3,
  //         duration: '20 min each'
  //       }
  //     ]
  //   }
  // ];

  const [cartData, setCartData] = useState([])
  const [rawcart, setRawcart] = useState()

  // Function to fetch cart data from server
  const fetchCartData = async () => {
    const { serviceCharge, tax, arr, phno, address, totalAmount, rawCartData } = await fetchCart();
    setTotal(totalAmount);
    setTotalTax(tax);
    setSetservice_charge(serviceCharge);
    setCartData(arr);
    setRawcart(rawCartData);
    setLocation({ additionalInfo: "", city: "", district: "", houseNumber: address, pincode: "" });
    // Only set mobile number from server if no mobile number is set in AppStates
    if (!selectedMobileNumber && phno) {
      setMobileNumber(phno);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [])

  // Initial setup: set mobile number from AppStates if available
  useEffect(() => {
    if (selectedMobileNumber) {
      setMobileNumber(selectedMobileNumber);
    }
  }, []);

  // Listen for mobile number updates from AppStates context
  useEffect(() => {
    if (selectedMobileNumber) {
      setMobileNumber(selectedMobileNumber);
    }
  }, [selectedMobileNumber]);

  // Listen for location object updates from AppStates context
  useEffect(() => {
    if (selectedLocationObject && Object.keys(selectedLocationObject).length > 0) {
      setLocation(selectedLocationObject);
    }
  }, [selectedLocationObject]);



  // Add separate useEffect to log mobile number state changes
  useEffect(() => {
  }, [mobileNumber]);


  const calculateCategoryTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateGrandTotal = () => {
    return cartData.reduce((total, category) => total + calculateCategoryTotal(category.items), 0);
  };

  // Check if cart is empty or total is 0
  const isCartEmptyOrZero = () => {
    const grandTotal = calculateGrandTotal();
    const totalItems = cartData.reduce((total, cat) => total + cat.items.length, 0);
    return totalItems === 0 || grandTotal === 0;
  };

  const handleQuantityChange = async (categoryIndex, itemIndex, change) => {
    const item = cartData[categoryIndex]?.items[itemIndex];
    if (!item) return;

    setUpdatingItemId(item.service_id);

    try {
      if (change > 0) {
        // Increase quantity
        const { data, error } = await addOneInCart(item.service_id);
        if (error) {
          Alert.alert('Error', 'Failed to increase quantity');
        } else {
          // Refetch cart data to get updated quantities
          await fetchCartData();
        }
      } else if (change < 0) {
        // Decrease quantity
        const { data, error } = await removeOneFromCart(item.service_id);
        if (error) {
          Alert.alert('Error', 'Failed to decrease quantity');
        } else {
          // Refetch cart data to get updated quantities
          await fetchCartData();
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeletePress = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleRemoveItem = async (service_id) => {
    setDeletingItemId(service_id);
    try {
      const { data, error } = await removeAllFromCart(service_id);

      if (error) {
        Alert.alert('Error', 'Failed to clear cart');
      } else {
        // Refetch cart data from server instead of optimistic updates
        await fetchCartData();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
    } finally {
      setDeletingItemId(null);
      // Close the modal after deletion completes
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleProceedNow = () => {
    // Prevent proceeding if cart is empty or total is 0
    if (isCartEmptyOrZero()) {
      Alert.alert(
        'Cart Empty',
        'Please add items to your cart before proceeding.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    setShowDateTimeModal(true);
  };

  const handleDateTimeConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) {
      Alert.alert('Selection Required', 'Please select both date and time slot to continue.');
      return;
    }
    setShowDateTimeModal(false);
    setShowPaymentModal(true);
  };

  const createbookings = async () => {
    setIsPaymentLoading(true);
    const bookingdata = {
      items: rawcart,
      ph_no: mobileNumber,
      location: location.houseNumber + " " + location.city + " " + location.district + " " + location.pincode + " " + location.additionalInfo,
      dateitem: {
        dateNumber: selectedDateItem.dayNumber,
        day: selectedDateItem.dayNumber,
        month: selectedDateItem.month
      },
      time: {
        label: selectedTimeSlot.label,
        time: selectedTimeSlot.time
      },
      paymentmethod: selectedPaymentMethod
    }
    const { data, error } = confirmbookings(bookingdata);


    if (error) {
      Alert.alert(
        'Sorry! Unable to book',
        'There was an error processing your booking. Please try again later.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowPaymentModal(false);
              router.push('/protected/(tabs)/Bookings');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Your booking has been confirmed!', // title
        '', // message can be empty if not needed
        [
          {
            text: 'OK',
            onPress: () => {
              setShowPaymentModal(false);
              router.push('/protected/(tabs)/Bookings');
            }
          }
        ]
      );
    }
    setIsPaymentLoading(true);
  }




  const handlePayment = async () => {
    setIsPaymentLoading(true);
    console.log("payment method", selectedPaymentMethod);
    if (selectedPaymentMethod == "Online Payment") {
      try {
        const { data, error } = await createRazorpayOrder([], 50000); // your API call
        const order = data;

        var options = {
          description: "Test Payment",
          image: "https://yourcdn.com/logo.png", // optional
          currency: "INR",
          key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID, // ✅ Use env
          amount: order.amount, // in paisa
          order_id: order.id, // from backend
          name: "OnlyClick",
          prefill: {
            email: "test@example.com",
            contact: "9999999999",
            name: "Test User",
          },
          theme: { color: "#3399cc" },
        };

        await RazorpayCheckout.open(options)
          .then(async (data) => {
            // Payment Success
            payment_data = data;
            // alert(`Success: ${data.razorpay_payment_id}`);
            // TODO: verify payment on backend

            const { data: confirmPaymentData, error: confirmPaymentError } = await confirmRazorpayPayment(data);
            if (confirmPaymentError) {
              throw new error(confirmPaymentError)
            }

            if (confirmPaymentData.success) {
              createbookings();
              setIsPaymentLoading(false);
            }
            else {
              alert(`Sorry! Something went wrong. If the amount was debited from your account, please contact us for assistance.`);
            }
            setIsPaymentLoading(false);
          })
          .catch((error) => {
            // Payment Failed
            console.error("Payment Failed:", error);
            alert(`Sorry! Something went wrong. If the amount was debited from your account, please contact us for assistance.`);
            setIsPaymentLoading(false);
          });


      } catch (err) {
        console.error("Error starting payment:", err);
        setIsPaymentLoading(false);
      }
    }
    else {
      createbookings();
      setIsPaymentLoading(false)
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All', style: 'destructive', onPress: () => {
          }
        }
      ]
    );
  };

  const renderCartItem = (item, categoryIndex, itemIndex) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDuration}>{item.duration}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, updatingItemId === item.service_id && styles.quantityButtonDisabled]}
            onPress={() => handleQuantityChange(categoryIndex, itemIndex, -1)}
            disabled={updatingItemId === item.service_id}
          >
            {updatingItemId === item.service_id ? (
              <ActivityIndicator size="small" color="#3898B3" />
            ) : (
              <Ionicons name="remove" size={16} color="#3898B3" />
            )}
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, updatingItemId === item.service_id && styles.quantityButtonDisabled]}
            onPress={() => handleQuantityChange(categoryIndex, itemIndex, 1)}
            disabled={updatingItemId === item.service_id}
          >
            {updatingItemId === item.service_id ? (
              <ActivityIndicator size="small" color="#3898B3" />
            ) : (
              <Ionicons name="add" size={16} color="#3898B3" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleDeletePress(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategorySection = (categoryData, categoryIndex) => (
    <View key={categoryData.category} style={styles.categorySection}>
      {/* Category Header */}
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{categoryData.category}</Text>
        <Text style={styles.categoryTotal}>₹{calculateCategoryTotal(categoryData.items)}</Text>
      </View>

      {/* Provider Info */}
      {/* <View style={styles.providerCard}>
        <View style={styles.providerHeader}>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{categoryData.provider.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{categoryData.provider.rating}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={16} color="#3898B3" />
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Items List */}
      <View style={styles.itemsList}>
        {categoryData.items.map((item, itemIndex) =>
          renderCartItem(item, categoryIndex, itemIndex)
        )}
      </View>
    </View>
  );

  const CancellationPolicyModal = () => (
    <Modal visible={showCancellationPolicy} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY: modalY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Gesture Indicator Bar */}
          <View style={styles.gestureIndicator}>
            <View style={styles.indicatorBar} />
          </View>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cancellation Policy</Text>
            <TouchableOpacity onPress={() => setShowCancellationPolicy(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.policyContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {
              // Disable scroll when gesture is detected
              return false;
            }}
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
            onPress={() => setShowCancellationPolicy(false)}
          >
            <Text style={styles.confirmButtonText}>I Understand</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const DateTimeModal = () => (
    <Modal visible={showDateTimeModal} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
        <Animated.View
          style={[styles.modalContent, styles.dateTimeModalContent, { transform: [{ translateY: modalY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Gesture Indicator Bar */}
          <View style={styles.gestureIndicator}>
            <View style={styles.indicatorBar} />
          </View>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date & Time</Text>
            <TouchableOpacity onPress={() => setShowDateTimeModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.dateTimeScrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {
              // Disable scroll when gesture is detected
              return false;
            }}
          >
            {/* Date Selection */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Choose Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScrollView}>
                {dates.map((dateItem, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCard,
                      isSameDate(selectedDate, dateItem.date) && styles.selectedDateCard
                    ]}
                    onPress={() => {
                      setSelectedDate(dateItem.date);
                      setSelectedDateItem(dateItem);
                    }}
                  >
                    <Text style={[
                      styles.dayName,
                      isSameDate(selectedDate, dateItem.date) && styles.selectedDateText
                    ]}>
                      {dateItem.dayName}
                    </Text>
                    <Text style={[
                      styles.dayNumber,
                      isSameDate(selectedDate, dateItem.date) && styles.selectedDateText
                    ]}>
                      {dateItem.dayNumber}
                    </Text>
                    <Text style={[
                      styles.monthName,
                      isSameDate(selectedDate, dateItem.date) && styles.selectedDateText
                    ]}>
                      {dateItem.month}
                    </Text>
                    {dateItem.isToday && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayText}>Today</Text>
                      </View>
                    )}
                    {dateItem.isTomorrow && (
                      <View style={styles.tomorrowBadge}>
                        <Text style={styles.tomorrowText}>Tomorrow</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Time Slot Selection */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Choose Time Slot</Text>
              <View style={styles.timeSlotsContainer}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlotCard,
                      !slot.available && styles.unavailableSlot,
                      selectedTimeSlot?.id === slot.id && styles.selectedTimeSlot
                    ]}
                    onPress={() => slot.available && setSelectedTimeSlot(slot)}
                    disabled={!slot.available}
                  >
                    <Text style={[
                      styles.timeSlotTime,
                      !slot.available && styles.unavailableText,
                      selectedTimeSlot?.id === slot.id && styles.selectedTimeText
                    ]}>
                      {slot.time}
                    </Text>
                    <Text style={[
                      styles.timeSlotLabel,
                      !slot.available && styles.unavailableText,
                      selectedTimeSlot?.id === slot.id && styles.selectedTimeText
                    ]}>
                      {slot.label}
                    </Text>
                    {!slot.available && (
                      <View style={styles.unavailableBadge}>
                        <Text style={styles.unavailableBadgeText}>Booked</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration Estimate */}
            <View style={styles.durationCard}>
              <View style={styles.durationHeader}>
                <Ionicons name="time-outline" size={20} color="#3898B3" />
                <Text style={styles.durationTitle}>Estimated Duration</Text>
              </View>
              <Text style={styles.durationTime}>⏳ ~45 minutes</Text>
              <Text style={styles.durationNote}>
                Actual time may vary based on service complexity
              </Text>
            </View>

            {/* Selection Summary */}
            {selectedDateItem && selectedTimeSlot && (
              <View style={styles.selectionSummary}>
                <Text style={styles.summaryTitle}>Your Selection</Text>
                <View style={styles.summaryRow}>
                  <Ionicons name="calendar" size={16} color="#3898B3" />
                  <Text style={styles.summaryText}>
                    {selectedDateItem.dayName}, {selectedDateItem.dayNumber} {selectedDateItem.month}
                    {selectedDateItem.isToday ? ' (Today)' : selectedDateItem.isTomorrow ? ' (Tomorrow)' : ''}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Ionicons name="time" size={16} color="#3898B3" />
                  <Text style={styles.summaryText}>
                    {selectedTimeSlot.time} ({selectedTimeSlot.label})
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Confirm Button */}
          <View style={styles.dateTimeFooter}>
            <TouchableOpacity
              style={[
                styles.confirmDateTimeButton,
                (!selectedDate || !selectedTimeSlot) && styles.disabledButton
              ]}
              onPress={handleDateTimeConfirm}
              disabled={!selectedDate || !selectedTimeSlot}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.confirmDateTimeText}>Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const PaymentModal = () => (
    <Modal visible={showPaymentModal} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
        <Animated.View
          style={[styles.modalContent, styles.paymentModalContent, { transform: [{ translateY: modalY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Gesture Indicator Bar */}
          <View style={styles.gestureIndicator}>
            <View style={styles.indicatorBar} />
          </View>

          {/* Enhanced Header */}
          <View style={styles.paymentModalHeader}>
            <View style={styles.paymentHeaderLeft}>
              <View style={styles.paymentIconContainer}>
                <Ionicons name="card" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.paymentModalTitle}>Secure Payment</Text>
                <Text style={styles.paymentModalSubtitle}>Complete your booking</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.paymentScrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {
              // Disable scroll when gesture is detected
              return false;
            }}
          >
            {/* Booking Summary Card */}
            <View style={styles.bookingSummaryCard}>
              <View style={styles.bookingSummaryHeader}>
                <Ionicons name="calendar-outline" size={20} color="#3898B3" />
                <Text style={styles.bookingSummaryTitle}>Booking Details</Text>
              </View>

              {selectedDateItem && selectedTimeSlot && (
                <View style={styles.bookingDetailsRow}>
                  <View style={styles.bookingDetailItem}>
                    <Text style={styles.bookingDetailLabel}>Date & Time</Text>
                    <Text style={styles.bookingDetailValue}>
                      {selectedDateItem.dayName}, {selectedDateItem.dayNumber} {selectedDateItem.month} • {selectedTimeSlot.time}
                    </Text>
                  </View>
                  <View style={styles.bookingDetailItem}>
                    <Text style={styles.bookingDetailLabel}>Location</Text>
                    <Text style={styles.bookingDetailValue} numberOfLines={1}>
                      {formatLocationDisplay(location)}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Services Overview */}
            <View style={styles.servicesOverviewCard}>
              <View style={styles.servicesOverviewHeader}>
                <Ionicons name="construct" size={20} color="#3898B3" />
                <Text style={styles.servicesOverviewTitle}>Services ({cartData.reduce((total, cat) => total + cat.items.length, 0)})</Text>
                <Text style={styles.servicesOverviewTotal}>₹{calculateGrandTotal()}</Text>
              </View>

              {cartData.map((category, index) => (
                <View key={index} style={styles.serviceCategory}>
                  <View style={styles.serviceCategoryHeader}>
                    <View style={styles.categoryIconWrapper}>
                      <Ionicons
                        name={category.category === 'Plumbing' ? 'water' : 'flash'}
                        size={14}
                        color="#3898B3"
                      />
                    </View>
                    <Text style={styles.serviceCategoryName}>{category.category}</Text>
                    <Text style={styles.serviceCategoryPrice}>₹{calculateCategoryTotal(category.items)}</Text>
                  </View>

                  {category.items.map((item, itemIndex) => (
                    <View key={item.id} style={styles.serviceItem}>
                      <View style={styles.serviceItemLeft}>
                        <Text style={styles.serviceItemName}>{item.name}</Text>
                        <Text style={styles.serviceItemQty}>Qty: {item.quantity}</Text>
                      </View>
                      <Text style={styles.serviceItemPrice}>₹{item.price * item.quantity}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            {/* Bill Summary */}
            {!isCartEmptyOrZero() && (
              <View style={styles.billSummaryCard}>
                <View style={styles.billHeader}>
                  <Ionicons name="receipt" size={20} color="#3898B3" />
                  <Text style={styles.billTitle}>Bill Summary</Text>
                </View>

                <View style={styles.billRows}>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Subtotal</Text>
                    <Text style={styles.billAmount}>₹{calculateGrandTotal()}</Text>
                  </View>
                  <View style={[styles.billRow, { position: 'relative' }]}>
                    <View style={styles.billLabelWithIcon}>
                      <Text style={styles.billLabel}>Service Fee</Text>
                      <TouchableOpacity
                        onPress={() => setShowServiceFeeTooltip(!showServiceFeeTooltip)}
                        style={styles.infoIconButton}
                      >
                        <Ionicons name="information-circle-outline" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.billAmount}>₹50</Text>

                    {/* Service Fee Tooltip */}
                    {showServiceFeeTooltip && (
                      <View style={styles.serviceFeeTooltip}>
                        <View style={styles.tooltipBubble}>
                          <Text style={styles.tooltipText}>
                            💡 Service fee covers platform maintenance, customer support, and quality assurance!
                          </Text>
                          <View style={styles.tooltipArrow} />
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>GST (18%)</Text>
                    <Text style={styles.billAmount}>₹{Math.round(calculateGrandTotal() * 0.18)}</Text>
                  </View>

                  <View style={styles.billDivider} />

                  <View style={styles.billTotalRow}>
                    <View>
                      <Text style={styles.billTotalLabel}>Total Amount</Text>
                      <Text style={styles.billTotalSubtext}>All taxes included</Text>
                    </View>
                    <Text style={styles.billTotalAmount}>₹{Math.round(calculateGrandTotal() + service_charge + totalTax)}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Payment Methods */}
            <View style={styles.paymentMethodsSection}>
              <View style={styles.paymentMethodsHeader}>
                <Ionicons name="wallet" size={20} color="#3898B3" />
                <Text style={styles.paymentMethodsTitle}>Choose Payment Method</Text>
              </View>

              <View style={styles.paymentMethodsList}>
                {[
                  {
                    key: 'Online Payment',
                    icon: 'card',
                    label: 'Online Payment',
                    subtitle: 'Pay online using a Secure Payment Gateway',
                    options: [
                      { type: 'online_note', label: 'Note', text: 'Complete secure payment to complete your booking' }
                    ]
                  },
                  {
                    key: 'Pay on Service',
                    icon: 'cash',
                    label: 'Pay on Service',
                    subtitle: 'Payment to provider',
                    options: [
                      { type: 'cash_note', label: 'Note', text: 'Pay directly to the service provider when they arrive' }
                    ]
                  }
                ].map((method) => (
                  <View key={method.key} style={styles.paymentMethodContainer}>
                    <TouchableOpacity
                      style={[
                        styles.paymentMethodCard,
                        selectedPaymentMethod === method.key && styles.selectedPaymentMethodCard
                      ]}
                      onPress={() => setSelectedPaymentMethod(method.key)}
                    >
                      <View style={styles.paymentMethodLeft}>
                        <View style={[
                          styles.paymentMethodIconContainer,
                          selectedPaymentMethod === method.key && styles.selectedPaymentMethodIcon
                        ]}>
                          <Ionicons
                            name={method.icon}
                            size={24}
                            color={selectedPaymentMethod === method.key ? '#3898B3' : '#666'}
                          />
                        </View>
                        <View style={styles.paymentMethodInfo}>
                          <Text style={[
                            styles.paymentMethodLabel,
                            selectedPaymentMethod === method.key && styles.selectedPaymentMethodLabel
                          ]}>
                            {method.label}
                          </Text>
                          <Text style={styles.paymentMethodSubtitle}>{method.subtitle}</Text>
                        </View>
                      </View>
                      <View style={styles.paymentMethodRight}>
                        <View style={[
                          styles.paymentMethodRadio,
                          selectedPaymentMethod === method.key && styles.selectedPaymentMethodRadio
                        ]}>
                          {selectedPaymentMethod === method.key && (
                            <View style={styles.paymentMethodRadioInner} />
                          )}
                        </View>
                        <Ionicons
                          name={selectedPaymentMethod === method.key ? "chevron-up" : "chevron-down"}
                          size={16}
                          color="#666"
                          style={{ marginLeft: 8 }}
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Options */}
                    {selectedPaymentMethod === method.key && (
                      <View style={styles.paymentOptionsExpanded}>
                        {method.options.map((option, index) => (
                          <View key={index} style={styles.paymentOption}>
                            {/* Online Payment Note */}
                            {option.type === 'online_note' && (
                              <View style={styles.cashNoteContainer}>
                                <View style={styles.cashNoteContent}>
                                  <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                                  <Text style={styles.cashNoteText}>{option.text}</Text>
                                </View>
                              </View>
                            )}

                            {/* Cash Note */}
                            {option.type === 'cash_note' && (
                              <View style={styles.cashNoteContainer}>
                                <View style={styles.cashNoteContent}>
                                  <Ionicons name="information-circle" size={20} color="#FF9800" />
                                  <Text style={styles.cashNoteText}>{option.text}</Text>
                                </View>
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Enhanced Pay Button */}
          <View style={styles.enhancedPaymentFooter}>
            <View style={styles.paymentAmountSummary}>
              <Text style={styles.payAmountLabel}>Total Amount</Text>
              <Text style={styles.payAmountValue}>₹{Math.round(total)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.enhancedPayButton, isPaymentLoading && styles.disabledPayButton]}
              onPress={handlePayment}
              disabled={isPaymentLoading}
            >
              <View style={styles.payButtonContent}>
                {isPaymentLoading ? (
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons
                    name={selectedPaymentMethod === 'Online Payment' ? "card" : "checkmark-circle"}
                    size={22}
                    color="#fff"
                  />
                )}
                <Text style={styles.enhancedPayButtonText}>
                  {isPaymentLoading ? 'Processing...' : (selectedPaymentMethod === 'Online Payment' ? 'Pay Securely' : 'Confirm Booking')}
                </Text>
                {!isPaymentLoading && (
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const DeleteConfirmationModal = () => (
    <Modal visible={showDeleteModal} transparent animationType="fade">
      <View style={styles.deleteModalOverlay}>
        <View style={styles.deleteModalContent}>
          <View style={styles.deleteModalHeader}>
            <View style={styles.deleteIconContainer}>

              <Ionicons name="trash-outline" size={32} color="#F44336" />

            </View>
            <Text style={styles.deleteModalTitle}>Clear Cart</Text>
          </View>

          <Text style={styles.deleteModalMessage}>
            Are you sure you want to remove all items from your cart?
          </Text>

          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={styles.deleteCancelButton}
              onPress={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
              }}
            >
              <Text style={styles.deleteCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteConfirmButton, deletingItemId === itemToDelete?.service_id && styles.deleteConfirmButtonDisabled]}
              onPress={() => {
                if (itemToDelete) {
                  handleRemoveItem(itemToDelete.service_id);
                }
              }}
              disabled={deletingItemId === itemToDelete?.service_id}
            >
              {deletingItemId === itemToDelete?.service_id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.deleteConfirmButtonText}>Clear Cart</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <AppHeader
        title="My Cart"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Location Confirmation */}
        <TouchableOpacity
          style={styles.locationCard}
          onPress={() => {
            router.push('/(app)/(modal)/cart/location');
          }}
        >
          <View style={styles.locationHeader}>
            <Ionicons
              name={Object.keys(location).length > 0 ? "location" : "location-outline"}
              size={20}
              color={Object.keys(location).length > 0 ? "#3898B3" : "#999"}
            />
            <Text style={styles.locationTitle}>Service Location</Text>
            {Object.keys(location).length > 0 && (
              <Ionicons name="checkmark-circle" size={20} marginLeft="auto" color="#4CAF50" />
            )}
          </View>
          <Text style={[
            styles.locationAddress,
            Object.keys(location).length === 0 && styles.placeholderText
          ]}>
            {formatLocationDisplay(location)}
          </Text>
          <Text style={styles.changeLocationLink}>
            {Object.keys(location).length > 0 ? "Tap to change" : "Tap to set"}
          </Text>
        </TouchableOpacity>

        {/* Mobile Number Section */}
        <TouchableOpacity
          style={styles.locationCard}
          onPress={() => {
            router.push('/(app)/(modal)/cart/mobile-number');
          }}
        >
          <View style={styles.locationHeader}>
            <Ionicons
              name={mobileNumber ? "call" : "call-outline"}
              size={20}
              color="#3898B3"
            />
            <Text style={styles.locationTitle}>Mobile Number</Text>
            {mobileNumber && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#4CAF50"
                style={{ marginLeft: 'auto' }}
              />
            )}
          </View>
          <Text style={mobileNumber ? styles.locationAddress : styles.placeholderText}>
            {formatMobileNumber(mobileNumber)}
          </Text>
          <Text style={styles.changeLocationLink}>
            Tap to change
          </Text>
        </TouchableOpacity>

        {/* Cart Categories */}
        {cartData.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="basket-outline" size={64} color="#ccc" />
            <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyCartSubtitle}>Add some services to get started!</Text>
          </View>
        ) : (
          cartData.map((categoryData, index) =>
            renderCategorySection(categoryData, index)
          )
        )}

        {/* Payment Summary */}
        {!isCartEmptyOrZero() && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>

            {cartData.map((category, index) => (
              <View key={index} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{category.category}</Text>
                <Text style={styles.summaryAmount}>₹{calculateCategoryTotal(category.items)}</Text>
              </View>
            ))}

            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryAmount}>{'₹' + Math.round(service_charge)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxes</Text>
              <Text style={styles.summaryAmount}>₹{Math.round(totalTax)}</Text>
            </View>

            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{Math.round(total)}</Text>
            </View>
          </View>
        )}

        {/* Cancellation Policy */}
        <TouchableOpacity
          style={styles.policyCard}
          onPress={() => setShowCancellationPolicy(true)}
        >
          <MaterialIcons name="policy" size={20} color="#3898B3" />
          <Text style={styles.policyTitle}>Cancellation Policy</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.totalContainer}>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalAmount}>₹{Math.round(calculateGrandTotal() + service_charge + totalTax)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            isCartEmptyOrZero() && styles.proceedButtonDisabled
          ]}
          onPress={handleProceedNow}
          disabled={isCartEmptyOrZero()}
        >
          <Text style={[
            styles.proceedButtonText,
            isCartEmptyOrZero() && styles.proceedButtonTextDisabled
          ]}>
            Proceed Now
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={isCartEmptyOrZero() ? "#999" : "#fff"}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      <CancellationPolicyModal />
      <DateTimeModal />
      <PaymentModal />
      <DeleteConfirmationModal />
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
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  // headerSubtitle removed - AppHeader has no subheading
  clearButton: {
    padding: 5,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 0,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  changeLocationLink: {
    fontSize: 14,
    color: '#3898B3',
    fontWeight: '500',
  },
  categorySection: {
    marginVertical: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  categoryTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3898B3',
  },
  providerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  callButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E6F5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  itemDuration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3898B3',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
  },
  removeButton: {
    padding: 5,
  },
  removeButtonDisabled: {
    opacity: 0.5,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
    minHeight: 24,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    marginRight: 12,
  },
  summaryAmount: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    minWidth: 50,
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3898B3',
    marginLeft: 16,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  policyTitle: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 14,
    color: '#666',
  },
  bottomTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  proceedButton: {
    backgroundColor: '#3898B3',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#3898B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButtonDisabled: {
    backgroundColor: '#E0E0E0',
    elevation: 0,
    shadowOpacity: 0,
  },
  proceedButtonTextDisabled: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  manualSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  countryCodePrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3898B3',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  inputHint: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  locationOptionDisabled: {
    opacity: 0.6,
  },
  locationOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  locationOptionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  manualSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    minHeight: 40,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3898B3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#B3D9FF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  changeLocationButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  changeLocationText: {
    fontSize: 14,
    color: '#3898B3',
    fontWeight: '500',
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
  policyContent: {
    maxHeight: 200,
    marginBottom: 20,
  },
  policyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  // Payment Modal Styles - Redesigned
  paymentModalContent: {
    maxHeight: '92%',
    height: '92%',
  },
  paymentScrollView: {
    flex: 1,
    marginBottom: 10,
  },

  // Enhanced Header
  paymentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 20,
  },
  paymentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3898B3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  paymentModalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Booking Summary Card
  bookingSummaryCard: {
    backgroundColor: '#F8FCFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  bookingSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  bookingDetailsRow: {
    gap: 12,
  },
  bookingDetailItem: {
    marginBottom: 8,
  },
  bookingDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  bookingDetailValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },

  // Services Overview Card
  servicesOverviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  servicesOverviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  servicesOverviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
    flex: 1,
  },
  servicesOverviewTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3898B3',
  },
  serviceCategory: {
    marginBottom: 12,
  },
  serviceCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FCFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  categoryIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  serviceCategoryPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3898B3',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    marginBottom: 4,
  },
  serviceItemLeft: {
    flex: 1,
  },
  serviceItemName: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 2,
  },
  serviceItemQty: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  serviceItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3898B3',
  },

  // Bill Summary Card
  billSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  billRows: {
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  billLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  billAmount: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FCFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  billTotalSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  billTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3898B3',
  },

  // Payment Methods Section
  paymentMethodsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethodContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  selectedPaymentMethodCard: {
    borderColor: '#3898B3',
    backgroundColor: '#F8FCFF',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedPaymentMethodIcon: {
    backgroundColor: '#E3F2FD',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  selectedPaymentMethodLabel: {
    color: '#3898B3',
  },
  paymentMethodSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  paymentMethodRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPaymentMethodRadio: {
    borderColor: '#3898B3',
  },
  paymentMethodRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3898B3',
  },

  // Expanded Payment Options
  paymentOptionsExpanded: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  paymentOption: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
  },

  // UPI Options
  upiIdContainer: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  qrOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FCFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  appContainer: {
    marginBottom: 12,
  },
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  appOption: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3898B3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  appIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 12,
    color: '#1A1A1A',
    textAlign: 'center',
  },

  // Card Options
  savedCardsContainer: {
    marginBottom: 12,
  },
  savedCardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  savedCardText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
    flex: 1,
  },
  newCardContainer: {
    marginBottom: 12,
  },
  cardFields: {
    gap: 8,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Bank Options
  bankListContainer: {
    marginBottom: 12,
  },
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankOption: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 60,
    alignItems: 'center',
  },
  bankIcon: {
    width: 40,
    height: 24,
    backgroundColor: '#3898B3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankIconText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Wallet Options
  walletListContainer: {
    marginBottom: 12,
  },
  walletsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  walletOption: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  walletIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  walletIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletName: {
    fontSize: 12,
    color: '#1A1A1A',
    textAlign: 'center',
  },

  // Cash Options
  cashNoteContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  cashNoteContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cashNoteText: {
    fontSize: 13,
    color: '#E65100',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },

  // Enhanced Payment Footer
  enhancedPaymentFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  paymentAmountSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  payAmountLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  payAmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  enhancedPayButton: {
    backgroundColor: '#3898B3',
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#3898B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledPayButton: {
    backgroundColor: '#B0B0B0',
    elevation: 0,
    shadowOpacity: 0,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  enhancedPayButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Date Time Modal Styles
  dateTimeModalContent: {
    maxHeight: '90%',
    height: '90%',
  },
  dateTimeScrollView: {
    flex: 1,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  datesScrollView: {
    flexDirection: 'row',
  },
  dateCard: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    paddingTop: 20,
    marginRight: 12,
    marginTop: 12,
    minWidth: 90,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedDateCard: {
    backgroundColor: '#3898B3',
    borderColor: '#3898B3',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  monthName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedDateText: {
    color: '#fff',
  },
  todayBadge: {
    position: 'absolute',
    top: -10,
    right: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  todayText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  tomorrowBadge: {
    position: 'absolute',
    top: -10,
    right: -8,
    backgroundColor: '#FF9800',
    borderRadius: 10,
    paddingHorizontal: 8, // Increased from 5 to 8 for more space
    paddingVertical: 2,
    zIndex: 1,
    minWidth: 70, // Added minimum width to ensure consistent badge size
  },
  tomorrowText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlotCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedTimeSlot: {
    backgroundColor: '#3898B3',
    borderColor: '#3898B3',
  },
  unavailableSlot: {
    backgroundColor: '#F0F0F0',
    borderColor: 'transparent',
  },
  timeSlotTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  timeSlotLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedTimeText: {
    color: '#fff',
  },
  unavailableText: {
    color: '#999',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unavailableBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  durationCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B3D9FF',
  },
  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3898B3',
    marginLeft: 8,
  },
  durationTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  durationNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  selectionSummary: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#2E7D32',
    marginLeft: 8,
    fontWeight: '500',
  },
  dateTimeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 15,
  },
  confirmDateTimeButton: {
    backgroundColor: '#3898B3',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#3898B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  confirmDateTimeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Service Fee Tooltip Styles
  infoIconButton: {
    padding: 4,
    marginLeft: 6,
  },
  serviceFeeTooltip: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tooltipBubble: {
    backgroundColor: '#FFF9C4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#FFD54F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '100%',
    position: 'relative',
  },
  tooltipText: {
    fontSize: 13,
    color: '#F57F17',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD54F',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3898B3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  // Location Modal Specific Styles
  locationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  locationModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingTop: 8,
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  locationCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationFormScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  locationFieldContainer: {
    marginBottom: 20,
  },
  locationFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  locationOptionalText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    height: 48,
  },
  locationInputIcon: {
    marginRight: 10,
  },
  locationTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },
  locationRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationHalfField: {
    flex: 1,
    marginRight: 8,
  },
  locationButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  locationCancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  locationCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  locationSaveButton: {
    flex: 1,
    backgroundColor: '#3898B3',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  locationSaveButtonDisabled: {
    backgroundColor: '#B3D9FF',
    opacity: 0.6,
  },
  locationSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  gestureIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 10,
  },
  indicatorBar: {
    width: 50,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  policyContent: {
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
  // Delete Confirmation Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    minWidth: 300,
  },
  deleteModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteCancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteCancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteConfirmButtonDisabled: {
    backgroundColor: '#FFCDD2',
  },
  deleteConfirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  // Empty Cart Styles
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});