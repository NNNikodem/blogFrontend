import { useState } from "react";
import { postRequest, getError, isLoading } from "../api/apiAccessHelper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/Components/AuthForm.css";

const AuthForm = ({ isLogin, toggleForm }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login logic
        const loginData = {
          email: formData.email,
          password: formData.password,
        };

        const response = await postRequest("authenticate/signin", loginData);

        if (response && response.accessToken) {
          setSuccess("Prihlásenie úspešné.");
          login(response.accessToken);
          // Redirect to home or dashboard
          setTimeout(() => {
            navigate("/auth/feitcity/account");
          }, 1000); // Redirect after 1 seconds
        } else {
          setError("Prihlásenie zlyhalo. Skúste to znova.");
        }
      } else {
        // Handle registration logic
        if (formData.password !== formData.confirmPassword) {
          setError("Heslá sa nezhodujú.");
          setLoading(false);
          return;
        }

        const registerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        const response = await postRequest("authenticate/signup", registerData);

        if (response.ok) {
          setSuccess("Registrácia úspešná. Môžete sa prihlásiť.");
          setTimeout(() => {
            setSuccess("");
          }, 2000); // Clear success message after 2 seconds
          toggleForm();
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          setError(getError || "Registrácia zlyhala. Skúste to znova.");
        }
      }
    } catch (err) {
      setError(err.message || "Nastala chyba. Skúste to znova.");
      console.error("Chyba autentifikácie:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      {error && <div className="auth-error-message">{error}</div>}
      {success && <div className="auth-success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="auth-form-group">
            <label htmlFor="name">Meno</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        <div className="auth-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password">Heslo</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Potvrdenie Hesla</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        <div className="auth-form-group">
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Spracúvavam..." : isLogin ? "Prihlásiť" : "Registrovať"}
          </button>
        </div>
      </form>
      <div className="auth-form-group">
        <p className="auth-form-switch">
          {isLogin ? "Nemáte účet? " : "Už máte účet? "}
          <button
            onClick={toggleForm}
            className="auth-switch-btn"
            disabled={loading}
          >
            {isLogin ? "Registrovať sa" : "Prihlásiť sa"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
