import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" options={{ title: "HomePage" }} />
      <Stack.Screen
        name="mapApplication"
        options={{ title: "mapApplication" }}
      />
    </Stack>
  );
}
