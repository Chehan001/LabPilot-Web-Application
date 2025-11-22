import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import AdminHome from "./pages/admin/AdminHome";
import Equipment from "./pages/admin/Equipment";
import Chemical from "./pages/admin/Chemical";
import Practicals from "./pages/admin/Practicals";
import Timetable from "./pages/admin/Timetable";
import Report from "./pages/admin/Report";
import Attendance from "./pages/admin/Attendance";

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("admin");
  return isAdmin ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="chemical" element={<Chemical />} />
          <Route path="practicals" element={<Practicals />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="report" element={<Report />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
