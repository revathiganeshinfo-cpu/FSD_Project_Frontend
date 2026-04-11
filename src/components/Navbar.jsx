import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Utensils, Calendar, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("user");
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const mainLinks = [
    { name: "Home", path: "/" },
    { name: "Restaurants", path: "/restaurants" },
  ];

  if (user) {
    mainLinks.push({ name: "My Reservations", path: "/my-reservations" });
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 flex items-center justify-between px-9 py-4 transition-all duration-4000
      ${
        scrolled
          ? "bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-none"
      }`}
    >

      <Link to="/" className="flex items-center gap-2 no-underline">
      
        <div className="flex items-center gap-4">

<img
  src=".\src\assets\logo1.png"
  alt="logo"
  className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full
  shadow-[0_0_20px_rgba(255,215,0,0.5)]
"
/>

   <h1 className="text-xl md:text-2xl font-bold tracking-wider
font-[Cinzel]
bg-gradient-to-r from-[#fff6d6] via-[#f7d774] to-[#caa24a]
bg-clip-text text-transparent
drop-shadow-[0_10px_30px_rgba(255,215,0,0.5)]"
>
  Regal Grandeur
</h1>

  </div>
        
      </Link>

      <div className="flex items-center bg-[#1a1a1a]/80 backdrop-blur-md border border-[#2e2e2e] rounded-full p-1 gap-1 shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]">
        {mainLinks.map((link) => {
          const isActive = activePath === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${
                  isActive
                    ? "text-[#e8e8e8] bg-[#2e2e2e] shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "text-[#6a6a6a] hover:text-[#e8e8e8]"
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        {!user ? (
          <>
            <Link
              to="/register"
              className="text-[15px] text-[#6a6a6a] hover:text-[#e8e8e8] transition"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="px-7 py-2 rounded-full border border-[#3a3a3a] text-[#d0d0d0] hover:bg-[#222] hover:border-[#555] hover:text-white transition"
            >
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-7 py-2 rounded-full border border-[#3a3a3a] text-[#d0d0d0] hover:bg-[#222] hover:border-[#555] hover:text-white transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}