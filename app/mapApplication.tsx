import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AVAILABLE_TAXIS, CASA_CENTER } from "../data/taxiData";

type MyLocation = {
  coords: {
    latitude: number;
    longitude: number;
  };
};
export default function mapApplication() {
  const [userLocation, setUserLocation] = useState<MyLocation | null>(null);
  const [loading, setLoading] = useState(true);

  // Load custom font
  const [fontsLoaded] = useFonts({
    Font3: require("../font/MomoTrustDisplay-Regular.ttf"), // Path correct
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission refusée", "Activez la localisation pour continuer.");
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation(currentLocation);
      } catch (error) {
        console.log("Erreur:", error);
        Alert.alert("Erreur", "Impossible d'obtenir la position actuelle.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <MapView initialRegion={CASA_CENTER} style={{ flex: 1 }}>
      <Marker coordinate={USER_POSITION} title="You are here" />

        {AVAILABLE_TAXIS.map((taxi) => (
          <Marker
            key={taxi.id}
            coordinate={{ latitude: taxi.latitude, longitude: taxi.longitude }}
            title={`Taxi ${taxi.id}`}
          >
            <FontAwesome6 name="taxi" size={24} color="red" />
          </Marker>
        ))}
        {casaLocations.map((check) => (
          <Marker key={check.id} coordinate={check.point} title={check.name} />
        ))}
      </MapView>
      <View style={{ left: 0, right: 0, alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#DC143C",
            bottom: 80,
            position: "absolute",
            padding: 15,
            borderRadius: 10,
          }}
        >
          <CustomText2>🚖 Réserver un taxi</CustomText2>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#DC143C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: "center",
  },
});
