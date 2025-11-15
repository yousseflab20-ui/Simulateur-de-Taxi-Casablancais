import { create } from 'zustand';
export const useTaxiStore = create((set) => ({
    lightMode: false,
    activeRide: null,
    rideHistory: [],

    tooggleNightMode: () => set((state: { lightMode: any }) => ({ lightMode: !state.lightMode })),

    starRide: (riderData: any) => set(() => ({ activeRide: riderData })),

    endRide: () =>
        set((state: { activeRide: any; riderHistory: any }) => {
            if (!state.activeRide) return {}
            const riderwithData = { ...state.activeRide, endAt: new Date() }
            return {
                activeRide: null,
                riderHistory: [...state.riderHistory, riderwithData],
            }
        }),
    cancelRide: () => set(() => ({ activeRide: null })),
}))