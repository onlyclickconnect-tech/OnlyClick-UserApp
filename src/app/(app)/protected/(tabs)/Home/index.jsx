import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Contact from "../../../../../components/Contact/Contact";
import Data from "../../../../../components/Home/Data";
import Header from "../../../../../components/Home/Header";
import Info from "../../../../../components/Home/Info";
import { useAppUpdate } from "../../../../../context/AppUpdateContext";
import Text from "../../../../../components/ui/Text";

export default function HomeScreen() {
  const { forceCheckForUpdates } = useAppUpdate();

  const handleCheckForUpdates = () => {
    console.log("🔄 Manual update check triggered from homepage");
    forceCheckForUpdates();
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <Header />
        
        {/* Update available button */}
        <TouchableOpacity 
          onPress={handleCheckForUpdates}
          style={styles.updateButton}
          activeOpacity={0.8}
        >
          <View style={styles.updateButtonContent}>
            <View style={styles.updateIconContainer}>
              <Text style={styles.updateIcon}>🚀</Text>
            </View>
            <View style={styles.updateTextContainer}>
              <Text style={styles.updateTitle}>Update Available!</Text>
              <Text style={styles.updateSubtitle}>New features & improvements</Text>
            </View>
            <View style={styles.updateArrowContainer}>
              <Text style={styles.updateArrow}>→</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <Info />
        <Data />
      </ScrollView>
      <Contact />
    </>
  );
}

const styles = StyleSheet.create({
  updateButton: {
    backgroundColor: '#FF6B35',
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF8C42',
  },
  updateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingHorizontal: 20,
  },
  updateIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  updateIcon: {
    fontSize: 24,
  },
  updateTextContainer: {
    flex: 1,
  },
  updateTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  updateSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  updateArrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateArrow: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
