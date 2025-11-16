import { useTaxiStore } from "@/store/useTaxiStore"; // import store
import {
  calculatePrice,
  calculateTime,
  calculation2,
} from "@/utils/calculations";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { casaLocations } from "./mapApplication";
export default function Booking() {
  const [depart, setDepart] = useState(Object.keys(casaLocations)[0]);
  const [destination, setDestination] = useState(Object.keys(casaLocations)[1]);

  const { isNightMode } = useTaxiStore();

  const fromCrood = casaLocations[depart];
  const toCrood = casaLocations[destination];

  let distance = 0;
  let price = 0;
  let duration = 0;
  if (depart !== destination) {
    distance = calculation2(fromCrood, toCrood);
    duration = calculateTime(distance);
    price = calculatePrice(distance, isNightMode);
  }
  const startRide = useTaxiStore((state) => state.startRide);
  const handleConfirm = () => {
    startRide({
      depart: fromCrood,
      destination: toCrood,
      distance: distance,
      price: price,
    });
    router.push("/ride");
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>🔙 Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🚖 Réserver un Taxi</Text>

        <Text style={styles.label}>📍 Point de Départ</Text>
        <Picker
          selectedValue={depart}
          onValueChange={(value) => setDepart(value)}
          style={styles.picker}
        >
          {Object.keys(casaLocations).map((name) => (
            <Picker.Item label={name} value={name} key={name} />
          ))}
        </Picker>

        <Text style={styles.label}>🎯 Destination</Text>
        <Picker
          selectedValue={destination}
          onValueChange={(value) => setDestination(value)}
          style={styles.picker}
        >
          {Object.keys(casaLocations).map((name) => (
            <Picker.Item label={name} value={name} key={name} />
          ))}
        </Picker>

        {depart !== destination ? (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.result}>📏 Distance: {distance} km</Text>
            <Text style={styles.result}>⏱ Temps: {duration} min</Text>
            <Text style={styles.result}>
              💰 Tarif ({isNightMode ? "Nuit" : "Jour"}): {price} DH
            </Text>
          </View>
        ) : (
          <Text style={{ marginTop: 20, color: "red" }}>
            🚫 Veuillez choisir deux lieux différents
          </Text>
        )}
        {depart !== destination && (
          <TouchableOpacity
            style={{
              backgroundColor: "#2E7D32",
              padding: 15,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={handleConfirm}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              ✅ Confirmer la Réservation
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#c55757ff",
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#31cf1cff",
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  picker: {
    backgroundColor: "#ffffffff",
    shadowColor: "#000",
    shadowOffset: { width: 50, height: 100 },
    shadowOpacity: 7.25,
    shadowRadius: 10.84,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
});
