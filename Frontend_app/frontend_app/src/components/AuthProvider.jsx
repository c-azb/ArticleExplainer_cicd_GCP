

import { createContext, useState, useEffect,useRef } from "react";
import { REFRESH_API_ENDPOINT, LOGIN_API_ENDPOINT, LOGOUT_API_ENDPOINT } from "../constants/constants"
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  //const [accessToken, setAccessToken] = useState("");
  const accessTokenRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  // Try to refresh token when app starts
  useEffect(() => { tryRefresh(); }, []);

  const tryRefresh = async () => {

    if (localStorage.getItem("forceLogout") === "true") {
      localStorage.removeItem("forceLogout");
      await logout();
      return;
    }
    
    const redirect_if_fail = isLoggedIn;
    //let access_token = null;

    try {
      console.log('trying refresh')
      const res = await fetch(REFRESH_API_ENDPOINT, {
        method: "POST",
        credentials: "include", // sends cookie with refresh token
      });
      const data = await res.json();
      if (res.ok) {
        accessTokenRef.current = data.access_token;
        setIsLoggedIn(true);
      } else {
        accessTokenRef.current = null
        setIsLoggedIn(false);
      }
    } catch (err) {
      accessTokenRef.current = null
      console.error("Failed to refresh token:", err);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);

      if (redirect_if_fail && accessTokenRef.current === null){
        alert("You have been disconnected, please login again...");
        navigate('/LoginOrRegister');
      }
    }
    //return access_token;
  }


  const logout = async () => {
    setLoading(true);
    accessTokenRef.current = null
    //setAccessToken("");
    setIsLoggedIn(false);
    localStorage.setItem("forceLogout", "true");
    try {
      await fetch(LOGOUT_API_ENDPOINT, { method: "POST", credentials: "include" });
      localStorage.removeItem("forceLogout");
    } catch (error) {
      localStorage.setItem("forceLogout", "true");
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(LOGIN_API_ENDPOINT, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ 'username': username, 'password': password }).toString(),
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        accessTokenRef.current = data.access_token;
        //setAccessToken(data.access_token);
        setIsLoggedIn(true);
      }
    } catch (error) { console.log(error); }
    finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, accessTokenRef, loading, login, logout, tryRefresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider
export { AuthContext };