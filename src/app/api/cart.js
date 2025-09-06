import api from "./api";

export const addToCart = async (new_item) => {
  
  try {
    const { data } = await api.post("/api/v1/addtocart", { new_item });
    console.log('data send from here: ', data);
    console.log(data);
    
    return data; 
  } catch (error) {
    console.error(
      "Error updating cart:",
      error.response?.data || error.message
    );
    return {error};
  }
};
