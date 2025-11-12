import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AVAILABLE_TAXIS, CASA_CENTER, USER_POSITION } from "../data/taxiData";
type MyLocation = {
  coords: {
    latitude: number;
    longitude: number;
  };
};
export default function mapApplication() {
  const [userLocation, setUserLocation] = useState<MyLocation | null>(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setUserLocation(currentLocation);
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
          pinColor="red"
        />
      ))}
    </MapView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
