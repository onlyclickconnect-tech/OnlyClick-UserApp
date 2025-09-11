import supabase from "../../data/supabaseClient.js";
import api from "./api.js";

export const deleteUser = async () => {
  try {
    console.log("deleteUser function called");

    // Get current user ID
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Got session:", !!session);

    if (!session?.user?.id) {
      throw new Error("No authenticated user found");
    }

    console.log("Making API call to delete user:", session.user.id);

    // Send user_id as query parameter instead of body
    const response = await api.delete(
      `/api/v1/delete?user_id=${session.user.id}`
    );

    console.log("Delete API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
