import supabase from "../supabaseClient.js";

export const getFullName = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("onlyclick")
      .from("users")
      .select("full_name")
      .eq("user_id", userId)
      .single();

      // console.log(data);

    if (error) {
      return "";
    }
    return data?.full_name || "";
  } catch (err) {
    return "";
  }
};

export const getProfileImage = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("onlyclick")
      .from("users")
      .select("avatar_url")
      .eq("user_id", userId)
      .single();

    if (error) {
      return "";
    }
    return data?.avatar_url || "";
  } catch (err) {
    return "";
  }
};

export const getEmail = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("onlyclick")
      .from("users")
      .select("email")
      .eq("user_id", userId)
      .single();

    if (error) {
      return "";
    }
    return data?.email || "";
  } catch (err) {
    return "";
  }
};

export const getPhone = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("onlyclick")
      .from("users")
      .select("ph_no")
      .eq("user_id", userId)
      .single();

    if (error) {
      return "";
    }
    return String(data?.ph_no) || "";
  } catch (err) {
    return "";
  }
};

export const getAddress = async (userId) => {
  try {
    const { data, error } = await supabase
      .schema("onlyclick")
      .from("users")
      .select("address")
      .eq("user_id", userId)
      .single();

    if (error) {
      return "";
    }
    return data?.address || "";
  } catch (err) {
    return "";
  }
};

