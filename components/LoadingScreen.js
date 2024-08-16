
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Animated,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import image from "../assets/logo/Logo1.png";

const LoadingScreen = () => {
  const [showInternetMessage, setShowInternetMessage] = useState(false);
  const [randomIndex, setRandomIndex] = useState();
  const quotes = [
    "Cinema is a mirror by which we often see ourselves - Alejandro Gonzalez Inarritu",
    "To make a film is easy; to make a good film is war. To make a very good film is a miracle. - Alejandro Gonzalez Inarritu",
    "Cinema is not only about making people dream. It's about changing things and making people think. - Nadine Labaki",
    "Cinema can fill in the empty spaces of your life and your loneliness. - Pedro Almodovar",
    "Cinema is the most beautiful fraud in the world. - Jean-Luc Godard",
    "A story should have a beginning, a middle and an end, but not necessarily in that order. - Jean-Luc Godard",
    "A Film is a Petrified Fountain of Thought. - Jean Cocteau",
    "If a million people see my movie, I hope they see a million different movies. - Quentin Tarantino",
    "I Hate Television. I Hate It As Much As Peanuts. But I Can't Stop Eating Peanuts. - Orson Welles",
    "All I need to make a comedy is a park, a policeman and a pretty girl. - Charlie Chaplin",
    "Watchlist a content you like, so you do not loose it for later - Arsh",
    "Cinema should make you forget you are sitting in a theater. - Roman Polanski",
    "We need Storytelling. Otherwise, life just goes on and on like the number Pi. - Ang Lee",
    "The lies are in the dialogue, the truth is in the visuals. - Kelly Reichardt",
    "When people ask me if I went to film school I tell them, 'no, I went to films'. - Quentin Tarantino",
    "Cinema is life with the dull bits cut out. - Alfred Hitchcock",
  ];

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeout = setTimeout(() => setShowInternetMessage(true), 5000);
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      })
    ).start();
    setRandomIndex(Math.floor(Math.random() * quotes.length));
    return () => clearTimeout(timeout);
  }, [rotation]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolation }],
  };

  return (
    <View style={styles.container}>
      <Animated.Image source={image} style={[styles.logo, animatedStyle]} />
      {/* <ActivityIndicator
        size="large"
        color="#FFFBAA"
        style={styles.indicator}
      /> */}
      <View className="flex items-center justify-center pt-8 px-6">
        <Text className="text-gray-400 font-semibold text-lg">
          {quotes[randomIndex]}
        </Text>
      </View>
      {showInternetMessage && (
        <View className="flex items-center justify-center pt-8">
          <Text className="text-gray-400 font-semibold text-lg">
            Check Internet...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 128, // 32 * 4 = 128
    height: 128,
    borderRadius: 20, // 32 * 2 = 64; half is the radius
    marginBottom: 40,
  },
  indicator: {
    marginTop: 20,
  },
});

export default LoadingScreen;
