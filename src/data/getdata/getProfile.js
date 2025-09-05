import supabase from "../supabaseClient.js";

export const getFullName = async (userId) => {
  const { data, error } = await supabase
    .schema("oneclick")
    .from("users")
    .select("full_name")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error);
    return [];
  }
  return data.full_name || "";
};
export const getProfileImage = async (userId) => {
  const { data, error } = await supabase
    .schema("oneclick")
    .from("users")
    .select("avatar_url")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error);
    return [];
  }
  return data.avatar_url || "";
};
export const getEmail = async(userId)=>{
    const {data, error} = await supabase
    .schema("oneclick")
    .from("users")
    .select("email")
    .eq("user_id", userId)
    .single();

    if(error){
        console.log(error);
        return [];
    }
    return data.email || "";
}

export default{
    getFullName,
    getProfileImage
}