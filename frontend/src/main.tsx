import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/app.ts";
import { ThemeProvider } from "./components/custom/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <ThemeProvider
        defaultTheme="dark"
        enableSystem={false}
        storageKey="tasktrack-theme"
      >
        <App />
      </ThemeProvider>
    </Provider>
  </>,
);
