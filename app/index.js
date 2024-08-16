import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import logo from "../assets/logo/Logo1.png";
import userlogo from "../assets/icons/profile.png";
import Card from "@/components/Card";
import {
  getTrendingTv,
  getTrendingMovie,
  getSearchQuery,
  getTopRatedTv,
  getTopRatedMovies,
} from "./api/apiCall";
import { useRouter } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchButton from "@/components/IndexSearchButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import {} from "./";
import { Circle, Path, Svg } from "react-native-svg";

const index = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingMoviesPage, setTrendingMoviesPage] = useState(1);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [trendingSeriesPage, setTrendingSeriesPage] = useState(1);
  const { user, loggedIn } = useGlobalContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedMoviesPages, setTopRatedMoviesPages] = useState(1);
  const [topRatedTv, setTopRatedTv] = useState([]);
  const [topRatedTvPages, setTopRatedTvPages] = useState(1);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showAllTv, setShowAllTv] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const displayTrendingMovies = showAllMovies
    ? trendingMovies
    : trendingMovies.slice(0, 6);
  const displayTrendingTv = showAllTv
    ? trendingSeries
    : trendingSeries.slice(0, 6);

  const router = useRouter();

  const getInitialData = async (page) => {
    try {
      const res = await getTrendingMovie(page);
      setTrendingMovies(res.results);
    } catch (error) {
      Alert.alert(error);
    } finally {
      setInitLoading(false);
    }
  };

  const fetchTopRatedTv = async (page) => {
    try {
      console.log("Top rated tv API is called");
      const res = await getTopRatedTv(page);
      setTopRatedTv((prev) => [...prev, ...res.results]);

      if (page === 1 && topRatedTv.length === 0) {
        const timestamp = new Date().toISOString();

        // Storing the data in async storage
        await AsyncStorage.setItem(`topRatedTv`, JSON.stringify(res.results));
        await AsyncStorage.setItem("topRatedTvTimestamp", timestamp);
      }
    } catch (error) {
      Alert.alert(error);
    }
  };
  const fetchTopRatedMovies = async (page) => {
    try {
      console.log("Top rated movie API is called");
      const res2 = await getTopRatedMovies(page);
      setTopRatedMovies((prev) => [...prev, ...res2.results]);

      // Storing the data in async storage if 1st page
      if (page === 1 && topRatedMovies.length === 0) {
        const timestamp = new Date().toISOString();
        await AsyncStorage.setItem(
          "topRatedMovie",
          JSON.stringify(res2.results)
        );
        await AsyncStorage.setItem("topRatedMovieTimestamp", timestamp);
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  const getTopRatedData = async () => {
    const storedTVData = await AsyncStorage.getItem(`topRatedTv`);
    const storedMovieData = await AsyncStorage.getItem(`topRatedMovie`);
    const storedTVTimestamp = await AsyncStorage.getItem("topRatedTvTimestamp");

    if (storedTVData && storedMovieData && storedTVTimestamp) {
      const currDate = new Date();

      const diffIsAboveOneMonth = isOldDateGreaterByOneMonth(
        storedTVTimestamp,
        currDate
      );
      console.log("Is diff above one month", diffIsAboveOneMonth);

      if (!diffIsAboveOneMonth) {
        setTopRatedTv(JSON.parse(storedTVData));
        setTopRatedMovies(JSON.parse(storedMovieData));
        return;
      }
    }

    await fetchTopRatedMovies(1);
    await fetchTopRatedTv(1);
  };

  function isOldDateGreaterByOneMonth(oldDate, newDate) {
    const old = new Date(oldDate);
    const newD = new Date(newDate);

    // Calculate the difference in months
    const yearDiff = newD.getFullYear() - old.getFullYear();
    const monthDiff = newD.getMonth() - old.getMonth();
    const dayDiff = newD.getDate() - old.getDate();
    const totalMonthDiff = yearDiff * 12 + monthDiff;

    if (totalMonthDiff >= 1) {
      return true;
    } else {
      return false;
    }
  }

  const getLoggedIn = () => {
    if (currentUser !== null) {
      router.push("/userProfile");
    } else router.push("/sign-in");
  };

  const fetchTvData = async (page) => {
    console.log("tv series api call");
    const res2 = await getTrendingTv(page);
    setTrendingSeries(res2.results);
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      if (trendingSeries.length === 0) {
        fetchTvData(trendingSeriesPage);
        console.log("fetchData");
      } else if (trendingSeries.length !== 0 && topRatedMovies.length === 0) {
        console.log("below fetchData");
        getTopRatedData();
      }
    }
  };

  useEffect(() => {
    getInitialData(trendingMoviesPage);
  }, []);

  useEffect(() => {
    if (user !== null) {
      console.log("[user]", user.email);
      setCurrentUser(user);
    }
  }, [user, loggedIn]);

  useEffect(() => {
    if (trendingMovies.length !== 0) {
      getInitialData(trendingMoviesPage);
    }
  }, [trendingMoviesPage]);

  useEffect(() => {
    if (trendingSeries.length !== 0) {
      fetchTvData(trendingSeriesPage);
    }
  }, [trendingSeriesPage]);

  useEffect(() => {
    if (topRatedMovies.length !== 0) {
      fetchTopRatedMovies(topRatedMoviesPages);
    }
  }, [topRatedMoviesPages]);

  useEffect(() => {
    if (topRatedTv.length !== 0) {
      fetchTopRatedTv(topRatedTvPages);
    }
  }, [topRatedTvPages]);

  if (initLoading) return <LoadingScreen />;

  return (
    <SafeAreaView className="bg-gray-950 min-h-full">
      <View className="flex-1 mt-4">
        <View className=" flex-row justify-between items-center gap-16 pt-4 px-4">
          <Image source={logo} className="w-16 h-14 rounded-2xl" />
          <Text className="font-bold text-2xl text-white">MovieBazz</Text>
          <TouchableOpacity onPress={getLoggedIn} className=" pt-2">
            <View className="w-20 flex-col justify-center items-center pb-2">
              <View className="h-11 w-11 rounded-full border-2 border-white bg-neutral-500 flex justify-center items-center">
                {currentUser !== null ? (
                  <Text className="text-3xl text-white  font-semibold">
                    {currentUser.email.slice(0, 1).toUpperCase()}
                  </Text>
                ) : (
                  <Image
                    source={userlogo}
                    className="h-full w-full rounded-full"
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex-row  justify-around items-center gap-1">
          <View className="px-4 pt-2">
            <SearchButton />
          </View>
        </View>

        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
          <View className="flex-1 flex-col">
            <Text className="text-gray-200 text-2xl p-4  font-semibold">
              Trending Movies
            </Text>
            <View className="flex-row flex-wrap justify-evenly ">
              {displayTrendingMovies.length > 0 &&
                displayTrendingMovies.map((item) => (
                  <View key={item.id.toString() + `${Math.random()}`}>
                    <Card
                      id={item.id}
                      title={item.title}
                      image={item.poster_path}
                      style={"w-[160px] h-[280px]"}
                      percentage={item.vote_average.toFixed(1) * 10}
                      movie={true}
                    />
                  </View>
                ))}
            </View>
            {!showAllMovies && (
              <View className="items-center pr-4 mt-4">
                <TouchableOpacity
                  onPress={() => setShowAllMovies(true)}
                  className="p-2 bg-transparent rounded"
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dedede"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-down"
                  >
                    <Path d="m6 9 6 6 6-6" />
                  </Svg>
                </TouchableOpacity>
              </View>
            )}
            {showAllMovies && (
              <View className=" flex-col items-center pr-4 mt-4 pb-4">
                <View className="h-12 w-12 flex items-center ">
                  <Text className=" flex-1 items-center p-1 text-gray-300 text-base font-semibold">
                    {trendingMoviesPage}
                  </Text>
                </View>
                <View className="flex-row gap-4 pb-6">
                  <TouchableOpacity
                    onPress={() =>
                      setTrendingMoviesPage((prev) =>
                        prev === 1 ? prev : prev - 1
                      )
                    }
                  >
                    {/* Prev */}
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c4c4c4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-circle-arrow-left"
                    >
                      <Circle cx="12" cy="12" r="10" />
                      <Path d="M16 12H8" />
                      <Path d="m12 8-4 4 4 4" />
                    </Svg>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTrendingMoviesPage((prev) => prev + 1)}
                  >
                    {/* Next */}
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c4c4c4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-circle-arrow-right"
                    >
                      <Circle cx="12" cy="12" r="10" />
                      <Path d="M8 12h8" />
                      <Path d="m12 16 4-4-4-4" />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setShowAllMovies(false)}
                  className="p-2 bg-transparent rounded"
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dedede"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-up"
                  >
                    <Path d="m18 15-6-6-6 6" />
                  </Svg>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View className="flex-1 flex-col">
            <Text className="text-gray-200 text-2xl p-4  font-semibold">
              Trending Series
            </Text>
            <View className="flex-row flex-wrap justify-evenly">
              {displayTrendingTv.length > 0 &&
                displayTrendingTv.map((item) => (
                  <View key={item.id.toString() + `${Math.random()}`}>
                    <Card
                      id={item.id}
                      title={item.name}
                      image={item.poster_path}
                      style={"w-[160px] h-[280px]"}
                      percentage={item.vote_average.toFixed(1) * 10}
                      tv={true}
                    />
                  </View>
                ))}
            </View>
            {displayTrendingTv.length > 0 && !showAllTv && (
              <View className="items-center pr-4 mt-4">
                <TouchableOpacity
                  onPress={() => setShowAllTv(true)}
                  className="p-2 bg-transparent rounded"
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dedede"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-down"
                  >
                    <Path d="m6 9 6 6 6-6" />
                  </Svg>
                </TouchableOpacity>
              </View>
            )}
            {displayTrendingTv.length > 0 && showAllTv && (
              <View className=" flex-col items-center pr-4 mt-4">
                <View className="h-12 w-12 flex items-center ">
                  <Text className=" flex-1 items-center p-1 text-gray-300 text-base font-semibold">
                    {trendingSeriesPage}
                  </Text>
                </View>
                <View className="flex-row gap-4 pb-6">
                  <TouchableOpacity
                    onPress={() =>
                      setTrendingSeriesPage((prev) =>
                        prev === 1 ? prev : prev - 1
                      )
                    }
                  >
                    {/* Prev */}
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c4c4c4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-circle-arrow-left"
                    >
                      <Circle cx="12" cy="12" r="10" />
                      <Path d="M16 12H8" />
                      <Path d="m12 8-4 4 4 4" />
                    </Svg>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTrendingSeriesPage((prev) => prev + 1)}
                  >
                    {/* Next */}
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c4c4c4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-circle-arrow-right"
                    >
                      <Circle cx="12" cy="12" r="10" />
                      <Path d="M8 12h8" />
                      <Path d="m12 16 4-4-4-4" />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setShowAllTv(false)}
                  className="p-2 bg-transparent rounded"
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dedede"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-up"
                  >
                    <Path d="m18 15-6-6-6 6" />
                  </Svg>
                </TouchableOpacity>
              </View>
            )}
            {displayTrendingTv.length === 0 && (
              <View className="flex justify-center items-center">
                <ActivityIndicator size={"large"} color={"white"} />
              </View>
            )}
          </View>
          {topRatedMovies.length > 0 && (
            <>
              <Text className="text-gray-200 text-2xl p-4  font-semibold">
                Top Rated Movies
              </Text>

              <FlatList
                data={topRatedMovies}
                renderItem={({ item }) => (
                  <View className="flex-row flex-wrap justify-evenly">
                    <Card
                      image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                      title={item.title}
                      id={item.id}
                      percentage={item.vote_average.toFixed(1) * 10}
                      style={"w-[160px] h-[280px]"}
                      movie={true}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString() + `${Math.random()}`}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                ListFooterComponent={() => (
                  <View className="top-[100px] flex-1 px-2">
                    <TouchableOpacity
                      title="Next"
                      className="rounded-full h-12 w-12 flex justify-center items-center"
                      onPress={() => setTopRatedMoviesPages((prev) => prev + 1)}
                    >
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#dedede"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-right"
                      >
                        <Path d="m9 18 6-6-6-6" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}
          {topRatedMovies.length === 0 && displayTrendingTv.length > 0 && (
            <View className="flex justify-center items-center">
              <ActivityIndicator size={"large"} color={"white"} />
            </View>
          )}
          {topRatedTv.length > 0 && (
            <>
              <Text className="text-gray-200 text-2xl p-4  font-semibold">
                Top Rated Series
              </Text>

              <FlatList
                data={topRatedTv}
                renderItem={({ item }) => (
                  <View className="flex-row flex-wrap justify-evenly">
                    <Card
                      image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                      title={item.name}
                      id={item.id}
                      percentage={item.vote_average.toFixed(1) * 10}
                      style={"w-[160px] h-[280px]"}
                      tv={true}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString() + `${Math.random()}`}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                ListFooterComponent={() => (
                  <View className="top-[100px] flex-1 px-2">
                    <TouchableOpacity
                      title="Next"
                      className="rounded-full h-12 w-12 flex justify-center items-center"
                      onPress={() => setTopRatedTvPages((prev) => prev + 1)}
                    >
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#dedede"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-right"
                      >
                        <Path d="m9 18 6-6-6-6" />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}
          {topRatedTv.length === 0 &&
            displayTrendingTv.length > 0 &&
            topRatedMovies.length > 0 && (
              <View className="flex justify-center items-center">
                <ActivityIndicator size={"large"} color={"white"} />
              </View>
            )}
        </ScrollView>

        <View>
          {/* <FlatList
            data={inTheaters}
            renderItem={({ item }) => (
              
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          /> */}
        </View>
        {/* <FlatList
              data={inTheaters}
              renderItem={({ item }) => (
                <View className="flex-row flex-wrap justify-evenly">
                  <Card
                    image={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                    title={item.name}
                    id={item.id}
                    percentage={item.vote_average.toFixed(1) * 10}
                    style={"w-40 h-[200px]"}
                    tv={true}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            /> */}
        {/* <View className="flex">
              <Text className="pl-6 py-4 text-lg text-white">
                Top Rated Movies
              </Text>
              <View className="flex-row flex-wrap justify-evenly">
                {displayTopMovies &&
                  displayTopMovies.map((item) => (
                    <View key={item.id.toString()}>
                      <Card
                        image={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                        title={item.title}
                        percentage={item.vote_average.toFixed(1) * 10}
                        id={item.id}
                        style={"w-40 h-[210px]"}
                        imageStyle={"h-32"}
                        year={item.release_date.slice(0, 4)}
                        movie={true}
                      />
                    </View>
                  ))}
              </View>
              {!showAllMovies && (
                <View className="items-end mt-1">
                  <TouchableOpacity
                    onPress={() => setShowAllMovies(true)}
                    className="p-2 bg-transparent rounded"
                  >
                    <Text className="text-white text-xs">View More</Text>
                  </TouchableOpacity>
                </View>
              )}
              {showAllMovies && (
                <View className="items-end mt-1">
                  <TouchableOpacity
                    onPress={() => setShowAllMovies(false)}
                    className="p-2 bg-transparent rounded"
                  >
                    <Text className="text-white text-xs">View Less</Text>
                  </TouchableOpacity>
                </View>
              )}
              {topRatedMovies.length === 0 && (
                <View className="flex justify-center items-center">
                  <ActivityIndicator size={"large"} color={"white"} />
                </View>
              )}
            </View>
            <View className="flex">
              <Text className="pl-6 py-4 text-lg text-white">
                Top Rated Series
              </Text>
              <View className="flex-row flex-wrap justify-evenly">
                {displayTopTv &&
                  displayTopTv.map((item) => (
                    <View key={item.id.toString()}>
                      <Card
                        image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                        title={item.name}
                        percentage={item.vote_average.toFixed(1) * 10}
                        id={item.id}
                        style={"w-40 h-[210px]"}
                        imageStyle={"h-32"}
                        year={item.first_air_date.slice(0, 4)}
                        tv={true}
                      />
                    </View>
                  ))}
              </View>
              {!showAllTv && (
                <View className="items-end mt-1">
                  <TouchableOpacity
                    onPress={() => setShowAllMovies(true)}
                    className="p-2 bg-transparent rounded"
                  >
                    <Text className="text-white text-xs">View More</Text>
                  </TouchableOpacity>
                </View>
              )}
              {showAllTv && (
                <View className="items-end mt-1">
                  <TouchableOpacity
                    onPress={() => setShowAllMovies(false)}
                    className="p-2 bg-transparent rounded"
                  >
                    <Text className="text-white text-xs">View Less</Text>
                  </TouchableOpacity>
                </View>
              )}
              {topRatedTv.length === 0 && (
                <View className="flex justify-center items-center">
                  <ActivityIndicator size={"large"} color={"white"} />
                </View>
              )}
            </View> */}
      </View>
    </SafeAreaView>
  );
};

export default index;
