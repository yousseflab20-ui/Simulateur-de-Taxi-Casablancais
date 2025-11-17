import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { getRides, saveRides } from "../utils/storage";

export default function history() {
    const [rides, setRides] = useState<any[]>([]);

    useEffect(() => {
        loadRides();
    }, []);

    const loadRides = async () => {
        const ridesData = await getRides();
        // Trier par date décroissante (plus récent en premier)
        const sortedRides = (ridesData || []).sort((a: { date: any; }, b: { date: any; }) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
        });
        setRides(sortedRides);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "Date inconnue";
        try {
            const date = new Date(dateString);
            // Vérifier si la date est valide
            if (isNaN(date.getTime())) return "Date inconnue";
            return date.toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "Date inconnue";
        }
    };

    const totalRides: number = rides.length;

    const totalSpent = rides.reduce(
        (sum, ride) => sum + (ride.price || 0),
        0
    );

    const mostExpensive = rides.length > 0
        ? Math.max(...rides.map((r) => r.price || 0))
        : 0;

    const deleteRide = async (index: number) => {
        Alert.alert(
            "Confirmer la suppression",
            "Voulez-vous vraiment supprimer cette course?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const updatedRides = rides.filter((_, i) => i !== index);
                        await saveRides(updatedRides);
                        setRides(updatedRides);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>📊 Statistiques</Text>
                <Text style={styles.stat}>🚖 Nombre total de courses : {totalRides}</Text>
                <Text style={styles.stat}>💰 Montant total dépensé : {totalSpent.toFixed(2)} DH</Text>
                <Text style={styles.stat}>
                    🏆 Course la plus chère : {mostExpensive.toFixed(2)} DH
                </Text>
            </View>

            {rides.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>📭 Aucune course enregistrée</Text>
                </View>
            ) : (
                <SwipeListView
                    data={rides}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.date}>{formatDate(item.date)}</Text>
                            <Text style={styles.infoText}>
                                📍 De: {item.depart?.latitude?.toFixed(4) || 'N/A'}, {item.depart?.longitude?.toFixed(4) || 'N/A'}
                            </Text>
                            <Text style={styles.infoText}>
                                🎯 À: {item.destination?.latitude?.toFixed(4) || 'N/A'}, {item.destination?.longitude?.toFixed(4) || 'N/A'}
                            </Text>
                            <Text style={styles.infoText}>📏 Distance: {item.distance?.toFixed(2) || '0.00'} km</Text>
                            <Text style={styles.priceText}>💰 Prix: {item.price?.toFixed(2) || '0.00'} DH</Text>
                            <Text style={styles.infoText}>⏱️ Durée: {item.duration || 0} min</Text>
                            <View
                                style={[
                                    styles.badge,
                                    item.timeOfDay === "jour" ? styles.jour : styles.nuit,
                                ]}
                            >
                                <Text style={styles.badgeText}>
                                    {item.timeOfDay === "jour" ? "☀️ Jour" : "🌙 Nuit"}
                                </Text>
                            </View>
                        </View>
                    )}
                    renderHiddenItem={({ item, index }) => (
                        <View style={styles.rowBack}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteRide(index)}
                            >
                                <Text style={styles.deleteText}>🗑️ Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-100}
                    disableRightSwipe
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#f5f5f5"
    },
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
    date: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 10,
        color: "#333"
    },
    infoText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    priceText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#DC143C",
        marginVertical: 5,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginTop: 8,
    },
    badgeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
    jour: { backgroundColor: "#FFA500" },
    nuit: { backgroundColor: "#4169E1" },
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
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    stat: {
        fontSize: 16,
        marginBottom: 8,
        color: "#666",
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
        borderRadius: 12,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        fontWeight: '600',
    },
});