import "./App.css";

import { Outlet } from "react-router";
import { Navbar } from "./components/custom/navbar";

export default function App() {
  return (
    <>
      <Navbar onSidebarToggle={() => {}} />
      <Outlet />
    </>
  );
}
