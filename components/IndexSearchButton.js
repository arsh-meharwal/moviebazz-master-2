import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";

import icons from "../assets/icons/search.png";
import { router } from "expo-router";

const SearchButton = () => {
  const searchPress = () => {
    router.push("/searchPage");
  };

  return (
    <TouchableOpacity onPress={searchPress}>
      <View className="flex flex-row justify-between items-center space-x-4 w-full h-12 px-4 my-2 bg-black rounded-2xl border-2 border-gray-500 focus:border-white">
        <Text className="text-lg text-gray-400">Search anything...</Text>

        <Image source={icons} className="w-5 h-5 mr-4" resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
};

export default SearchButton;
