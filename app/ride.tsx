import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function RideScreen() {
  // Recupérer les données envoyées depuis Booking.js
  const {
    fromLat,
    fromLng,
    toLat,
    toLng,
    depart,
    destination,
    distance,
    duration,
    price,
  } = useLocalSearchParams();

  const origin = {
    latitude: Number(fromLat),
    longitude: Number(fromLng),
  };

  const destinationCoord = {
    latitude: Number(toLat),
    longitude: Number(toLng),
  };

  // position taxi (initialement au départ)
  const [taxiPos, setTaxiPos] = useState(origin);

  const mapRef = useRef<MapView | null>(null);

  // Fit map between origin & destination
  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.fitToCoordinates([origin, destinationCoord], {
          edgePadding: { top: 100, bottom: 100, left: 100, right: 100 },
          animated: true,
        });
      }
    }, 500);
  }, []);

  // Simulation du déplacement du taxi
  useEffect(() => {
    const interval = setInterval(() => {
      setTaxiPos((prev) => {
        // Si وصل قريب للdestination → وقف
        if (
          Math.abs(prev.latitude - destinationCoord.latitude) < 0.0005 &&
          Math.abs(prev.longitude - destinationCoord.longitude) < 0.0005
        ) {
          return prev; // وقف
        }

        return {
          latitude:
            prev.latitude +
            (destinationCoord.latitude - origin.latitude) * 0.01,
          longitude:
            prev.longitude +
            (destinationCoord.longitude - origin.longitude) * 0.01,
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const [second, setSecond] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((prev) => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  });
  const minutes = Math.floor(second / 60);
  const remainingSconds = second % 60;
  return (
    <View style={{ flex: 1 }}>
      {/* Bouton retour */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          zIndex: 10,
          top: 50,
          left: 20,
          backgroundColor: "black",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>⬅ Retour</Text>
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Polyline entre départ & destination */}
        <Polyline
          coordinates={[origin, destinationCoord]}
          strokeWidth={5}
          strokeColor="blue"
        />

        {/* Marker depart */}
        <Marker coordinate={origin} title={String(depart)} pinColor="green" />

        {/* Marker destination */}
        <Marker
          coordinate={destinationCoord}
          title={String(destination)}
          pinColor="purple"
        />

        {/* Marker taxi (qui bouge) */}
        <Marker coordinate={taxiPos} title="Taxi" pinColor="red" />
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {String(minutes).padStart(2, "0")}:
          {String(remainingSconds).padStart(2, "0")}
        </Text>
      </MapView>
    </View>
  );
}
