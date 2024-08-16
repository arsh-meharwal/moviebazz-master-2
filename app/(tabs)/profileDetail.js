import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Button,
  Linking,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  getProfileCredits,
  getProfileDetail,
  getProfileImages,
} from "../api/apiCall";
import Card from "@/components/Card";
import LoadingScreen from "@/components/LoadingScreen";
import { Circle, Path, Svg } from "react-native-svg";

const profileDetails = () => {
  const [data, setData] = useState();
  const [images, setImages] = useState();
  // const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);
  const [showCast, setShowCast] = useState([]);
  const [currCastPage, setCurrCastPage] = useState(1);
  const [totalCastPage, setTotalCastPage] = useState();
  const [crew, setCrew] = useState([]);
  const [showCrew, setShowCrew] = useState([]);
  const [currCrewPage, setCurrCrewPage] = useState(1);
  const [totalCrewPage, setTotalCrewPage] = useState();
  // const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [showAll, setShowAll] = useState(false);
  const [readMore, setReadMore] = useState(false);
  // const [showAllCast, setShowAllCast] = useState(false);
  // const [showAllCrew, setShowAllCrew] = useState(false);

  const { id } = useLocalSearchParams();
  console.log(id);

  const getInitData = async (id) => {
    try {
      const res = await getProfileDetail(id);
      const res2 = await getProfileCredits(id);
      const res3 = await getProfileImages(id);
      setData(res);
      if (res2.cast.length > 0) {
        setCast(res2.cast);
        setShowCast(res2.cast.slice(0, 10));
        setTotalCastPage(Math.ceil(res2.cast.length / 10));
      }
      if (res2.crew.length > 0) {
        setCrew(res2.crew);
        setShowCrew(res2.crew.slice(0, 10));
        setTotalCrewPage(Math.ceil(res2.crew.length / 10));
      }
      console.log(res2.crew);
      setImages(res3.profiles);
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInitData(id);
  }, []);

  useEffect(() => {
    if (cast.length !== 0) {
      if (currCastPage <= totalCastPage) {
        setShowCast(cast.slice((currCastPage - 1) * 10, currCastPage * 10));
      }
    }
  }, [currCastPage]);

  useEffect(() => {
    if (crew.length !== 0) {
      if (currCrewPage <= totalCrewPage) {
        setShowCrew(crew.slice((currCrewPage - 1) * 10, currCrewPage * 10));
      }
    }
  }, [currCrewPage]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loading)
    return (
      <SafeAreaView className="h-full">
        <ScrollView>
          <View className="bg-black h-full flex justify-center items-center">
            {data && (
              <>
                <View className=" border-4 border-white flex-1 justify-center items-center mt-12 w-40 h-48 rounded-xl">
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${data.profile_path}`,
                    }}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                  />
                </View>
                <Text className="font-semibold text-white text-3xl pt-6 pb-2">
                  {data.name}
                </Text>
              </>
            )}

            {data.biography && !readMore && (
              <View className="pt-2 px-4">
                <Text className="text-gray-200 text-lg font-semibold">
                  {data.biography.slice(0, 120)}
                </Text>

                <TouchableOpacity
                  onPress={() => setReadMore(true)}
                  className="bg-transparent rounded"
                >
                  <Text className="text-gray-300 text-lg">...Read More</Text>
                </TouchableOpacity>
              </View>
            )}
            {data.biography && readMore && (
              <View className="pt-2 px-4">
                <Text className="text-gray-200 text-lg font-semibold ">
                  {data.biography}
                </Text>
                <TouchableOpacity
                  onPress={() => setReadMore(false)}
                  className="bg-transparent rounded"
                >
                  <Text className="text-gray-300  text-lg">...Read Less</Text>
                </TouchableOpacity>
              </View>
            )}
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ flexGrow: 1 }}
              showsHorizontalScrollIndicator={false}
              className="py-4"
            >
              {images && (
                <View className="flex-row justify-center items-center">
                  {images.map((item) => (
                    <View
                      className="h-72 w-48"
                      key={(item.id + item.file_path).toString()}
                    >
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w500/${item.file_path}`,
                        }}
                        className="h-full w-full"
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
            {showCast.length > 0 && (
              <View className="flex py-4">
                <Text className="pl-6 py-2 mb-2 text-3xl font-semibold text-white">
                  Cast
                </Text>
                <View className="flex justify-center items-center">
                  <View className="flex-row flex-wrap justify-evenly">
                    {showCast.map((item) => (
                      <View key={item.id.toString() + `${Math.random()}`}>
                        <Card
                          id={item.id}
                          title={item.title || item.name}
                          image={item.poster_path}
                          style={"w-[168px] h-auto"}
                          percentage={item.vote_average.toFixed(1) * 10}
                          subtitle={`as ${item.character}`}
                          movie={item.media_type === "movie" ? true : false}
                          tv={item.media_type === "tv" ? true : false}
                          year={
                            item.media_type === "movie" &&
                            item.release_date !== null
                              ? `${item.release_date.slice(0, 4)} Movie`
                              : item.media_type === "tv" &&
                                item.first_air_date !== null
                              ? `${item.first_air_date.slice(0, 4)} Series`
                              : null
                          }
                        />
                      </View>
                    ))}
                  </View>
                  <View className=" flex-row items-center pr-2 mt-8 gap-4">
                    <TouchableOpacity
                      onPress={() =>
                        setCurrCastPage((prev) =>
                          prev === 1 ? prev : prev - 1
                        )
                      }
                    >
                      {/* Prev */}
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c4c4c4"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-left"
                      >
                        <Path d="m15 18-6-6 6-6" />
                      </Svg>
                    </TouchableOpacity>
                    <Text className="p-1 text-gray-300 text-base font-semibold">
                      {currCastPage}/{totalCastPage}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setCurrCastPage((prev) =>
                          prev < totalCastPage ? prev + 1 : prev
                        )
                      }
                    >
                      {/* Next */}
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c4c4c4"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-right"
                      >
                        <Path d="m9 18 6-6-6-6" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {showCrew.length > 0 && (
              <View className="flex py-4">
                <Text className="pl-6 py-2 mb-2 text-3xl font-semibold text-white">
                  Crew
                </Text>
                <View className="flex justify-center items-center">
                  <View className="flex-row flex-wrap justify-evenly">
                    {showCrew.map((item) => (
                      <View
                        key={
                          item.id.toString() +
                          "crew" +
                          item.job +
                          `${Math.random()}`
                        }
                      >
                        <Card
                          id={item.id}
                          title={item.title || item.name}
                          image={item.poster_path}
                          style={"w-[168px] h-auto"}
                          percentage={item.vote_average.toFixed(1) * 10}
                          subtitle={`${item.job}`}
                          movie={item.media_type === "movie" ? true : false}
                          tv={item.media_type === "tv" ? true : false}
                          year={
                            item.media_type === "movie" &&
                            item.release_date !== null
                              ? `${item.release_date.slice(0, 4)} Movie`
                              : item.media_type === "tv" &&
                                item.first_air_date !== null
                              ? `${item.first_air_date.slice(0, 4)} Series`
                              : null
                          }
                        />
                      </View>
                    ))}
                  </View>
                  <View className=" flex-row items-center pr-2 mt-8 gap-4">
                    <TouchableOpacity
                      onPress={() =>
                        setCurrCrewPage((prev) =>
                          prev === 1 ? prev : prev - 1
                        )
                      }
                    >
                      {/* Prev */}
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c4c4c4"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-left"
                      >
                        <Path d="m15 18-6-6 6-6" />
                      </Svg>
                    </TouchableOpacity>
                    <Text className="p-1 text-gray-300 text-base font-semibold">
                      {currCrewPage}/{totalCrewPage}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setCurrCrewPage((prev) =>
                          prev < totalCrewPage ? prev + 1 : prev
                        )
                      }
                    >
                      {/* Next */}
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c4c4c4"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-right"
                      >
                        <Path d="m9 18 6-6-6-6" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
};

export default profileDetails;
