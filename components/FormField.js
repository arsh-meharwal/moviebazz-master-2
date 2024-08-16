import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

const FormField = ({
  title,
  value,
  handleChangeText,
  placeholder,
  otherStyles,
  keyBoardType,
}) => {
  const [show, setShow] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-semibold">{title}</Text>
      <View className="w-full border border-gray-200 h-16 rounded-2xl focus:border-4 ">
        <TextInput
          className="h-full text-white"
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !show}
        />
      </View>
    </View>
  );
};

export default FormField;

{
  /* <TouchableOpacity
  onPress={() => {
    setShow(!show);
  }}
>
  <Image
    source={!show ? icons.eye : icons.eyehide}
    className="w-6 h-10 absolute py-10 z-1"
    resizeMode="contain"
  />
</TouchableOpacity>; */
}
