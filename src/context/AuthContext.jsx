import { createContext, useState, useEffect, useContext } from "react";

// Create the context
const AuthContext = createContext();

// Custom hook for easy access to auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when the app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if token exists and is valid
  const checkAuthStatus = () => {
    try {
      const authData = JSON.parse(localStorage.getItem("accessToken"));

      if (authData && authData.token) {
        // Check if token is expired
        const currentTime = new Date().getTime();
        const expirationTime = new Date(authData.tokenExpiration).getTime();

        if (currentTime < expirationTime) {
          setUser({ id: authData.userId });
          setIsAuthenticated(true);
        } else {
          logout(); // Token expired
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setUser({ id: accessToken.userId });
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Values to provide throughout the app
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
