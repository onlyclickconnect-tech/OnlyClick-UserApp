import api from "./api";

export const createRazorpayOrder  = async (rawcart, amount)=>{
    delete rawcart.count; // this count is the no of times service is booked so its of no use.so I deleted it.
    try {
        const { data } = await api.post("/api/v1/genrate_oid", { rawcart, amount });
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
    }catch(error){
        console.error("error confirming payment", error);
        return{error}
    }
        
}