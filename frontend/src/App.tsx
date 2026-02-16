import { Outlet } from "react-router";
import "./App.css";
import { Navbar } from "./components/custom/navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
