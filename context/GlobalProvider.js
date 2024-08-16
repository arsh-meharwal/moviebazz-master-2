import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setUser(res);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSignInLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{ user, setUser, signInLoading, loggedIn, setLoggedIn }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
