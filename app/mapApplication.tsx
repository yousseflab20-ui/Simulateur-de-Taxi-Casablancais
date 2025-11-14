import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import React, { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AVAILABLE_TAXIS, CASA_CENTER } from "../data/taxiData";

type MyLocation = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

interface PropsCoustm2 {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function MapApplication() {
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

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#20770e" />
      </View>
    );
  }

  const CoustmText3 = ({ children, style }: PropsCoustm2) => {
    return (
      <Text
        style={[
          {
            fontFamily: "Font3",
            fontSize: 18,
            color: "#fff",
            textAlign: "center",
          },
          style,
        ]}
      >
        {children}
      </Text>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={
          userLocation
            ? {
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }
            : CASA_CENTER
        }
        showsUserLocation={true}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Vous êtes ici"
            pinColor="blue"
          />
        )}

        {AVAILABLE_TAXIS.map((taxi) => (
          <Marker
            key={taxi.id}
            coordinate={{ latitude: taxi.latitude, longitude: taxi.longitude }}
            title={`Taxi ${taxi.id}`}
          >
            <FontAwesome6 name="taxi" size={24} color="red" />
          </Marker>
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <CoustmText3 style={{ fontSize: 20, fontWeight: "bold" }}>
            🚖 Réserver un Taxi
          </CoustmText3>
          <CoustmText3 style={{ fontSize: 14, marginTop: 5 }}>Hello</CoustmText3>
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
