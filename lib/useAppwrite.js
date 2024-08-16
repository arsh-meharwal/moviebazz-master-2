// import { View, Text } from "react-native";
// import React, { useEffect, useState } from "react";

// const useAppwrite = (fn) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await fn();
//       setData(res);
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refetch = () => fetchData();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return { data, loading, refetch };
// };

// export default useAppwrite;
