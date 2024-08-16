import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Svg, Path } from "react-native-svg";

const WatchListButton = ({ onPress, styles, color, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={` rounded-full ${styles}`}
      disabled={disabled}
    >
      <View className="borde-2 border-white">
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-list-check"
        >
          <Path d="M11 18H3" />
          <Path d="m15 18 2 2 4-4" />
          <Path d="M16 12H3" />
          <Path d="M16 6H3" />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

export default WatchListButton;
