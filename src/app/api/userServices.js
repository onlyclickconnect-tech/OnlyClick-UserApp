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
export const uploadAvatar = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    });

    const { data } = await api.post("/api/v1/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error(
      "Error uploading avatar:",
      error.response?.data || error.message
    );
    return { error };
  }
};
