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
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  getAllRatings,
  getAllRatingsTv,
  getSimilarTv,
  getTvCredits,
  getTvDetail,
  getTvImages,
  getTVProviders,
  getTvReviews,
  getTvSeasonDetail,
  getTvVideos,
} from "../api/apiCall";
import Card from "@/components/Card";
import LoadingScreen from "@/components/LoadingScreen";
import YoutubeIframe from "react-native-youtube-iframe";
import WatchListButton from "@/components/WatchListButton";
import { addToWatchList, checkWatchlist, delTitle } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import CustomAlert from "@/components/CustomAlert";
import RT from "../../assets/RottenTomatoes.png";
import TMDB from "../../assets/TMDB.png";
import Tomato from "../../assets/Tomato.png";
import Audience from "../../assets/Audience.png";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const tvDetails = () => {
  const [data, setData] = useState([]);
  const { user } = useGlobalContext();
  const [seasonData, setSeasonData] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState([]);
  const [direction, setDirection] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [serviceProvider, setServiceProvider] = useState();
  const [loading, setLoading] = useState(true);
  const [endLoaded, setEndLoaded] = useState(false);
  const [similarLoaded, setSimilarLoaded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [isButtonAvailable, setIsButtonAvailable] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showRemovedAlert, setShowRemovedAlert] = useState(false);
  const [form, setForm] = useState({});

  const displayedData = showAll ? similar : similar.slice(0, 8);

  const { id } = useLocalSearchParams();

  const customAnimation = {
    duration: 200, // Set the duration to 200ms
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const toggleReadMore = () => {
    LayoutAnimation.configureNext(customAnimation);
    setReadMore(!readMore);
  };

  const getCredits = async (id) => {
    try {
      const res2 = await getAllRatingsTv(id);
      if (res2.response !== false) {
        setRatings(res2.ratings);
      }
      const res = await getTvCredits(id);
      setCredits(res.cast);
      setDirection(res.crew);
    } catch (error) {
      Alert.alert(error);
    }
  };

  const getCurrEpisodes = async (id, num) => {
    try {
      const res3 = await getTvSeasonDetail(id, num);
      setSeasonData(res3.episodes);
    } catch (error) {
      setCurrentSeason(1);
    }
  };

  const getImages = async (id) => {
    const res = await getTvImages(id);
    const res2 = await getTVProviders(id);
    if (Object.keys(res2.results).length !== 0) {
      setServiceProvider(res2.results);
    }

    if (res.backdrops.length > 0) {
      setImages(res.backdrops.slice(0, 5));
    }
  };

  const getInitData = async (id) => {
    try {
      console.log(id);
      const res = await getTvDetail(id);
      const res1 = await getTvVideos(id);
      const res3 = await getTvSeasonDetail(id, currentSeason);
      setData([res]);
      res1.results.map((item) => {
        if (item.type === "Trailer") {
          console.log(item);
          setVideos((prevItem) => [...prevItem, item]);
        }
      });
      setSeasonData(res3.episodes);
      if (user !== null) {
        const form = {
          id: parseInt(id, 10),
          user: user.$id,
          title: res.name,
          poster: res.poster_path,
          movie: false,
          tv: true,
          date: res.first_air_date,
          votes: res.vote_average.toString(),
        };
        console.log(form);
        //checking if the tv is added in WL
        const response = await checkWatchlist({
          userId: form.user,
          contentId: form.id,
        });
        if (!response) {
          setForm(form);
          console.log("form set");
        } else {
          setForm(form);
          setWishlisted(true);
        }
      }
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  const getSimilarData = async () => {
    try {
      const res = await getSimilarTv(id);
      const res2 = await getTvReviews(id);
      setSimilar(res.results);
      setReviews(res2.results);
    } catch (error) {
      Alert.alert(error);
    } finally {
      setSimilarLoaded(true);
      setEndLoaded(true);
    }
  };

  const handleSeason = async (num) => {
    setCurrentSeason(num);
  };

  useEffect(() => {
    getCurrEpisodes(id, currentSeason);
  }, [currentSeason]);

  const handleIMDBPress = (name) => {
    const encoded = encodeURIComponent(name);
    const url = `https://www.imdb.com/find/?q=${encoded}`;
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const addToWL = async () => {
    if (user !== null) {
      setIsButtonPressed(true);
      try {
        const res = await addToWatchList(form);
        if (res) {
          setShowAlert(true);
          setWishlisted(true);
        }
      } catch (error) {
        Alert.alert(error);
      }
    } else {
      setShowLoginAlert(true);
    }
  };

  const delFromWl = async () => {
    if (user !== null) {
      setIsButtonPressed(true);
      try {
        const res = await delTitle(form.user, form.id);
        if (res) {
          console.log(res);
          setShowRemovedAlert(true);
          setWishlisted(false);
        }
      } catch (error) {
        Alert.alert(error);
      } finally {
        setIsButtonPressed(false);
      }
    } else {
      setShowLoginAlert(true);
    }
  };


  const getProfileDetail = (id) => {
    console.log(id);
    router.push(`/profileDetail?id=${id}`);
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      console.log("Video has ended");
    }
  }, []);

  const formatNum = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)} B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} K`;
    } else if (num <= 100) {
      return num;
    } else return num;
  };

  useEffect(() => {
    getInitData(id)
      .then(() => {
        setTimeout(() => {
          getCredits(id);
        }, 50);
      })
      .then(() => {
        setTimeout(() => {
          getImages(id);
        }, 100);
      });

    const timer = setTimeout(() => {
      setIsButtonAvailable(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      if (displayedData.length === 0) {
        getSimilarData();
        console.log("getSimilarData");
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loading)
    return (
      <SafeAreaView className="h-full">
        <View className="bg-black h-full">
          <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
            <View className="">
              <Image
                source={{
                  uri: `${data[0].backdrop_path !== null
                    ? `https://image.tmdb.org/t/p/w500/${data[0].backdrop_path}`
                    : "https://via.placeholder.com/500?text=No+Image+Found"
                    }`,
                }}
                className="w-full h-48 opacity-75"
              />
              <View className="border-white border-2 absolute mt-52 left-5 w-40 h-60">
                <Image
                  source={{
                    uri: `${data[0].poster_path !== null
                      ? `https://image.tmdb.org/t/p/w500/${data[0].poster_path}`
                      : "https://via.placeholder.com/500?text=No+Image+Found"
                      }`,
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1 justify-end items-end pr-3 mt-8">
                <View className="flex-col justify-center items-center">
                  <View className="pb-1 flex-row pr-1">
                    <TouchableOpacity
                      className="bg-yellow-300 mr-4 rounded-lg w-12 flex justify-center items-center"
                      onPress={() => handleIMDBPress(data[0].imdb_id)}
                    >
                      <Text className="font-bold px-1 text-base">IMDb</Text>
                    </TouchableOpacity>
                    {ratings.length > 0 ?
                      ratings.map(
                        (item, index) =>
                          item.source === "imdb" && (
                            <View key={index}>
                              <Text className="text-white text-2xl font-bold pt-2 pl-1">
                                {item.value === 0 || item.value === null
                                  ? "NA"
                                  : item.value}{" "}
                                <Text className="text-gray-300 text-sm">
                                  /{" "}
                                  {item.votes === 0 || item.votes === null
                                    ? "NA"
                                    : formatNum(item.votes)}
                                </Text>
                              </Text>
                            </View>
                          )
                      ) : <View>
                        <Text className="text-white text-2xl font-bold pt-2 pl-1">
                          NA
                          <Text className="text-gray-300 text-sm">
                            /{" "}
                            NA
                          </Text>
                        </Text>
                      </View>}
                  </View>
                  <View className="flex-row justify-center items-center pr-2">
                    <Image
                      className=" mr-2 rounded-2xl w-14 h-14"
                      source={RT}
                      resizeMode="contain"
                    />
                    <View className="flex-col justify-center items-center">
                      {ratings.length > 0 ?
                        ratings.map(
                          (item, index) =>
                            item.source === "tomatoes" && (
                              <View className="flex-row pb-1" key={index}>
                                <Text className="text-white text-2xl font-bold pl-2">
                                  {item.value === 0 || item.value === null
                                    ? "NA"
                                    : `${item.value}% `}
                                </Text>
                                <Image
                                  className=" mr-1 rounded-full w-7 h-7 "
                                  source={Tomato}
                                  resizeMode="contain"
                                />
                              </View>
                            )
                        ) : <View>
                          <Text className="text-white text-2xl font-bold pt-2 pl-1">
                            NA
                            <Text className="text-gray-300 text-sm">
                              /{" "}
                              NA
                            </Text>
                          </Text>
                        </View>}
                      {ratings.length > 0 ?
                        ratings.map(
                          (item, index) =>
                            item.source === "tomatoesaudience" && (
                              <View className="flex-row" key={index}>
                                <Text className="text-white text-2xl font-bold pl-2">
                                  {item.value === 0 || item.value === null
                                    ? "NA"
                                    : `${item.value}% `}
                                </Text>
                                <Image
                                  className=" mr-1 rounded-full w-7 h-7 "
                                  source={Audience}
                                  resizeMode="contain"
                                />
                              </View>
                            )
                        ) : <View>
                          <Text className="text-white text-2xl font-bold pt-2 pl-1">
                            NA
                            <Text className="text-gray-300 text-sm">
                              /{" "}
                              NA
                            </Text>
                          </Text>
                        </View>}
                    </View>
                  </View>
                  <View className="py-2 flex-row justify-center items-center">
                    <Image
                      className=" mr-2 rounded-xl w-14 h-8 pr-1"
                      source={TMDB}
                      resizeMode="contain"
                    />
                    <View className="flex-col justify-center items-center">

                      <View className="flex-row pb-1">
                        <Text className="text-white text-2xl font-bold pt-2 pl-1 pr-2">
                          {data[0].vote_average === 0
                            ? "NA"
                            : `${(data[0].vote_average * 10).toFixed(0)}% `}

                          <Text className="text-gray-300 text-sm">
                            /{" "}
                            {data[0].vote_count === 0
                              ? "NA"
                              : formatNum(data[0].vote_count)}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-end items-end gap-6 py-4">
                  {showAlert && (
                    <CustomAlert
                      message="Added !"
                      onClose={() => setShowAlert(false)}
                    />
                  )}
                  {showLoginAlert && (
                    <CustomAlert
                      message="Login to create a Watchlist"
                      onClose={() => setShowLoginAlert(false)}
                    />
                  )}
                  {showRemovedAlert && (
                    <CustomAlert
                      message="Removed"
                      onClose={() => setShowRemovedAlert(false)}
                    />
                  )}
                  {wishlisted ? (
                    <View className="flex-row justify-center items-center">
                      <Text className="text-white font-bold text-lg">
                        Watchlisted :{" "}
                      </Text>
                      <WatchListButton
                        color={"#18c91b"}
                        disabled={!isButtonAvailable || isButtonPressed}
                        onPress={delFromWl}
                      />
                    </View>
                  ) : (
                    <View className="flex-row justify-center items-center">
                      <Text className="text-white font-bold text-lg">
                        Add to Watchlist :{" "}
                      </Text>
                      <WatchListButton
                        onPress={addToWL}
                        color={"#ffffff"}
                        disabled={!isButtonAvailable || isButtonPressed}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View className="flex-1 justify-center items-center py-2">
                <Text className="text-white text-4xl mt-6 px-4 pb-2 font-bold">
                  {data[0].name}{" "}
                </Text>
                <View className="flex-1 flex-row justify-center items-center">
                  {data[0].genres.length > 0 &&
                    data[0].genres.slice(0, 3).map((item, index) => (
                      <Text
                        className="text-gray-400 text-base pt-2 px-2"
                        key={index}
                      >
                        {item.name}
                      </Text>
                    ))}
                </View>
                <View className="pt-4">
                  {!readMore && (
                    <View className="mx-2">
                      <Text className="text-white text-lg font-semibold">
                        {data[0].overview.slice(0, 60)}
                      </Text>

                      <TouchableOpacity
                        onPress={toggleReadMore}
                        className="bg-transparent rounded"
                      >
                        <Text className="text-gray-400 text-lg">
                          ...Read More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {readMore && (
                    <View className="mx-2">
                      <Text className="text-white text-lg font-semibold ">
                        {data[0].overview}
                      </Text>
                      <TouchableOpacity
                        onPress={toggleReadMore}
                        className="bg-transparent rounded"
                      >
                        <Text className="text-gray-400  text-lg">
                          ...Read Less
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {data[0].next_episode_to_air && (
                  <View className="py-4">
                    <Text className="text-white text-xl font-semibold">
                      Upcoming : S{data[0].next_episode_to_air.season_number}-E
                      {data[0].next_episode_to_air.episode_number} on{" "}
                      {data[0].next_episode_to_air.air_date}
                    </Text>
                  </View>
                )}
              </View>
              <ScrollView
                className="pt-4 pl-4"
                horizontal={true}
                contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={false}
              >
                <View className="flex-col pr-12">
                  <View className="h-12 w-full border-b-2 border-gray-400 flex-row gap-4">
                    {data[0].seasons.length > 0 &&
                      data[0].seasons.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleSeason(item.season_number)}
                          className="h-12 "
                        >
                          <View
                            className={`${currentSeason === item.season_number
                              ? "bg-gray-500"
                              : "bg-black"
                              } h-7 `}
                          >
                            <Text className="text-white text-base px-2">
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>
                  <View className="mt-5 flex-row">
                    {seasonData.length > 0 &&
                      seasonData.map((item, index) => (
                        <View key={index}>
                          <Card
                            id={item.id}
                            ep={item.episode_number}
                            title={item.name}
                            image={`https://image.tmdb.org/t/p/w500/${item.still_path}`}
                            style={"w-40 h-[210px]"}
                            imageStyle={"h-32"}
                            year={
                              item.air_date !== null
                                ? item.air_date.slice(0, 7)
                                : null
                            }
                            percentage={item.vote_average.toFixed(1) * 10}
                            tv={true}
                            clickDisable={false}
                          />
                        </View>
                      ))}
                    {seasonData.length === 0 && (
                      <View className="flex-row justify-center items-center">
                        <Text className="p-4 text-white font-bold text-lg">
                          Not Released Yet !
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
              <ScrollView
                className="pt-4"
                horizontal={true}
                contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={false}
              >
                {videos.length > 0 && (
                  <View className="px-4 flex-1 justify-center items-center">
                    <YoutubeIframe
                      height={250}
                      width={370}
                      play={playing}
                      videoId={videos[0].key}
                      onChangeState={onStateChange}
                      onReady={() => console.log("Video is ready")}
                      onError={(error) => console.log("Error: ", error)}
                      onPlaybackQualityChange={(quality) =>
                        console.log("Quality: ", quality)
                      }
                      onPlaybackRateChange={(rate) =>
                        console.log("Rate: ", rate)
                      }
                    />
                  </View>
                )}

                {images.length > 0 &&
                  images.map((item, index) => (
                    <View className="h-60 w-96 px-2" key={index}>
                      <Image
                        source={{
                          uri: `${item.file_path !== null
                            ? `https://image.tmdb.org/t/p/w500/${item.file_path}`
                            : "https://via.placeholder.com/500?text=No+Image+Found"
                            }`,
                        }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                  ))}
              </ScrollView>
              <View className="flex-1 justify-end items-end px-4 pb-2">
                <Text className="text-gray-400 text-sm">{`<-- Swipe to View More`}</Text>
              </View>
              <View className="flex-1 justify-start items-start pl-4 pb-2">
                <View className="flex-row gap-2">
                  <Text className="text-gray-200 text-xl font-semibold">
                    Language :
                  </Text>

                  {data[0].spoken_languages.length > 0 &&
                    data[0].spoken_languages.slice(0, 3).map((item, index) => (
                      <Text
                        className="text-gray-200 text-xl font-semibold"
                        key={index}
                      >
                        {item.name}
                      </Text>
                    ))}
                </View>
                <Text className="text-gray-200 text-xl py-4 font-semibold">
                  Air Date : {data[0].first_air_date}
                </Text>
                <Text className="text-gray-200 text-xl  font-semibold">
                  Total :{data[0].number_of_episodes} Episodes{" "}
                </Text>
                {serviceProvider && (
                  <View className="flex-col justify-center items-start py-4">
                    <Text className="text-gray-200 text-xl font-semibold py-2">
                      Streaming :{" "}
                    </Text>
                    <View className="flex-row">
                      {serviceProvider.IN.flatrate !== undefined &&
                        serviceProvider.IN.flatrate
                          .slice(0, 2)
                          .map((item, index) => (
                            <View
                              className=" flex-col justify-center items-center px-6 py-2"
                              key={index}
                            >
                              <View className=" border border-black rounded-lg h-14 w-14 overflow-hidden bg-white">
                                <Image
                                  source={{
                                    uri: `https://image.tmdb.org/t/p/w500/${item.logo_path}`,
                                  }}
                                  className="h-full w-full"
                                  resizeMode="cover"
                                />
                              </View>
                              <Text className="text-xs text-white pt-1">
                                {item.provider_name}
                              </Text>
                            </View>
                          ))}
                      {serviceProvider.IN === undefined && (
                        <Text className="text-gray-200 text-xl font-semibold">
                          Not Available in India
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>

              <Text className="text-gray-200 text-2xl p-4  font-semibold">
                Cast
              </Text>
              <View className="flex-row items-center justify-center">
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  className="py-2"
                >
                  {credits.length > 0 &&
                    credits.map(
                      (item, index) =>
                        item.known_for_department === "Acting" && (
                          <View key={index} className=" px-6">
                            <TouchableOpacity
                              onPress={() => getProfileDetail(item.id)}
                              className="h-40"
                            >
                              <View className="flex-1 justify-center items-center">
                                <View className="border border-black rounded-full h-24 w-24 overflow-hidden bg-white">
                                  <Image
                                    source={{
                                      uri: `${item.profile_path !== null
                                        ? `https://image.tmdb.org/t/p/w500/${item.profile_path}`
                                        : "https://via.placeholder.com/500?text=No+Image+Found"
                                        }`,
                                    }}
                                    className="h-full w-full"
                                    resizeMode="cover"
                                  />
                                </View>
                                <Text className="text-gray-200 text-[16px] py-1">
                                  {item.name}
                                </Text>
                                <Text className="text-gray-200 text-[16px]">
                                  {item.character}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        )
                    )}
                </ScrollView>
              </View>
              <Text className="text-gray-200 text-2xl p-4  font-semibold">
                Created By
              </Text>
              <View className="flex-row items-center justify-center">
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  className="py-2"
                >
                  {data[0].created_by.length > 0 &&
                    data[0].created_by.map((item, index) => (
                      <View key={index} className=" px-6">
                        <TouchableOpacity
                          onPress={() => getProfileDetail(item.id)}
                          className="h-40"
                        >
                          <View className="flex-1 justify-center items-center">
                            <View className="border border-black rounded-full h-24 w-24 overflow-hidden bg-white">
                              <Image
                                source={{
                                  uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}`,
                                }}
                                className="h-full w-full"
                                resizeMode="cover"
                              />
                            </View>
                            <Text className="text-gray-200 text-[16px] py-1">
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                </ScrollView>
              </View>

              <Text className="text-gray-200 text-2xl p-4  font-semibold">
                Studios
              </Text>
              <View className="flex-1 flex-row  py-4 pr-4">
                {data[0].production_companies.length > 0 &&
                  data[0].production_companies
                    .slice(0, 2)
                    .map((item, index) => (
                      <View
                        key={index}
                        className="flex-1 justify-center items-center"
                      >
                        <View className="border border-black rounded-full h-24 w-24 overflow-hidden bg-white">
                          <Image
                            source={{
                              uri: `https://image.tmdb.org/t/p/w500/${item.logo_path}`,
                            }}
                            className="h-full w-full"
                            resizeMode="contain"
                          />
                        </View>
                        <Text className="text-gray-200 text-[16px] py-2">
                          {item.name}
                        </Text>
                      </View>
                    ))}
              </View>
              <>
                <View className="flex" >
                  <Text className="text-gray-200 text-2xl p-4 mb-2 font-semibold">
                    Recommended Series
                  </Text>
                  <View className="flex-row flex-wrap justify-evenly">
                    {displayedData.length > 0 &&
                      displayedData.map((item, index) => (
                        <View key={index}>
                          <Card
                            id={item.id}
                            title={item.name}
                            image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                            style={"w-40 h-auto"}
                            year={item.first_air_date.slice(0, 4)}
                            percentage={item.vote_average.toFixed(1) * 10}
                            tv={true}
                          />
                        </View>
                      ))}
                    {!endLoaded && (
                      <View className="flex justify-center items-center">
                        <ActivityIndicator size={"large"} color={"white"} />
                      </View>
                    )}
                  </View>
                  {endLoaded && !showAll && (
                    <View className="items-end pr-4 mt-4">
                      <TouchableOpacity
                        onPress={() => setShowAll(true)}
                        className="p-2 bg-transparent rounded"
                      >
                        <Text className="text-gray-200 text-sm">
                          ...View More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {endLoaded && showAll && (
                    <View className="items-end pr-4 mt-4">
                      <TouchableOpacity
                        onPress={() => setShowAll(false)}
                        className="p-2 bg-transparent rounded"
                      >
                        <Text className="text-gray-200 text-sm">
                          ...View Less
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View className="m-4">
                  <Text className="text-gray-200 text-2xl  font-semibold ">
                    Reviews
                  </Text>
                  {reviews.length > 0 &&
                    reviews.map((item, index) => (
                      <View
                        key={index}
                        className="flex flex-col items-center justify-center p-4 border-b border-gray-400"
                      >
                        <Text className="text-xl text-white"> </Text>
                        <Text className="text-white text-base">
                          {item.content}
                        </Text>
                        <Text className="text-xl text-white"> </Text>
                        <Text className="text-xl text-white">
                          {" "}
                          ~ "{item.author}" rates - {item.author_details.rating}
                          /10
                        </Text>
                      </View>
                    ))}
                  {reviews.length === 0 && endLoaded && (
                    <View className="flex flex-col items-center justify-center p-4">
                      <Text className="text-gray-200 text-base">
                        No Reviews yet on TMDB
                      </Text>
                    </View>
                  )}
                  {!endLoaded && (
                    <View className="flex justify-center items-center">
                      <ActivityIndicator size={"large"} color={"white"} />
                    </View>
                  )}
                </View>
              </>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
};

export default tvDetails;
