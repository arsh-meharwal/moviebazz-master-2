import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({ title, handlePress, containerStyles, isLoading }) => {
  return (
    <TouchableOpacity
      className={`bg-yellow-300 rounded-xl  justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Text className="text-primary font-semibold text-lg">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
