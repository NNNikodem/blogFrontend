import { useState } from "react";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

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
