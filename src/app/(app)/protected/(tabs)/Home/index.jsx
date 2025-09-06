import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../../../../components/Home/Header";
import Info from "../../../../../components/Home/Info";
import Data from "../../../../../components/Home/Data";
import Contact from "../../../../../components/Contact/Contact";
import { useEffect } from "react";
import supabase from "../../../../../data/supabaseClient";

export default function index() {
  // TO BE REMOVED 
  useEffect(() => {
    const tempfunc = async () => {
      const { data, error } = await supabase.auth.getSession()
      const token = data.session?.access_token;
      console.log("Current Access Token:", token);
    }
    tempfunc()
  }, [])

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <Header />
        <Info />
        <Data />
      </ScrollView>
      <Contact />
    </>
  );
}

const styles = StyleSheet.create({});
