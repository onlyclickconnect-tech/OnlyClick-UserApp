import supabase from "../supabaseClient";

export default async function fetchCart(couponApplied = false) {
    const getDiscountAndCommission = async () => {
        const { data, error } = await supabase
            .schema('onlyclick')
            .from('general_data')
            .select('key, value');

        if (error) {
            console.error(error);
            return {};
        }

        // Convert [{key, value}, ...] → {key: value, ...}
        const result = data.reduce((acc, { key, value }) => {
            acc[key] = Number(value); // convert to number
            return acc;
        }, {});

        return result;
    };

    const {commission_percent, online_payment_discount_percent} = await getDiscountAndCommission();

    // Prebooking discount configuration
    const PREBOOKING_DISCOUNT_PERCENT = 30; // 30% discount
    const isCouponApplied = couponApplied; // Use parameter instead of hardcoded value
    
    const { data, error } = await supabase
        .schema("onlyclick")
        .from("users")
        .select("cart")
        .single()

    if (error) {
        return { arr: [], error };
    }

    if (!data || !data.cart || !data.cart.items) {
        return { arr: [], error: null };
    }

    console.log(data.cart);

    // Extract service IDs from cart
    const serviceIds = data.cart.items.map(item => item.service_id);

    // Fetch current service data from services table
    const { data: service_data, error: service_error } = await supabase
        .schema("onlyclick")
        .from("services")
        .select("service_id, price, service_fee_percent, total_tax")
        .in('service_id', serviceIds);

    if (service_error) {
        return { arr: [], error: service_error };
    }

    // Create a map for quick lookup of service data
    const serviceDataMap = {};
    service_data.forEach(service => {
        serviceDataMap[service.service_id] = service;
    });

    // Merge cart items with current service data and apply prebooking discount
    const updatedCartItems = data.cart.items.map(cartItem => {
        const currentServiceData = serviceDataMap[cartItem.service_id];
        let finalPrice = currentServiceData?.price || cartItem.price;
        
        // Apply prebooking discount first if coupon is applied
        if (isCouponApplied) {
            finalPrice = finalPrice * (1 - PREBOOKING_DISCOUNT_PERCENT / 100);
        }
        
        return {
            ...cartItem,
            // Override with current service data and apply prebooking discount
            original_price: currentServiceData?.price || cartItem.price, // Store original price
            price: finalPrice, // Discounted price if coupon applied
            service_fee_percent: currentServiceData?.service_fee_percent || cartItem.service_fee_percent,
            total_tax: currentServiceData?.total_tax || cartItem.total_tax,
            prebooking_discount_applied: isCouponApplied,
            prebooking_discount_percent: isCouponApplied ? PREBOOKING_DISCOUNT_PERCENT : 0,
            prebooking_discount_amount: isCouponApplied ? (currentServiceData?.price || cartItem.price) * (PREBOOKING_DISCOUNT_PERCENT / 100) : 0
        };
    });

    const updatedCartData = {
        ...data.cart,
        items: updatedCartItems
    };

    // Online payment discount percentage (configurable) - ensure it's an integer
    const ONLINE_PAYMENT_DISCOUNT_PERCENT = parseInt(online_payment_discount_percent, 10);
    const COMMISSION_PERCENT = parseInt(commission_percent, 10);

    /**
     * Calculate charges using paise-based arithmetic to avoid floating-point rounding errors
     * All calculations are done in paise (1 rupee = 100 paise) and rounded only at display time
     */
    function calculateCharges(data) {
        let totalServiceChargePaise = 0;
        let subTotalPaise = 0;

        data.items.forEach(item => {
            const qty = item.count_in_cart || 0;
            if (qty > 0) {
                // Convert to paise for precise calculations
                const baseAmountPaise = item.price * qty * 100;

                subTotalPaise += baseAmountPaise;
                totalServiceChargePaise += Math.round((baseAmountPaise * item.service_fee_percent) / 100);
            }
        });

        // Calculate online payment discount (ONLINE_PAYMENT_DISCOUNT_PERCENT% of subtotal) in paise
        const onlinePaymentDiscountPaise = Math.round((subTotalPaise * ONLINE_PAYMENT_DISCOUNT_PERCENT) / 100);

        return {
            // Return values in rupees (divide by 100 and round for consistent amounts)
            serviceCharge: Math.round(totalServiceChargePaise / 100),
            subTotal: Math.round(subTotalPaise / 100),
            onlinePaymentDiscount: Math.round(onlinePaymentDiscountPaise / 100),
            totalAmount: Math.round((subTotalPaise + totalServiceChargePaise) / 100),
            totalAmountWithOnlineDiscount: Math.round((subTotalPaise + totalServiceChargePaise - onlinePaymentDiscountPaise) / 100),
            // Also provide paise values for precise calculations (but round them to whole paise)
            totalAmountPaise: Math.round(subTotalPaise + totalServiceChargePaise),
            totalAmountWithOnlineDiscountPaise: Math.round(subTotalPaise + totalServiceChargePaise - onlinePaymentDiscountPaise)
        };
    }

    // Use updated cart data for calculations
    const { serviceCharge, subTotal, onlinePaymentDiscount, totalAmount, totalAmountWithOnlineDiscount, totalAmountPaise, totalAmountWithOnlineDiscountPaise } = calculateCharges(updatedCartData)

    // Calculate total prebooking discount amount
    const totalPrebookingDiscount = isCouponApplied ? 
        Math.round(updatedCartData.items.reduce((total, item) => {
            const qty = item.count_in_cart || 0;
            const originalPrice = item.original_price || item.price / (1 - PREBOOKING_DISCOUNT_PERCENT / 100);
            const discountPerItem = originalPrice * (PREBOOKING_DISCOUNT_PERCENT / 100);
            return total + (discountPerItem * qty);
        }, 0)) : 0;

    function transformCartData(rawData) {
        if (!rawData || !rawData.items) return [];

        // Group by category
        const grouped = {};

        rawData.items.forEach((item) => {
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
                price: item.price,
                quantity: item.count_in_cart || 0,
                duration: item.duration || "N/A",
                service_id: item.service_id
            });
        });

        return Object.values(grouped);
    }

    const arr = transformCartData(updatedCartData);

    // Enhance raw cart data with pricing information and additional fields
    const enhancedRawCartData = updatedCartData.items.map(item => {
        const qty = item.count_in_cart || 0;

        // Convert to paise for precise calculations (1 rupee = 100 paise)
        const baseAmountPaise = item.price * qty * 100;
        const serviceFeeAmountPaise = Math.round((baseAmountPaise * item.service_fee_percent) / 100);
        const taxAmountPaise = Math.round((baseAmountPaise * item.total_tax) / 100);
        const totalItemAmountPaise = baseAmountPaise + serviceFeeAmountPaise + taxAmountPaise;

        // Company share calculation in paise: commission_percent% of base price + service charge % of base price
        const companyShareBasePaise = Math.round((baseAmountPaise * COMMISSION_PERCENT) / 100); // commission_percent% of base price
        const companyShareFromServiceFeePaise = serviceFeeAmountPaise; // service charge % of base price
        const companyShareTotalPaise = companyShareBasePaise + companyShareFromServiceFeePaise;

        // TM share calculation in paise: (100 - commission_percent)% of base price
        const tmSharePaise = Math.round((baseAmountPaise * (100 - COMMISSION_PERCENT)) / 100);

        // Online payment discount (ONLINE_PAYMENT_DISCOUNT_PERCENT% of base amount) in paise - reduced from company share
        const onlineDiscountAmountPaise = Math.round((baseAmountPaise * ONLINE_PAYMENT_DISCOUNT_PERCENT) / 100);
        const companyShareAfterDiscountPaise = companyShareTotalPaise - onlineDiscountAmountPaise;

        return {
            ...item,
            // Add essential calculated pricing fields (converted back to rupees for display)
            service_fee_amount: Math.round(serviceFeeAmountPaise / 100),
            tax_amount: Math.round(taxAmountPaise / 100),
            total_item_amount: Math.round(totalItemAmountPaise / 100),

            // Only essential share calculations for backend (converted back to rupees)
            company_share: Math.round(companyShareTotalPaise / 100), // Full company share (before discount)
            company_share_after_discount: Math.round(companyShareAfterDiscountPaise / 100), // Company share after online payment discount
            tm_share: Math.round(tmSharePaise / 100), // (100-commission_percent)% of base price
            online_discount_amount: Math.round(onlineDiscountAmountPaise / 100), // ONLINE_PAYMENT_DISCOUNT_PERCENT% discount amount

            // Keep paise values for precise calculations in frontend components only
            // These won't be sent to backend but used for UI calculations
            _paise_values: {
                base_amount_paise: baseAmountPaise,
                service_fee_amount_paise: serviceFeeAmountPaise,
                tax_amount_paise: taxAmountPaise,
                company_share_paise: companyShareTotalPaise,
                company_share_after_discount_paise: companyShareAfterDiscountPaise,
                tm_share_paise: tmSharePaise,
                online_discount_amount_paise: onlineDiscountAmountPaise,
            }
        };
    });
    
    return { 
        arr, 
        serviceCharge, 
        subTotal,
        onlinePaymentDiscount,
        onlineDiscountPercent: ONLINE_PAYMENT_DISCOUNT_PERCENT,
        // Prebooking discount information
        prebookingDiscount: totalPrebookingDiscount,
        prebookingDiscountPercent: PREBOOKING_DISCOUNT_PERCENT,
        isCouponApplied: isCouponApplied,
        totalAmount, 
        totalAmountWithOnlineDiscount,
        // Include paise values for precise calculations in components
        totalAmountPaise,
        totalAmountWithOnlineDiscountPaise,
        rawCartData: enhancedRawCartData, 
        error: null 
    };
}
