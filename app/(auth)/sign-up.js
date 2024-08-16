import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import logo from "../../assets/logo/Logo1.png";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignUp = () => {
  const { setUser, setLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  let email = form.email;
  let password = form.password;
  const submit = async () => {
    try {
      setSubmitting(true);
      await createUser(email, password);
      const res = await getCurrentUser();
      setUser(res);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <SafeAreaView className=" bg-black h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6 ">
          <View className="flex justify-center items-center pb-6">
            <Image source={logo} className="w-28 h-24 rounded-2xl" />
          </View>
          <View className="flex justify-center items-center py-2">
            <Text
              className=" text-white font-bold py-4 text-3xl"
              handlePress={() => router.push("/sign-in")}
            >
              Sign Up for MovieBazz
            </Text>
          </View>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyBoardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title={"Sign Up"}
            containerStyles={"w-full min-h-[62px] mt-12"}
            handlePress={submit}
            isLoading={submitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-secondary text-yellow-300"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
