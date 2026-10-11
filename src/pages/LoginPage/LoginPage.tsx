import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../context/authContext";

const FIELD = "flex flex-col gap-1.5";
const LABEL = "text-xs font-semibold text-muted";
const INPUT =
  "rounded-md border border-border bg-surface px-3 py-2.5 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink";

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        className="flex w-full max-w-90 flex-col gap-4 rounded-xl bg-surface p-6"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-2 text-center text-lg font-bold uppercase tracking-brand">
          Restaurant CRM
        </h1>

        <label className={FIELD}>
          <span className={LABEL}>Email</span>
          <input
            className={INPUT}
            type="email"
            name="email"
            placeholder="admin@restaurant.com"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className={FIELD}>
          <span className={LABEL}>Password</span>
          <input
            className={INPUT}
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {errorMessage && <p className="text-md text-red-600">{errorMessage}</p>}
        <button
          className="rounded-md bg-ink p-3 text-base text-white hover:opacity-90"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
