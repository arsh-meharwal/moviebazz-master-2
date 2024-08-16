import {
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getFranchiseDetail } from "../api/apiCall";
import LoadingScreen from "@/components/LoadingScreen";
import Card from "@/components/Card";

const FranchiseDetails = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { id } = useLocalSearchParams();

  const getFranchise = async () => {
    try {
      const res = await getFranchiseDetail(id);
      console.log(res);
      setData([res]);
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFranchise();
  }, [id]);

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView className="min-h-full">
      <View className="bg-black min-h-full">
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ScrollView>
              <View className="flex relative">
                <View className="">
                  <Image
                    source={{
                      uri: `${
                        item.backdrop_path !== null
                          ? `https://image.tmdb.org/t/p/w500/${item.backdrop_path}`
                          : "https://via.placeholder.com/500?text=No+Image+Found"
                      }`,
                    }}
                    className="w-full h-60 opacity-75"
                  />
                </View>
                <View className="border-white border-2 top-1/3 left-1/3 absolute w-40 h-60 ">
                  <Image
                    source={{
                      uri: `${
                        item.poster_path !== null
                          ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
                          : "https://via.placeholder.com/500?text=No+Image+Found"
                      }`,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex justify-center items-center py-4 mb-4 mt-44">
                  <Text className="text-white text-4xl mt-6 px-4 pb-2 font-bold">
                    {item.name}{" "}
                  </Text>
                </View>
              </View>

              {/* <Text className="text-gray-200 text-3xl pb-8 px-8 font-semibold">
                Movies
              </Text> */}

              <View className="flex-row flex-wrap justify-evenly">
                {item.parts.length > 0 &&
                  item.parts.map((item) => (
                    <View key={item.id}>
                      <Card
                        id={item.id}
                        title={item.title}
                        image={item.poster_path}
                        style={"w-[170px] h-auto"}
                        percentage={item.vote_average.toFixed(1) * 10}
                        movie={true}
                        year={item.release_date}
                      />
                    </View>
                  ))}
              </View>
            </ScrollView>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FranchiseDetails;
