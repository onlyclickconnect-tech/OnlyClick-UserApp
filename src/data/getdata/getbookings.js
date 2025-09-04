import supabase from "../supabaseClient";

export default async function getbookings() {
  const { data, error } = await supabase
    .schema("oneclick")
    .from("bookings")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return { arr: [], error };
  }

  if (!data) {
    console.warn("No data returned from bookings");
    return { arr: [], error: null };
  }

  const getdateTime = (timestamp) => {
    const [date, timeWithZone] = timestamp.split("T");
    const time = timeWithZone.split("+")[0];
    return [date, time];
  };

  const formatdata = (element) => {
    const [date, time] = getdateTime(element.date_time_created);

    return {
      id: element.id,
      service_name: element.service_name,
      date,
      time,
      location: element.location,
      status: element.status,
      provider: element.tm_name,
      price: element.payment_amount,
      category: element.category,
      bookingTime: date,
      Contact: `+91 ${element.tm_contact}`,
    };
  };

  const arr = data.map(formatdata);
  return { arr, error: null };
}
