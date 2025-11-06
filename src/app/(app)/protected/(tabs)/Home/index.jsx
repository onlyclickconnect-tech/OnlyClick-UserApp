import { ScrollView, StyleSheet } from "react-native";
import Contact from "../../../../../components/Contact/Contact";
import Data from "../../../../../components/Home/Data";
import Header from "../../../../../components/Home/Header";
import Info from "../../../../../components/Home/Info";

export default function HomeScreen() {

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
