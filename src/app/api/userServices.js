import api from "./api";

export const updateProfile = async (updates) => {
  try {
    const { data } = await api.post("/api/v1/update", { updates });
    console.log('data send from here: ', data);
    console.log(data);
    
    return data; 
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};
