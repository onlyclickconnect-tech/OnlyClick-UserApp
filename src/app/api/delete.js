import supabase from "../../data/supabaseClient.js";
import api from "./api.js";

export const deleteUser = async () => {
  try {

    // Get current user ID
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      throw new Error("No authenticated user found");
    }


    // Send user_id as query parameter instead of body
    const response = await api.delete(
      `/api/v1/delete?user_id=${session.user.id}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
