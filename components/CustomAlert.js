import React, { useEffect } from "react";
import { View, Text } from "react-native";

const CustomAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Close after 4 seconds
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  return (
    <View
      className={`absolute  flex justify-center items-center bg-gray-600 rounded-xl shadow-lg z-10 h-10 top-1/2`}
    >
      <Text
        className={`text-white text-center text-base p-2 justify-center items-center font-semibold`}
      >
        {message}
      </Text>
    </View>
  );
};

export default CustomAlert;
