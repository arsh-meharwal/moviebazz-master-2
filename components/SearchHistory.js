import AsyncStorage from "@react-native-async-storage/async-storage";

const SEARCH_HISTORY_KEY = "search_history";

export const saveSearchItem = async (item) => {
  try {
    const existingHistory = await getSearchHistory();
    const newHistory = [
      item,
      ...existingHistory.filter((i) => i !== item),
    ].slice(0, 10); // Max 10 items, remove duplicates
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving search item:", error);
  }
};

export const getSearchHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error retrieving search history:", error);
    return [];
  }
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
};
