  import { Routes, Route } from "react-router-dom";
  import Login from "../pages/Login";
  import Register from "../pages/Register";
  import Home from "../pages/Home";
  import Restaurants from "../pages/Restaurants";
  import RestaurantDetails from "../pages/RestaurantDetails";
  import MyReservations from "../pages/MyReservations";
  import Success from "../pages/Success";
  import AdminDashboard from "../pages/AdminDashboard";
  function AppRoutes() {
    
      const user = JSON.parse(localStorage.getItem("user"));
  
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
      <Route path="/my-reservations" element={<MyReservations />} />
    <Route path="/success" element={<Success />} />
     
          {/* IMPORTANT */}
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/admin" element={<AdminDashboard />} />


      </Routes>
    );
  }

  export default AppRoutes;