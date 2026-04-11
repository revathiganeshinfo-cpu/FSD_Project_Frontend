import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import bgImage from "../assets/resbackground.jpg";

export default function Restaurants() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

const handleSearch = async () => {
  setLoading(true);

  try {
    const params = {};

    if (search.trim()) params.name = search.trim();
    if (location) params.location = location;
    if (cuisine) params.cuisine = cuisine;

if (price) params.price = price;


    console.log("PARAMS:", params);

    const res = await API.get("/api/restaurants/search", { params });

    console.log("RESULT:", res.data);

    setRestaurants(res.data);

  } catch (err) {
    console.log(err);
  }

  setLoading(false);
};

  const trendingCuisines = ["Indian", "BBQ", "Japanese", "Chinese", "Italian", "Fast Food"];

  const getFoodImage = (cuisine) => {
    const images = {
      Indian:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
      Chinese:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
      Italian:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
      Japanese:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      BBQ: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      "Fast Food":
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      default:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    };

    return images[cuisine] || images["default"];
  };

  return (
<div className="relative min-h-screen overflow-hidden">

  <div
    className="absolute inset-0 bg-cover bg-center animate-bgZoom"
    style={{
      backgroundImage: `url(${bgImage})`,
    }}
  ></div>
  

  <div className="relative z-10 pt-32">  
<motion.div
  initial={{ y: -40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="max-w-6xl mx-auto  mb-12 px-6 py-5 
  bg-white/10 backdrop-blur-lg 
  border border-white/20 
  rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]
  flex flex-wrap gap-4 justify-center items-center"
>

  <input
    placeholder="🔍 Search restaurants..."
    value={search}
    type="text"
    onChange={(e) => setSearch(e.target.value)}
    className="px-5 py-3 w-60 rounded-full 
    bg-black/40 text-white placeholder-gray-300
    border border-white/20
    focus:ring-2 focus:ring-pink-500
    focus:scale-105 transition duration-300 outline-none"
  />

  <input
    placeholder="📍 Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="px-5 py-3 w-44 rounded-full 
    bg-black/40 text-white placeholder-gray-300
    border border-white/20
    focus:ring-2 focus:ring-blue-500
    focus:scale-105 transition duration-300 outline-none"
  />

  <select
    value={cuisine}
    onChange={(e) => setCuisine(e.target.value)}
    className="px-5 py-3 rounded-full 
    bg-black/40 text-white 
    border border-white/20
    focus:ring-2 focus:ring-purple-500
    focus:scale-105 transition duration-300 outline-none"
  >
    <option value="">🍜 Cuisine</option>
    <option>South Indian</option>
    <option>North Indian</option>
    <option>Chinese</option>
    <option>Italian</option>
    <option>Indian</option>
    <option>BBQ</option>
  </select>

    <select
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    className="px-5 py-3 rounded-full 
    bg-black/40 text-white 
    border border-white/20
    focus:ring-2 focus:ring-purple-500
    focus:scale-105 transition duration-300 outline-none"
  >
    <option value={0}>💰 All Prices</option>
  <option value={200}>Below ₹200</option>
  <option value={500}>Below ₹500</option>
  <option value={1000}>Below ₹1000</option>
  </select>

  <button
    onClick={handleSearch}
    className="px-6 py-3 rounded-full font-semibold
    bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
    text-white shadow-lg
    hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,100,0.7)]
    transition duration-300"
  >
    Search
  </button>

  <button
    onClick={fetchRestaurants}
    className="px-6 py-3 rounded-full font-semibold
    bg-white/20 text-white border border-white/20
    hover:bg-white/30 hover:scale-105
    transition duration-300"
  >
    Reset
  </button>

</motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {loading && (
          <div className="col-span-3 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}

        {!loading && restaurants.length === 0 && (
          <p className="col-span-3 text-center text-gray-400 text-lg">
            😔 No restaurants found
          </p>
        )}

        {!loading &&
          restaurants.map((r, i) => {
            const isTrending = trendingCuisines.includes(r.cuisine);

            return (
             <motion.div
  key={r._id}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.05 }}
  whileHover={{ y: -10, scale: 1.03 }}
  className="cursor-pointer"
  onClick={() => navigate(`/restaurants/${r._id}`)}
>
  <div className="card-glow rounded-2xl">

    <div className="relative z-10 rounded-2xl overflow-hidden">

      <div className="relative">
        <img
          src={
            r.images?.length > 0
              ? r.images[0]
              : getFoodImage(r.cuisine)
          }
          className="h-52 w-full object-cover transition duration-500 hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-sm font-semibold shadow">
          ⭐ {r.rating || 4.2}
        </div>
      </div>

      <div className="p-4 text-white space-y-2">

        <h3 className="text-lg font-semibold truncate">
          {r.name}
        </h3>

        <p className="text-sm text-gray-300">
          📍 {r.location}
        </p>

        <span
          className={`inline-block text-xs px-3 py-1 rounded-full transition
          ${
            trendingCuisines.includes(r.cuisine)
              ? "bg-pink-500/20 text-pink-300 shadow-[0_0_10px_#ec4899] animate-pulse"
              : "bg-white/20 text-gray-200"
          }`}
        >
          🍜 {r.cuisine}
        </span>

        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-green-400 text-lg">
            ₹{r.price}
            <span className="text-xs text-gray-400 ml-1">
              /person
            </span>
          </span>
        </div>

      </div>

    </div>
  </div>
</motion.div>
            );
          })}
      </div>
    </div></div>
  );
}
