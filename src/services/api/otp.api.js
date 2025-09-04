import supabase from "../../data/supabaseClient.js"


export const sendOtp = async (phone) => {
    try {

        const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` })
        if (error) throw error
        return true
    } catch (error) {
        console.error("Send OTP Error:", error.response?.data || error.message);
        throw error;
    }
}

export const verifyOtp = async (phone, otp) => {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: `+91${phone}`,
            token: otp,
            type: "sms",
        })
        if (error) throw error

        return data.session
    } catch (error) {
        console.error("Verify OTP Error:", error.response?.data || error.message);
        throw error;
    }
};