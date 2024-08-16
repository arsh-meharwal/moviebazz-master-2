import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const TabsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="movieDetails" options={{ headerShown: false }} />
      <Stack.Screen name="profileDetail" options={{ headerShown: false }} />
      <Stack.Screen name="tvDetails" options={{ headerShown: false }} />
      <Stack.Screen name="searchPage" options={{ headerShown: false }} />
      <Stack.Screen name="userProfile" options={{ headerShown: false }} />
      <Stack.Screen name="franchiseDetail" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabsLayout;
