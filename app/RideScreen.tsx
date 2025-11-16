import { useTaxiStore } from "@/store/useTaxiStore";
import { saveRides } from "@/utils/storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Ride() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const [seconds, setSeconds] = useState(0);
    const { activeRide, endRide, cancelRide, rideHistory } = useTaxiStore();
    const finishRideAuto = async () => {
        if (!activeRide) return;

        await saveRides([...rideHistory, activeRide]);

        endRide();

        router.push("/mapApplication");
    }
    useEffect(() => {
        if (seconds >= 45 && activeRide) {
            finishRideAuto()
        }
    }, [seconds, activeRide])
    const [taxiPosition, setTaxiPosition] = useState(
        activeRide ? activeRide.depart : { latitude: 0, longitude: 0 }
    );


    const [progress, setProgress] = useState(0);

    const [eta, setEta] = useState('--:--');

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    useEffect(() => {
        if (!activeRide) return;

        const totalDuration = 50;
        const remainingSeconds = Math.max(0, totalDuration - seconds);
        const arrivalTime = new Date(Date.now() + remainingSeconds * 1000);

        setEta(arrivalTime.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        }));
    }, [seconds, activeRide]);

    useEffect(() => {
        console.log('Active Ride Data:', activeRide);

        if (mapRef.current && activeRide) {
            setTimeout(() => {
                mapRef.current?.fitToCoordinates(
                    [activeRide.depart, activeRide.destination],
                    {
                        edgePadding: { top: 150, right: 50, bottom: 300, left: 50 },
                        animated: true
                    }
                );
            }, 500);
        }

        if (!activeRide) return;

        const totalDistance = Math.sqrt(
            Math.pow(activeRide.destination.latitude - activeRide.depart.latitude, 2) +
            Math.pow(activeRide.destination.longitude - activeRide.depart.longitude, 2)
        );

        const interval = setInterval(() => {
            setTaxiPosition((prev: { latitude: number; longitude: number; }) => {
                const latDiff = activeRide.destination.latitude - prev.latitude;
                const lngDiff = activeRide.destination.longitude - prev.longitude;

                const remainingDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

                const newProgress = ((totalDistance - remainingDistance) / totalDistance) * 100;
                setProgress(Math.min(newProgress, 100));

                if (remainingDistance < 0.0001) {
                    Alert.alert(
                        '🎉 Arrivée',
                        'Le taxi est arrivé à destination!',
                        [{ text: 'OK' }]
                    );
                    return prev;
                }

                return {
                    latitude: prev.latitude + (latDiff * 0.02),
                    longitude: prev.longitude + (lngDiff * 0.02),
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeRide]);

    const handleEndRide = () => {
        Alert.alert(
            '⭐ Évaluer la course',
            'Comment était votre expérience?',
            [
                {
                    text: '⭐⭐⭐⭐⭐ Excellent',
                    onPress: () => finishRide(5)
                },
                {
                    text: '⭐⭐⭐⭐ Bien',
                    onPress: () => finishRide(4)
                },
                {
                    text: '⭐⭐⭐ Moyen',
                    onPress: () => finishRide(3)
                },
                {
                    text: 'Passer',
                    style: 'cancel',
                    onPress: () => finishRide(0)
                }
            ]
        );
    };

    const finishRide = (rating: number) => {
        if (rating > 0) {
            console.log('Rating donné:', rating, '⭐');
        }
        endRide();
        router.push('/mapApplication');
    };

    const handleCancelRide = () => {
        Alert.alert(
            '⚠️ Annuler la course',
            'Êtes-vous sûr de vouloir annuler cette course?',
            [
                { text: 'Non', style: 'cancel' },
                {
                    text: 'Oui, annuler',
                    style: 'destructive',
                    onPress: () => {
                        cancelRide();
                        router.push('/mapApplication');
                    }
                }
            ]
        );
    };

    const handleCallDriver = () => {
        Alert.alert(
            '📞 Appel en cours',
            `Appel vers ${activeRide.driver?.name}\n${activeRide.driver?.phone}`,
            [{ text: 'OK' }]
        );
    };

    if (!activeRide) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ Aucune course active</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/mapApplication')}>
                    <Text style={styles.buttonText}>Retour à la carte</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: activeRide.depart?.latitude || 33.5899,
                    longitude: activeRide.depart?.longitude || -7.6039,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Polyline
                    coordinates={[activeRide.depart, activeRide.destination]}
                    strokeColor="#007AFF"
                    strokeWidth={4}
                />

                <Marker
                    coordinate={activeRide.depart}
                    title="Départ"
                    pinColor="green"
                />

                <Marker
                    coordinate={activeRide.destination}
                    title="Destination"
                    pinColor="red"
                />

                <Marker
                    coordinate={taxiPosition}
                    title="Votre Taxi"
                    pinColor="yellow"
                />
            </MapView>

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>🚖 Course en cours</Text>

                <View style={styles.timerBox}>
                    <Text style={styles.timerLabel}>⏱️ Temps écoulé</Text>
                    <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        {progress.toFixed(0)}% complété
                    </Text>
                </View>

                <View style={styles.etaContainer}>
                    <Text style={styles.etaLabel}>🕐 Arrivée prévue:</Text>
                    <Text style={styles.etaValue}>{eta}</Text>
                </View>

                <View style={styles.divider} />

                {activeRide.distance !== undefined && (
                    <Text style={styles.infoText}>
                        📍 Distance: {activeRide.distance.toFixed(2)} km
                    </Text>
                )}

                {activeRide.duration !== undefined && (
                    <Text style={styles.infoText}>
                        ⏱️ Durée estimée: {activeRide.duration} min
                    </Text>
                )}

                {activeRide.prix !== undefined && (
                    <Text style={styles.infoPrix}>
                        💰 Prix: {activeRide.prix.toFixed(2)} DH
                    </Text>
                )}

                {activeRide.driver && (
                    <View style={styles.driverInfo}>
                        <Text style={styles.driverTitle}>Chauffeur:</Text>
                        <Text style={styles.driverText}>👤 {activeRide.driver.name}</Text>
                        <Text style={styles.driverText}>🚗 {activeRide.driver.car}</Text>
                        <Text style={styles.driverText}>🔢 {activeRide.driver.plate}</Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.callButton]}
                    onPress={handleCallDriver}
                >
                    <Text style={styles.buttonText}>📞 Appeler chauffeur</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.endButton]}
                    onPress={handleEndRide}
                >
                    <Text style={styles.buttonText}>✅ Terminer la course</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancelRide}
                >
                    <Text style={styles.buttonText}>❌ Annuler</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    infoCard: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    timerBox: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    timerLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    timerValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#DC143C',
        fontFamily: 'monospace',
    },
    progressContainer: {
        marginTop: 15,
        marginBottom: 10,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#28a745',
        borderRadius: 5,
    },
    progressText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    etaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    etaLabel: {
        fontSize: 14,
        color: '#666',
    },
    etaValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    infoText: {
        fontSize: 15,
        marginBottom: 8,
        color: '#333',
    },
    infoPrix: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DC143C',
        marginTop: 5,
    },
    driverInfo: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    driverTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    driverText: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        gap: 10,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    callButton: {
        backgroundColor: '#007AFF',
    },
    endButton: {
        backgroundColor: '#28a745',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: {
        fontSize: 20,
        marginBottom: 30,
        color: '#333',
        fontWeight: 'bold',
    },
});