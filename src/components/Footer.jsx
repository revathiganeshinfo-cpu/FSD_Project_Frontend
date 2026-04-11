import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Footer() {
          const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-[#0f172a] to-[#020617] text-gray-300 pt-16 pb-8 px-8">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            RestaurantApp
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Discover luxury dining experiences, book tables effortlessly,
            and enjoy unforgettable moments with the best restaurants.
          </p>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li
  onClick={() => navigate("/")}
  className="hover:text-white cursor-pointer transition"
>
  Home
</li>

<li
  onClick={() => navigate("/restaurants")}
  className="hover:text-white cursor-pointer transition"
>
  Restaurants
</li>

<li
  onClick={() => navigate("/my-reservations")}
  className="hover:text-white cursor-pointer transition"
>
  My Reservations
</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> Chennai, India
            </div>

            <div className="flex items-center gap-2">
              <FaPhone /> +91 9912 345 678
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope /> support@restaurantapp.com
            </div>

          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4">

        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
    <div className="p-3 bg-white/10 rounded-full hover:bg-blue-500 transition transform hover:scale-110 shadow-md">
      <FaFacebookF />
    </div>
  </a>

              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
    <div className="p-3 bg-white/10 rounded-full hover:bg-pink-500 transition transform hover:scale-110 shadow-md">
      <FaInstagram />
    </div>
  </a>

            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
    <div className="p-3 bg-white/10 rounded-full hover:bg-sky-400 transition transform hover:scale-110 shadow-md">
      <FaTwitter />
    </div>
  </a>


          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RestaurantApp. All rights reserved.
      </div>

    </footer>
  );
}   