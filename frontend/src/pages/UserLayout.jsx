import { Outlet } from "react-router-dom";
import UserNavBar from "../pages/UserNavBar";

export default function UserLayout() {
  return (
    <>
      <UserNavBar />
      <main>
        <Outlet /> 
      </main>
    </>
  );
}
