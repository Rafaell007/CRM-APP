import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { Provider } from "react-redux";
import AuthProvider from "./context/AuthProvider";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element "#root" not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
  