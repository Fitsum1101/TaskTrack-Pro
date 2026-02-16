import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Outlet />
    </div>
  );
};

export default RootLayout;
