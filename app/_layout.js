import { View, Text, StatusBar } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import GlobalProvider from "@/context/GlobalProvider";
// import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </GlobalProvider>
  );
};

export default RootLayout;
