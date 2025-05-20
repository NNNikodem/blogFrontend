import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

// Create the context
const AuthContext = createContext();

// Custom hook for easy access to auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
        const decoded = decodeToken(authData.token);

        // Check if token is expired
        const currentTime = new Date().getTime();
        const expirationTime = new Date(authData.expiration).getTime();

        if (currentTime < expirationTime) {
          const hasAdminRole = checkAdmin(decoded);
          setUser({
            id: authData.userId,
            email: decoded.email,
            admin: hasAdminRole,
          });
          // Check for admin role in the roles array
          setIsAdmin(hasAdminRole);
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
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    setUser({ id: accessToken.userId });
    setIsAdmin(accessToken.role === "admin");
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  };
  // Decode JWT token to get user info
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  const checkAdmin = (decoded) => {
    const hasAdminRole =
      decoded &&
      decoded.roles &&
      decoded.roles.some((role) => role.authority === "ROLE_ADMIN");
    return hasAdminRole;
  };

  // Values to provide throughout the app
  const value = {
    isAuthenticated,
    isAdmin,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
