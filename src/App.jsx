import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function AppContent() {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}   

      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />   
    </BrowserRouter>
  );
}

export default App;