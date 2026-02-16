import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/app.ts";
import { BrowserRouter, Route, Routes } from "react-router";

import LoginPage from "./pages/auth/login/page.tsx";
import { AuthProvider } from "./contexts/auth-context.tsx";
import DashboardPage from "./pages/dashboard/page.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<LoginPage />} />
              <Route path="dashboard" element={<DashboardPage />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </>,
);
