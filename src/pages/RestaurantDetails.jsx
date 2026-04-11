import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/reserback.avif"; // ✅ background

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [availableSeats, setAvailableSeats] = useState(null);

  useEffect(() => {
    fetchDetails();
    fetchReviews();
  }, []);

  const fetchDetails = async () => {
    const res = await API.get(`/restaurants/${id}`);
    setRestaurant(res.data);
  };

  const fetchReviews = async () => {
    const res = await API.get(`/reviews/restaurant/${id}`);
    setReviews(res.data);
  };

  const checkAvailability = async () => {
    const res = await API.get("/reservations/check", {
      params: { restaurant: id, date, time },
    });
    setAvailableSeats(res.data.availableSeats);
  };

  const navigate = useNavigate();

  const handleReservation = async () => {
    if (!date || !time) return alert("Select date & time");

    if (availableSeats !== null && partySize > availableSeats) {
      return alert("Not enough seats ❌");
    }

    try {
      await API.post("/reservations", {
        restaurant: id,
        date,
        time,
        partySize,
      });

      alert("Reservation successful ✅");

      navigate("/my-reservations");

      await checkAvailability();
      setPartySize(1);

    } catch (err) {
      alert("Reservation failed / Registered and Login to book again");
    }
  };

  if (!restaurant)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen relative overflow-hidden text-white"
    >

      <div className="absolute inset-0 bg-black/70 backdrop-blur-xxl animate-bgZoom"></div>

      <div className="relative z-10">

        <div className="relative">
          <img
            src={
              restaurant.images?.[0] ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"
            }
            className="w-full h-[350px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="absolute bottom-6 left-6">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-gray-300">📍 {restaurant.location}</p>
          </div>

          <div className="absolute top-5 right-5 bg-white text-black px-3 py-1 rounded-lg font-semibold">
            ⭐ {restaurant.rating || 4.2}
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-6">

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🍜 {restaurant.cuisine}
                </span>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                  💰 ₹{restaurant.price} / person
                </span>
              </div>

              <p className="text-gray-300 mt-4">
                {restaurant.description ||
                  "Delicious food with great ambience."}
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">🍽️ Menu</h3>

              {restaurant.menu?.length > 0 ? (
                restaurant.menu.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-white/10 py-2"
                  >
                    <span>{item.name}</span>
                    <span className="text-green-400">₹{item.price}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No menu available</p>
              )}
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">⭐ Reviews</h3>

              {reviews.length === 0 && (
                <p className="text-gray-400">No reviews yet</p>
              )}

              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border-b border-white/10 py-3"
                >
                  <p className="font-semibold">{r.user?.name}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-yellow-400 text-sm">
                      {Array.from({ length: 5 }, (_, i) => {
                        const full = i < Math.floor(r.rating);
                        const half =
                          i === Math.floor(r.rating) &&
                          r.rating % 1 !== 0;

                        return (
                          <span key={i}>
                            {full ? "★" : half ? "⯨" : "☆"}
                          </span>
                        );
                      })}
                    </div>

                    <span className="text-gray-400 text-xs">
                      ({r.rating})
                    </span>
                  </div>

                  <p className="text-gray-300">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="glass-card p-6 rounded-2xl h-fit sticky top-24"
          >
            <h3 className="text-xl font-semibold mb-4">📅 Book Table</h3>

            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-3 input-premium"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full mb-3 input-premium"
            />

            <input
              type="number"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              min="1"
              className="w-full mb-3 input-premium"
            />

            <button
              onClick={checkAvailability}
              className="w-full mb-3 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              Check Availability
            </button>

            {availableSeats !== null && (
              <div className="mb-3 space-y-1">
                <p className="text-green-400">
                  Available Seats: {availableSeats}
                </p>

                {partySize > 0 && (
                  <p className="text-yellow-400 text-sm">
                    After your booking:{" "}
                    {availableSeats - partySize >= 0
                      ? availableSeats - partySize
                      : "Not enough seats ❌"}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleReservation}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl font-semibold hover:scale-105 transition"
            >
              Book Now
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;