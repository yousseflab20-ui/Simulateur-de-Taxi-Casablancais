import { create } from 'zustand';
interface TaxiStore {
    isNightMode: boolean;
    activeRide: any | null;
    rideHistory: any[];

    toggleNightMode: () => void;
    startRide: (rideData: any) => void;
    endRide: () => void;
    cancelRide: () => void;
}

export const useTaxiStore = create<TaxiStore>((set) => ({
    isNightMode: false,
    activeRide: null,
    rideHistory: [],

    toggleNightMode: () => set((state) => ({ isNightMode: !state.isNightMode })),
    startRide: (rideData) => set(() => ({ activeRide: rideData })),
    endRide: () =>
        set((state) => {
            if (!state.activeRide) return {};
            const rideWithDate = { ...state.activeRide, endAt: new Date() };
            return {
                activeRide: null,
                rideHistory: [...state.rideHistory, rideWithDate],
            };
        }),
    cancelRide: () => set(() => ({ activeRide: null })),
}));