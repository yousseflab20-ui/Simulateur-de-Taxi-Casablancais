import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
export default function mapApplication() {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 33.589886,
                    longitude: -7.603869,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{ latitude: 33.589886, longitude: -7.603869 }}
                    title="Casablanca"
                    description="Casa"
                />
            </MapView>

        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});