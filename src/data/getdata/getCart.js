import supabase from "../supabaseClient";

export default async function fetchCart() {
    const { data, error } = await supabase
        .schema("oneclick")
        .from("users")
        .select("cart");

    if (error) {
        console.error("Supabase error:", error);
        return { arr: [], error };
    }

    if (!data || data.length === 0 || !data[0].cart) {
        console.warn("No cart data returned");
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
                duration: item.duration || "N/A"
            });
        });

        return Object.values(grouped);
    }

    const arr = transformCartData(data[0].cart);

    return { arr, error: null };
}
