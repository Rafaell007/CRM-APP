import { useState } from "react";
import { useAuth } from "../../context/authContext";
import "./LoginPage.css";
import { Navigate } from "react-router";

const LoginPage = () => {
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      await login(email, password);
    } catch {
      setErrorMessage("Wrong email od password");
    }
  };

if(user) {
  return(
      <Navigate to={user.role === "admin" ? "/admin" : "/waiter/tables"} replace />
  )
}

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit}>
        <h1 className="login__title">Restaurant CRM</h1>

        <label className="login__field">
          <span className="login__label">Email</span>
          <input
            className="login__control"
            type="email"
            name="email"
            placeholder="admin@restaurant.com"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="login__field">
          <span className="login__label">Password</span>
          <input
            className="login__control"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {errorMessage && <p className="login__error">{errorMessage}</p>}
        <button className="login__submit" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
