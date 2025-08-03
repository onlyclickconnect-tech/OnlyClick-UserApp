import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import useCurrentUserDetails from "../../hooks/useCurrentUserDetails";
import useDimension from "../../hooks/useDimensions";
import headerStyle from "../../styles/Home/headerStyle";
import Badge from "../common/Badge";

function Header() {
  const [hasNotification, setHasNotification] = useState(false);
  const { screenHeight, screenWidth } = useDimension();
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const { userAddress } = useCurrentUserDetails();
  const router = useRouter();
  const styles = headerStyle();
  const searchService = async () => {
    console.log("user searched");
  };
  useEffect(() => {
    setAddress(userAddress);
  }, []);
  const changeAddress = () => {
    console.log("pressed");
  };
  return (
    <LinearGradient colors={["#4cb6c9", "#3898b3"]} style={styles.header}>
      <View style={styles.locationAndNotification}>
        <View style={styles.location}>
          <Text style={{ fontSize: 15, color: "white" }}>Location</Text>
          <TouchableOpacity style={styles.locationText} onPress={changeAddress}>
            {/*TODO:  */}
            <Entypo name="location-pin" size={24} color="#f8bd00" />
            <Text style={{ fontSize: 15, color: "white" }}>{address}</Text>
            <AntDesign
              name="down"
              size={12}
              style={{ fontWeight: "bold" }}
              color="#f8bd00"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.notification}>
          <Badge
            pressable={true}
            onPress={() => {
              // console.log("Pressed");
              router.navigate("/protected/Notifications");
            }}
            hasBadge={hasNotification}
            style={{
              height: screenHeight * 0.25 * 0.2,
              width: screenWidth * 0.1,
              backgroundColor: "#56bacc",
              border: 1,
              borderRadius: 5,
            }}
            badgeSize={15}
            badgeColor={"red"}
            badgeTop={-6}
            badgeRight={-6}
            textColor="white"
            withNumbers={false}
            element={<Ionicons name="notifications" size={27} color="white" />}
          />
        </View>
      </View>

      {/* search and profile */}
      <View style={styles.searchAndProfile}>
        <View style={styles.search}>
          <View
            style={{
              height: 30,
              width: 30,
              position: "absolute",
              left: 20,
              zIndex: 1,
            }}
          >
            <FontAwesome name="search" size={24} color="#3898b3" />
          </View>
          <TextInput
            placeholder="Search"
            style={styles.searchText}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            returnKeyType="search"
            placeholderTextColor={"grey"}
            onSubmitEditing={searchService}
          />
        </View>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => {
            router.navigate("/(app)/protected/(tabs)/Profile");
          }}
        >
          <Feather name="shopping-cart" size={28} color="#3898b3" backgroundColor="#ffffffff" padding={5} width={40} height={40} borderRadius={5} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
export default Header;
