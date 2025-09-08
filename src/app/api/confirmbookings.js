import api from "./api.js";

const confirmBookings = async (bookingData) => {
  console.log("Booking data:", bookingData);

  try {
    const response = await api.post('/api/v1/confirmbookings', bookingData);
    console.log("Booking POST successful:", response.data);

    return { data: response.data, error: null };
  } catch (err) {
    // Convert error to a safe string
    let errorMessage = "Unknown error";

    if (err?.response?.data) {
      // If the server returned an array or object
      if (Array.isArray(err.response.data)) {
        errorMessage = err.response.data.join("\n"); // array -> string
      } else if (typeof err.response.data === "object") {
        errorMessage = JSON.stringify(err.response.data);
      } else {
        errorMessage = String(err.response.data);
      }
    } else if (err?.message) {
      // Axios or native error message
      errorMessage = String(err.message);
    }

    console.log("Error posting bookings:", errorMessage);

    return { data: null, error: errorMessage };
  }
};

export default confirmBookings;
