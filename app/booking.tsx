import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BookingScreen() {
    return (
        <ScrollView style={styles.container}>

            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backText}>🔙 Retour</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>🚖 Réserver un Taxi</Text>

            {/* Ici tu peux ajouter formulaire / inputs plus tard */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    backButton: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#DC143C",
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
        marginBottom: 20,
    },
});
