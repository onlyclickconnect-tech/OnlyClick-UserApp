import api from "./api";

export const createRazorpayOrder  = async (booking_uuids, amount)=>{
    try {
        const { data } = await api.post("/api/v1/genrate_oid", { booking_uuids, amount });
        console.log("till here okay", data);
        return data;

    } catch (error) {
        console.error(
            "Error generateing Order Id",
            error.response?.data || error.message
        );
        return { error };
    }
}

export const confirmRazorpayPayment = async (payment_data)=>{
    console.log(payment_data);
    try {
        const {data, error} = await api.post("/api/v1/confirm_payment", payment_data);
        console.log('dataform confirm_payment', data)
        console.log(data);
        return{data, error};
    }catch{
        console.error("error confirming payment", error);
        return{error}
    }
        
}