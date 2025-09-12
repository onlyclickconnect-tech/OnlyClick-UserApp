import { ScrollView, StyleSheet, View } from "react-native";
import Text from "../../../../../components/ui/Text"
import Header from "../../../../../components/Home/Header";
import Info from "../../../../../components/Home/Info";
import Data from "../../../../../components/Home/Data";
import Contact from "../../../../../components/Contact/Contact";
import { useEffect } from "react";
import supabase from "../../../../../data/supabaseClient";

export default function HomeScreen() {
  // TO BE REMOVED 
  useEffect(() => {
    const tempfunc = async () => {
      const { data, error } = await supabase.auth.getSession()
      const token = data.session?.access_token;
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
