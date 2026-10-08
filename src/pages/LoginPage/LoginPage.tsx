import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../context/authContext";
import "./LoginPage.css";

// After a successful login the /login route guard redirects to the user's home page
const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      await login(email, password);
    } catch {
      setErrorMessage("Wrong email or password");
    }
  };

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
