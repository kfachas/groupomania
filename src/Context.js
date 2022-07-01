import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import moment from "moment-timezone";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const ContextComponent = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const newToken = Cookies.get("token");
  if (newToken && !userData) {
    const tokenDecoded = jwtDecode(newToken);
    if (moment().unix() <= tokenDecoded.exp) {
      Cookies.set("token", newToken, {
        expires: moment.unix(tokenDecoded.exp).toDate(),
      });
      setUserData({
        token: newToken,
        ...tokenDecoded,
      });
    }
  }
  // useEffect(() => {
  // }, []);

  return (
    <AppContext.Provider value={{ userData, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};
export default ContextComponent;
