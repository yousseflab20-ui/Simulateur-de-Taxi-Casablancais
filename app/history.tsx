import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { getRides } from "../utils/storage";
export default function HistoryScreen() {
    const [rides, setRides] = useState<any[]>()
    useEffect(() => {
        const fetchRides = async () => {
            const ridesData = await getRides()
            setRides(ridesData)
        }
        fetchRides()
    }, [])
    const fromData = (dataString: string | undefined) => {
        if (!dataString) return "Data inconnue";
        const date: any = new Date(dataString);
        return Date.toLocaleString()
    }
    const totalRides: number = rides ? rides.length : 0;

    const totalSpent = (rides ?? []).reduce(
        (sum, ride) => sum + (ride.price || 0),
        0
    );
    const mostExpensive =
        (rides ?? []).length > 0
            ? Math.max(...(rides ?? []).map((r) => r.price || 0))
            : 0;
    function deleteRide(index: number): void {
        throw new Error("Function not implemented.");
    }

    return (
        <View style={styles.container}>
            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>📊 Statistiques</Text>

                <Text style={styles.stat}>🚖 Nombre total de courses : {totalRides}</Text>

                <Text style={styles.stat}>💰 Montant total dépensé : {totalSpent} DH</Text>

                <Text style={styles.stat}>
                    🏆 Course la plus chère : {mostExpensive} DH
                </Text>
            </View>
            <SwipeListView
                data={rides}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.date}>{fromData(item.date)}</Text>
                        <Text>
                            {item.depart?.latitude},{item.depart?.longitude} → {item.destination?.latitude},{item.destination?.longitude}
                        </Text>
                        <Text>Distance: {item.distance} km</Text>
                        <Text>Prix: {item.price} DH</Text>
                        <Text>Durée: {item.duration} min</Text>
                        <View
                            style={[
                                styles.badge,
                                item.timeOfDay === "jour" ? styles.jour : styles.nuit,
                            ]}
                        >
                            <Text style={styles.badgeText}>{item.timeOfDay ?? "N/A"}</Text>
                        </View>
                    </View>
                )}
                renderHiddenItem={({ item, index }) => (
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 80,
                            height: '100%',
                            position: 'absolute',
                            right: 0,
                        }}
                        onPress={() => deleteRide(index)}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Supprimer</Text>
                    </TouchableOpacity>
                )}
                rightOpenValue={-80}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    date: { fontWeight: "bold", marginBottom: 5 },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginTop: 8,
    },
    badgeText: { color: "#fff", fontWeight: "bold" },
    jour: { backgroundColor: "orange" },
    nuit: { backgroundColor: "blue" },
    statsCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    stat: {
        fontSize: 16,
        marginBottom: 5,
    },

});