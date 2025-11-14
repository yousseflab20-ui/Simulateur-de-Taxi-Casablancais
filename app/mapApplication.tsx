import { casaLocations } from "@/data/casaLocations";
import { calculateTime, calculation2 } from "@/utils/calculations";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AVAILABLE_TAXIS, CASA_CENTER, USER_POSITION } from "../data/taxiData";
type MyLocation = {
  coords: {
    latitude: number;
    longitude: number;
  };
};
interface customText3 {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}
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
  const [loading2] = useFonts({
    Font3: require("../font/MomoTrustDisplay-Regular.ttf"),
  });
  const CustomText2 = ({ children, style }: customText3) => (
    <View>
      <Text style={{ fontFamily: "Font3" }}>{children}</Text>
    </View>
  );
  const user = {
    latitude: 33.5731,
    longitude: -7.5898,
  };

  const taxi = {
    latitude: 33.5881,
    longitude: -7.6843,
  };
  const distance = calculation2(user, taxi);
  console.log(`${distance}`);

  const duration = calculateTime(distance);
  console.log(`${duration}$`);
  return (
    <View style={{ flex: 1 }}>
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
  container: { flex: 1 },
  map: { flex: 1 },
});
