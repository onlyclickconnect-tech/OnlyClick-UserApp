import supabase from "../supabaseClient";

export default async function getbookings() {
  const { data, error } = await supabase
    .schema("onlyclick")
    .from("bookings")
    .select("*");



  if (error) {
    return { arr: [], error };
  }

  if (!data) {
    return { arr: [], error: null };
  }

  const getdateTime = (timestamp) => {
    if (!timestamp) return ["", ""]; // fallback if null

    const [date, timeWithZone] = timestamp.split("T");
    if (!timeWithZone) return [date, ""];

    const time = timeWithZone.split("+")[0];
    return [date, time];
  };

  const formatdata = (element) => {
    const [date, time] = getdateTime(element.time_slot);

    return {
      id: element.id,
      otp: element.otp,
      serviceName: element.service_name,
      date,
      time,
      location: element.location,
      status: element.status,
      provider: element.tm_name,
      price: element.payment_amount,
      category: element.category,
      bookingTime: date,
      contact: `+91 ${element.tm_contact}`,
      description: element.service_description || element.service_name, // Use description if available
      estimatedDuration: element.estimated_duration || '1-2 hours',
      paymentMethod: element.payment_method || 'Cash on Delivery',
      bookingId: `BK${element.id.toString().padStart(10, '0')}`,
      razorpay_oid: element.razorpay_oid || "Pay after service ",
      serviceNotes: element.service_notes || 'Our technician will call 15 minutes before arrival.',
      taskMaster: {
        name: element.tm_name,
        contact: `+91 ${element.tm_contact}`,
        photo: element.tm_photo || 'https://via.placeholder.com/150'
      },
      // Keep the original field names for backward compatibility
      service_name: element.service_name,
      Contact: `+91 ${element.tm_contact}`,
    };
  };

  const arr = data.map(formatdata);
  return { arr, error: null };
}
