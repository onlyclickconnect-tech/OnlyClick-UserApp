import supabase from "../supabaseClient.js";

export const getFullName = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("oneclick")
      .from("users")
      .select("full_name")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("No user record found for:", userId);
      return "";
    }
    return data?.full_name || "";
  } catch (err) {
    console.log("Error fetching full name:", err);
    return "";
  }
};

export const getProfileImage = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("oneclick")
      .from("users")
      .select("avatar_url")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("No user record found for avatar:", userId);
      return "";
    }
    return data?.avatar_url || "";
  } catch (err) {
    console.log("Error fetching avatar:", err);
    return "";
  }
};

export const getEmail = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("oneclick")
      .from("users")
      .select("email")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("No user record found for email:", userId);
      return "";
    }
    return data?.email || "";
  } catch (err) {
    console.log("Error fetching email:", err);
    return "";
  }
};

export const getPhone = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("oneclick")
      .from("users")
      .select("ph_no")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("No user record found for phone:", userId);
      return "";
    }
    return String(data?.ph_no) || "";
  } catch (err) {
    console.log("Error fetching phone:", err);
    return "";
  }
};

export const getAddress = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("oneclick")
      .from("users")
      .select("address")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("No user record found for address:", userId);
      return "";
    }
    return data?.address || "";
  } catch (err) {
    console.log("Error fetching address:", err);
    return "";
  }
};

