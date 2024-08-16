import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const Card = ({
  title,
  image,
  percentage,
  year,
  id,
  style,
  movie,
  tv,
  person,
  ep,
  imageStyle,
  subtitle,
  clickDisable
}) => {
  const submit = () => {
    if (movie) {
      router.push(`/movieDetails?id=${id}`);
    } else if (tv) {
      router.push(`/tvDetails?id=${id}`);
    } else if (person) {
      router.push(`/profileDetail?id=${id}`);
    }
  };
  if (percentage >= 68) {
    borderColorClass = "border-green-500";
    textColorClass = "text-green-500";
  } else if (percentage >= 58 && percentage < 68) {
    borderColorClass = "border-amber-400";
    textColorClass = "text-amber-400";
  } else if (percentage < 58 && percentage >= 1) {
    borderColorClass = "border-red-400";
    textColorClass = "text-red-400";
  } else {
    borderColorClass = "border-white";
    textColorClass = "text-white";
  }
  let imageUrl =
    image !== null
      ? `https://image.tmdb.org/t/p/w500${image}`
      : "https://via.placeholder.com/500?text=No+Image+Found";

  return (
    <TouchableOpacity onPress={submit} className={``} disabled={tv&&ep?true:false}>
      <View
        className={`bg-white rounded-lg overflow-hidden shadow-md mx-1 my-3  ${style}`}
        key={id.toString() + title}
      >
        <Image
          source={{ uri: imageUrl }}
          className={`w-full ${imageStyle ? `${imageStyle}` : `h-56`} mb-1`}
        />
        <View
          className={`rounded-full bg-black w-12 h-12 absolute right-0 border-2 ${borderColorClass}  flex-1 items-center justify-center flex-row`}
        >
          <Text
            className={`${textColorClass} text-center font-bold text-[20px] ml-1`}
          >
            {percentage}
          </Text>
          <Text
            className={`${textColorClass} text-center font-bold text-[14px]`}
          >
            %
          </Text>
        </View>
        {tv && ep && (
          <Text className="text-base font-bold px-2">
            Ep:{ep} - {title.length > 20 ? title.slice(0, 19) + "..." : title}
          </Text>
        )}
        {!tv && !ep && (
          <Text className="text-base font-bold px-2">
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
          </Text>
        )}
        {tv && !ep && (
          <Text className="text-base font-bold px-2">
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
          </Text>
        )}
        {subtitle && (
          <Text className="text-base font-semibold text-gray-500 px-2">
            {subtitle}
          </Text>
        )}
        {year && <Text className="pb-2 px-2 text-sm">{year}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default Card;
