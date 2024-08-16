import {
  View,
  Text,
  BackHandler,
  ScrollView,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { getSearchQuery } from "../api/apiCall";
import icons from "../../assets/icons/search.png";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchPage = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      Keyboard.isVisible();
      setShowSuggestions(false);
      if (showSuggestions) {
        return true; // Prevent default behavior
      } else return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    if (searchInputRef.current) {
      setShowHistory(true);
      searchInputRef.current.focus();
    }
    console.log("useEffect", showHistory);
    return () => backHandler.remove();
  }, []);

  const fetchSuggestions = async (text) => {
    try {
      console.log(text);
      const response = await getSearchQuery(text);
      setSuggestions(response.results);
      setShowHistory(false);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setShowSuggestions(false);
    }
    console.log(showHistory);
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 600),
    []
  );

  const handleInputChange = async (text) => {
    if (text) {
      debouncedFetchSuggestions(text);
    } else {
      setShowSuggestions(false);
    }
  };

  const handlePress = (item) => {
    console.log(item);
    if (item.media_type === "movie") {
      router.push(`/movieDetails?id=${item.id}`);
    } else if (item.media_type === "tv") {
      router.push(`/tvDetails?id=${item.id}`);
    } else if (item.media_type === "person") {
      router.push(`/profileDetail?id=${item.id}`);
    }
  };
  return (
    <View className="bg-black h-full">
      <ScrollView>
        <View className="mx-2 mt-10">
          <View className="flex flex-row items-center space-x-4 w-full h-14 px-4 my-2 bg-black rounded-2xl border-2 border-gray-500 focus:border-white">
            <TextInput
              className="text-lg mt-0.5 text-white flex-1 font-pregular ml-3"
              placeholder="Search..."
              placeholderTextColor="#CDCDE0"
              onChangeText={handleInputChange}
              ref={searchInputRef}
            />

            <TouchableOpacity className=" rounded-full">
              <Image
                source={icons}
                className="w-5 h-5 mr-4"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
        {showSuggestions && suggestions && (
          <ScrollView className="mx-2" pointerEvents="box-none">
            <View className="w-full bg-black h-auto flex-col rounded-lg border-b border-l border-r border-gray-600">
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={
                    item.id.toString() +
                    (item.poster_path ? item.poster_path : "")
                  }
                  onPress={() => handlePress(item)}
                >
                  <View className=" flex-row justify-around items-center h-16 ml-8 mr-6">
                    <View className="flex items-center justify-center w-8 py-1">
                      {item.poster_path && (
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                          }}
                          className="h-full w-14"
                          resizeMode="cover"
                        />
                      )}
                      {item.profile_path && (
                        <Image
                          source={{
                            uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}`,
                          }}
                          className="h-full w-14"
                          resizeMode="cover"
                        />
                      )}
                      {!item.profile_path && !item.poster_path && (
                        <Image
                          source={{
                            uri: "https://via.placeholder.com/75?text=No+Image+Found",
                          }}
                          className="h-full w-14"
                          resizeMode="contain"
                        />
                      )}
                    </View>
                    <View className="flex-1 items-center justify-center">
                      {item.name && (
                        <Text className="text-base text-white font-semibold">
                          {item.name.length > 22
                            ? item.name.slice(0, 22) + "..."
                            : item.name}
                        </Text>
                      )}
                      {item.title && (
                        <Text className="text-base text-white font-semibold">
                          {item.title.length > 22
                            ? item.title.slice(0, 22) + "..."
                            : item.title}
                        </Text>
                      )}
                    </View>
                    <View className="flex items-center justify-center">
                      <Text className="text-sm text-gray-300">
                        {item.media_type !== "tv" ? item.media_type : "series"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchPage;
