import api from "../api/api";

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

export const removeOneFromCart = async (service_id) => {
  try {
    const { data } = await api.post("/api/v1/removefromcart", { service_id });
    return { data };
  } catch (error) {
    console.error("Error removing item:", error.response?.data || error.message);
    return { error };
  }
};

export const addOneInCart = async (service_id) => {
  try {
    const { data } = await api.post("/api/v1/addoneincart", { service_id });
    return { data };
  } catch (error) {
    console.error("Error adding item:", error.response?.data || error.message);
    return { error };
  }
};

export const removeAllFromCart = async (service_id) => {
  try {
    const { data } = await api.post("/api/v1/removeallfromcart", { service_id });
    return { data };
  } catch (error) {
    console.error("Error removing item:", error.response?.data || error.message);
    return { error };
  }
};

