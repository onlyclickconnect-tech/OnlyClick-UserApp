import supabase from "../supabaseClient";

export default async function fetchCart(couponApplied = false) {
    console.log("fetchCart called with couponApplied:", couponApplied);
    
    // 1) Get coupon details for prebooking, online discount, and commission
    const getDiscountAndCommission = async () => {
        const { data, error } = await supabase
            .schema('onlyclick')
            .from('general_data')
            .select('key, value');

        if (error) {
            console.error("Error fetching general_data:", error);
            return {};
        }

        console.log("General data:", data);

        // Convert [{key, value}, ...] → {key: value, ...}
        const result = data.reduce((acc, { key, value }) => {
            acc[key] = parseFloat(value); // Keep as float for precise calculations
            return acc;
        }, {});

        return result;
    };

    // Fetch system configuration
    const systemConfig = await getDiscountAndCommission();
    const COMMISSION_PERCENT = systemConfig.commission_percent || 15;
    const ONLINE_PAYMENT_DISCOUNT_PERCENT = systemConfig.online_payment_discount_percent || 2;
    const PREBOOKING_DISCOUNT_PERCENT = systemConfig.PREBOOKING_DISCOUNT_PERCENT || 30;
    const PREBOOKING_COUPON = systemConfig.PREBOOKING_COUPON || "PREBOOKING30";
    const CONVENIENCE_FEE_PERCENT = 5; // 5% convenience charge + platform fees

    console.log("System config:", {
        COMMISSION_PERCENT,
        ONLINE_PAYMENT_DISCOUNT_PERCENT,
        PREBOOKING_DISCOUNT_PERCENT,
        PREBOOKING_COUPON,
        CONVENIENCE_FEE_PERCENT
    });

    // 2) Get cart data
    const { data, error } = await supabase
        .schema("onlyclick")
        .from("users")
        .select("cart")
        .single();

    console.log("Cart data from DB:", data);

    if (error) {
        console.error("Error fetching cart:", error);
        return { arr: [], error };
    }

    if (!data || !data.cart || !data.cart.items) {
        return { arr: [], error: null };
    }

    console.log("Cart items:", data.cart);

    // Extract service IDs from cart
    const serviceIds = data.cart.items.map(item => item.service_id);

    // Fetch current service data from services table to get latest prices
    const { data: service_data, error: service_error } = await supabase
        .schema("onlyclick")
        .from("services")
        .select("service_id, price")
        .in('service_id', serviceIds);

    if (service_error) {
        console.error("Error fetching service data:", service_error);
        return { arr: [], error: service_error };
    }

    // Create a map for quick lookup of current service prices
    const serviceDataMap = {};
    service_data.forEach(service => {
        serviceDataMap[service.service_id] = service;
    });

    // 3) Process cart items with new pricing system
    const processedCartItems = data.cart.items.map(cartItem => {
        const qty = cartItem.count_in_cart || 0;
        if (qty === 0) return cartItem; // Skip items with zero quantity

        // Get latest price from backend or fallback to cart price
        const originalPrice = serviceDataMap[cartItem.service_id]?.price || cartItem.price;
        
        // 4) Apply prebooking discount if coupon is applied
        let servicePrice = originalPrice;
        let prebookingDiscountAmount = 0;
        
        if (couponApplied) {
            prebookingDiscountAmount = (originalPrice * PREBOOKING_DISCOUNT_PERCENT / 100);
            servicePrice = originalPrice - prebookingDiscountAmount;
        }

        // 5) Calculate TM share: (100-commission)% of the service price
        const tmShare = (servicePrice * (100 - COMMISSION_PERCENT) / 100);

        // 6) Add 5% convenience charge + platform fees for each service
        const convenienceFee = (servicePrice * CONVENIENCE_FEE_PERCENT / 100);
        const totalItemPrice = servicePrice + convenienceFee;

        // 7) Calculate online payment discount (on original service price before convenience fee)
        const onlineDiscountAmount = (servicePrice * ONLINE_PAYMENT_DISCOUNT_PERCENT / 100);

        // 8) Company share calculation
        let companyShare;
        if (couponApplied) {
            // Company gets: convenience fee + commission% of discounted service price
            companyShare = convenienceFee + (servicePrice * COMMISSION_PERCENT / 100);
        } else {
            // Company gets: convenience fee + commission% of full service price
            companyShare = convenienceFee + (servicePrice * COMMISSION_PERCENT / 100);
        }

        return {
            ...cartItem,
            original_price: originalPrice,
            service_price: parseFloat(servicePrice.toFixed(2)), // Service price after prebooking discount
            convenience_fee: parseFloat(convenienceFee.toFixed(2)),
            total_price: parseFloat(totalItemPrice.toFixed(2)), // Service price + convenience fee
            tm_share: parseFloat(tmShare.toFixed(2)),
            company_share: parseFloat(companyShare.toFixed(2)),
            online_discount_amount: parseFloat(onlineDiscountAmount.toFixed(2)),
            prebooking_discount_amount: parseFloat(prebookingDiscountAmount.toFixed(2)),
            prebooking_discount_applied: couponApplied,
            prebooking_discount_percent: couponApplied ? PREBOOKING_DISCOUNT_PERCENT : 0
        };
    });

    // Calculate totals
    let subTotal = 0; // Sum of all service prices (after prebooking discount)
    let totalConvenienceFee = 0;
    let totalTMShare = 0;
    let totalCompanyShare = 0;
    let totalOnlineDiscount = 0;
    let totalPrebookingDiscount = 0;

    processedCartItems.forEach(item => {
        const qty = item.count_in_cart || 0;
        if (qty > 0) {
            subTotal += (item.service_price * qty);
            totalConvenienceFee += (item.convenience_fee * qty);
            totalTMShare += (item.tm_share * qty);
            totalCompanyShare += (item.company_share * qty);
            totalOnlineDiscount += (item.online_discount_amount * qty);
            totalPrebookingDiscount += (item.prebooking_discount_amount * qty);
        }
    });

    const grandTotal = subTotal + totalConvenienceFee; // Total before any payment discounts

    // Calculate final amounts based on payment method
    const totalWithOnlineDiscount = grandTotal - totalOnlineDiscount;

    // Transform data for UI display (grouped by category)
    function transformCartData(items) {
        if (!items || items.length === 0) return [];

        const grouped = {};

        items.forEach((item) => {
            const category = item.category || "Uncategorized";

            if (!grouped[category]) {
                grouped[category] = {
                    category,
                    items: []
                };
            }

            grouped[category].items.push({
                id: item.id,
                name: item.title || "Unnamed Service",
                price: item.service_price, // Use discounted service price
                quantity: item.count_in_cart || 0,
                duration: item.duration || "N/A",
                service_id: item.service_id
            });
        });

        return Object.values(grouped);
    }

    const arr = transformCartData(processedCartItems);

    console.log("Final calculations:", {
        subTotal: parseFloat(subTotal.toFixed(2)),
        totalConvenienceFee: parseFloat(totalConvenienceFee.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        totalTMShare: parseFloat(totalTMShare.toFixed(2)),
        totalCompanyShare: parseFloat(totalCompanyShare.toFixed(2)),
        totalOnlineDiscount: parseFloat(totalOnlineDiscount.toFixed(2)),
        totalPrebookingDiscount: parseFloat(totalPrebookingDiscount.toFixed(2)),
        totalWithOnlineDiscount: parseFloat(totalWithOnlineDiscount.toFixed(2))
    });

    return {
        arr,
        subTotal: parseFloat(subTotal.toFixed(2)),
        convenienceFee: parseFloat(totalConvenienceFee.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        totalTMShare: parseFloat(totalTMShare.toFixed(2)),
        totalCompanyShare: parseFloat(totalCompanyShare.toFixed(2)),
        onlinePaymentDiscount: parseFloat(totalOnlineDiscount.toFixed(2)),
        onlineDiscountPercent: ONLINE_PAYMENT_DISCOUNT_PERCENT,
        prebookingDiscount: parseFloat(totalPrebookingDiscount.toFixed(2)),
        prebookingDiscountPercent: PREBOOKING_DISCOUNT_PERCENT,
        isCouponApplied: couponApplied,
        totalWithOnlineDiscount: parseFloat(totalWithOnlineDiscount.toFixed(2)),
        rawCartData: processedCartItems,
        error: null,
        // System configuration for reference
        systemConfig: {
            COMMISSION_PERCENT,
            ONLINE_PAYMENT_DISCOUNT_PERCENT,
            PREBOOKING_DISCOUNT_PERCENT,
            PREBOOKING_COUPON,
            CONVENIENCE_FEE_PERCENT
        }
    };
}
