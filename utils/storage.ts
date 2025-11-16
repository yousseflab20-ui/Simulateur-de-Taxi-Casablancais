import AsyncStorage from "@react-native-async-storage/async-storage";
const RIDES_KEY = "RIDE_HISTOPY"

export async function saveRides(rides: any[]): Promise<void> {
    try {
        await AsyncStorage.setItem(RIDES_KEY, JSON.stringify(rides));
    } catch (error) {
        console.log("Error saving rides:", error);
    }
}


export async function getRides() {
    try {
        const data = await AsyncStorage.getItem(RIDES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log("Error loading rides:", error);
        return [];
    }
}