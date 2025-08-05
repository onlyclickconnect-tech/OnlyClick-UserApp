import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../../../../components/Home/Header";
import Info from "../../../../../components/Home/Info";
import Data from "../../../../../components/Home/Data";
import Contact from "../../../../../components/Contact/Contact";

export default function index() {
  return (
    <>
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Header />
      <Info />
      <Data />
    </ScrollView>
    <Contact/>
    </>
  );
}

const styles = StyleSheet.create({});
