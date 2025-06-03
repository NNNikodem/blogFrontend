import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  if (isAuthenticated) {
    return;
  }
  if (loading) {
    return <div>Načítavanie...</div>;
  }
  return (
    <main className="login-page">
      <div className="login-form-container">
        <h1>{isLogin ? "Prihlásenie" : "Registrácia"}</h1>
        <AuthForm isLogin={isLogin} toggleForm={toggleForm} />
      </div>
    </main>
  );
};

export default LoginPage;
