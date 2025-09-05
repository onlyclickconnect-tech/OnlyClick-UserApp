import { useState } from "react";
import { updateProfile as updateProfileService } from "../app/api/userServices.js";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateProfileService(updates);
      setLoading(false);
      console.log(result);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  };

  return { updateProfile, loading, error };
};
