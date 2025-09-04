// Services Data - Only Click User App
// Complete service catalog with all services
import supabase from './supabaseClient.js';


// get unique categories from services
const categoryMeta = {
  electrical: {
    icon: "flash",
    color: "#9C27B0",
    description: "Complete electrical solutions",
  },
  plumbing: {
    icon: "water",
    color: "#2196F3",
    description: "Professional plumbing services",
  },
  cleaning: {
    icon: "home",
    color: "#FF9800",
    description: "Deep cleaning and maintenance",
  },
  carpentry: {
    icon: "hammer",
    color: "#4CAF50",
    description: "Expert carpentry solutions",
  },
  ac_service: {
    icon: "snow",
    color: "#00BCD4",
    description: "AC installation and repair",
  },
  consultation: {
    icon: "clipboard",
    color: "#795548",
    description: "Expert consultation",
  },
};

// Category images mapping
export const categoryImages = {
  electrical: require("../../assets/images/electrical.png"),
  plumbing: require("../../assets/images/plumbing.png"),
  carpentry: require("../../assets/images/carpentry.png"),
  cleaning: require("../../assets/images/cleaning.png"),
  ac: require("../../assets/images/ACservices.png"),
  consultation: require("../../assets/images/painting.png"),
  all: require("../../assets/images/allServices.png"),
};

// Merge metadata with categories fetched from DB
export const allCategories = async () => {
  const { data, error } = await supabase.schema("oneclick").from("services").select("category");

  if (error) {
    console.error(error);
    return [];
  }

  const uniqueCategories = [...new Set(data.map((item) => item.category))];

  return uniqueCategories.map((cat) => ({
    id: cat.toLowerCase().replace(/\s+/g, "_"),
    name: cat,
    ...categoryMeta[cat.toLowerCase().replace(/\s+/g, "_")],
  }));
};

  export const allServices = async () => {
    const { data, error } = await supabase.schema("oneclick").from("services").select("*");

    if (error) {
      console.error(error);
      return [];
    }
    return data;
  };




export const getServicesByCategory = async (categoryId) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("category", categoryId);

  if (error) {
    console.error(error);
    return [];
  }
  return data;
};

// get service by ID
export const getServiceById = async (serviceId) => {
  const { data, error } = await supabase
    .schema("oneclick")
    .from("services")
    .select("*")
    .eq("service_id", serviceId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return data;
};


// search services
export const searchServices = async (query) => {
  const { data, error } = await supabase
    .schema("oneclick")
    .from("services")
    .select("*")
    .or(
      `title.ilike.%${query}%,description.ilike.%${query}%,sub_category.ilike.%${query}%`
    );

  if (error) {
    console.error(error);
    return [];
  }
  return data;
};



export default {
  // serviceCategories,
  allCategories,
  allServices,
  getServicesByCategory,
  getServiceById,
  searchServices
};
