import supabase from "../supabaseClient";

export default async function fetchCart() {
    const { data, error } = await supabase
        .schema("onlyclick")
        .from("users")
        .select("address,ph_no,cart")
    const phno = data[0].ph_no;
    const address = data[0].address;


    function calculateCharges(data) {
        let totalServiceCharge = 0;
        let totalTax = 0;
        let subTotal = 0;

        data.items.forEach(item => {
            const qty = item.count_in_cart || 0;
            if (qty > 0) {
                const baseAmount = item.price * qty;

                subTotal += baseAmount;
                totalServiceCharge += (baseAmount * item.service_fee_percent) / 100;
                totalTax += (baseAmount * item.total_tax) / 100;
            }
        });

        return {
            serviceCharge: totalServiceCharge,
            tax: totalTax,
            totalAmount: Math.round(subTotal + totalServiceCharge + totalTax)
        };
    }


    const { serviceCharge, tax, totalAmount } = calculateCharges(data[0].cart)



    if (error) {
        return { arr: [], error };
    }

    if (!data || data.length === 0 || !data[0].cart) {
        return { arr: [], error: null };
    }

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
    
    const arr = transformCartData(data[0].cart);
    
    rawCartData = data[0].cart.items
    return { arr, phno, address, serviceCharge, tax,totalAmount,rawCartData, error: null };
}
