import { View, Text, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { getWatchlist } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import LoadingScreen from "@/components/LoadingScreen";
import Card from "@/components/Card";

const userProfile = () => {
  const { user } = useGlobalContext();
  const [watchlist, setWatchlist] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async (id) => {
    try {
      const res = await getWatchlist(id);
      setWatchlist(res.documents);
      console.log(res);
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(user.$id);
    setCurrentUser(user);
  }, [user]);

  if (loading) return <LoadingScreen />;

  return (
    <View className="bg-black min-h-full">
      <ScrollView className="pt-10">
        <View>
          <View className="flex-col justify-center items-center">
            <View className="h-16 w-16 rounded-full border-2 border-white bg-neutral-500 flex justify-center items-center">
              {currentUser !== null && (
                <Text className="text-4xl text-white  font-semibold">
                  {currentUser.email.slice(0, 1).toUpperCase()}
                </Text>
              )}
            </View>
            <View>
              <Text className="text-lg text-white font-semibold pt-4">
                {currentUser.email}
              </Text>
            </View>
          </View>
          <Text className="text-gray-200 text-2xl p-4 mt-4 font-semibold">
            Your Watchlist
          </Text>
          <View className="flex-row flex-wrap justify-evenly py-2 pb-20">
            {watchlist.length > 0 &&
              watchlist.map((item) => (
                <View key={`${Math.random()}${item.id}`}>
                  <Card
                    id={item.id}
                    title={item.title}
                    image={`https://image.tmdb.org/t/p/w500/${item.poster}`}
                    style={"w-[160px] h-[300px]"}
                    percentage={parseInt(item.votes, 10).toFixed(1) * 10}
                    movie={item.movie}
                    tv={item.tv}
                    year={`${item.date.slice(0, 4)} - ${
                      item.movie === true
                        ? "Movie"
                        : item.tv === true
                        ? "Series"
                        : ""
                    }`}
                  />
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default userProfile;
