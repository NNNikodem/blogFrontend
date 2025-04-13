import { useState } from "react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here
      console.log("Logging in with:", formData.email, formData.password);
    } else {
      // Handle registration logic here
      console.log("Registering with:", formData);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset form data when switching between forms
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <main className="login-page">
      <div className="login-form-container">
        <h1>{isLogin ? "Login" : "Register"}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <button type="submit" className="submit-btn">
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
        <div className="form-group">
          <p className="form-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleForm} className="switch-btn">
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
