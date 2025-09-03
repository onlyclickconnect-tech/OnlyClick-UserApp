import axios from "axios";

const api = axios.create({
  baseURL: "https://tidy-cases-work.loca.lt",
  timeout: 10000, // 10 sec timeout
});

export const sendOtp = async(phone) => {
    try {
        const response = await api.post("/send-otp", { phone });
        return response.data;
    } catch (error) {
        console.error("Send OTP Error:", error.response?.data || error.message);
        throw error;
    }
}

export const verifyOtp = async (phone, token) => {
    try {
        const response = await api.post("/verify-otp", { phone, token });
        return response.data;
    } catch (error) {
        console.error("Verify OTP Error:", error.response?.data || error.message);
        throw error;
    }
};

export default api;