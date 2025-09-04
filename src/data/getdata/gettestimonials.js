import supabase from "../supabaseClient";

export default async function gettestimonials() {
    const { data, error } = await supabase
        .schema("oneclick")
        .from("testimonials")
        .select("*") // <-- required
        .eq("allowed", true);

    if (error) {
        console.error("Supabase error:", error);
        return { arr: [], error };
    }

    if (!data) {
        console.warn("No data returned from testimonials");
        return { arr: [], error: null };
    }

    const formatdata = (element) => {

        return {
            id: element.id,
            name: element.customer_name,
            comment: element.message,
            avatar: element.customer_avatar,
        }
    };

    const arr = data.map(formatdata);
    return { arr, error: null };
}
