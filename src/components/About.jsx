import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUtensils, FaCalendarCheck, FaStar } from "react-icons/fa";

export default function About() {

  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 50;
    const duration = 1500;
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="relative py-24 px-8 overflow-hidden bg-gradient-to-br from-[#fdfbfb] via-[#f5f7fa] to-[#eef1f5]">

      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300/20 blur-3xl rounded-full"></div>

      <div className="max-w-6xl mx-auto">

        <div className="grid md:grid-cols-2 gap-14 items-center">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-3xl shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
              alt="restaurant"
              className="w-full h-[450px] object-cover hover:scale-110 transition duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-semibold text-gray-800 mb-6">
              Elevate Your Dining Experience
            </h2>

            <p className="text-gray-600 mb-6">
              Discover handpicked restaurants offering luxury ambiance,
              exquisite cuisine, and unforgettable moments.
            </p>

            <div className="text-3xl font-bold text-gray-800 mb-8">
              {count}+ Restaurants
            </div>

            <div className="grid grid-cols-2 gap-5 mt-6">

              <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md border border-white/40 hover:scale-105 transition">
                <h3 className="text-gray-800 font-semibold">Luxury Dining</h3>
                <p className="text-gray-500 text-sm">Premium ambiance</p>
              </div>

              <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md border border-white/40 hover:scale-105 transition">
                <h3 className="text-gray-800 font-semibold">Easy Booking</h3>
                <p className="text-gray-500 text-sm">Fast reservations</p>
              </div>

              <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md border border-white/40 hover:scale-105 transition">
                <h3 className="text-gray-800 font-semibold">Top Chefs</h3>
                <p className="text-gray-500 text-sm">Global cuisine</p>
              </div>

              <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md border border-white/40 hover:scale-105 transition">
                <h3 className="text-gray-800 font-semibold">Premium Service</h3>
                <p className="text-gray-500 text-sm">Best experience</p>
              </div>

            </div>

          </motion.div>
        </div>

        <div className="mt-20">
          <h3 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            Why Choose Us
          </h3>

          <div className="grid md:grid-cols-3 gap-8">

            <motion.div onMouseMove={handleMove} whileHover={{ scale: 1.05 }} className="relative group perspective">
              <motion.div whileHover={{ rotateX: 6, rotateY: -6 }} className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-white/40 shadow-md overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                  style={{
                    background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.4), transparent 60%)`,
                  }}
                />
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-3xl mb-4">
                  <FaUtensils />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">Curated Restaurants</h4>
                <p className="text-gray-500 text-sm">Only the best handpicked dining experiences</p>
              </motion.div>
            </motion.div>

            <motion.div onMouseMove={handleMove} whileHover={{ scale: 1.05 }} className="relative group perspective">
              <motion.div whileHover={{ rotateX: 6, rotateY: -6 }} className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-white/40 shadow-md overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                  style={{
                    background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.4), transparent 60%)`,
                  }}
                />
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-3xl mb-4">
                  <FaCalendarCheck />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">Seamless Booking</h4>
                <p className="text-gray-500 text-sm">Reserve your table in seconds</p>
              </motion.div>
            </motion.div>

            <motion.div onMouseMove={handleMove} whileHover={{ scale: 1.05 }} className="relative group perspective">
              <motion.div whileHover={{ rotateX: 6, rotateY: -6 }} className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-white/40 shadow-md overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                  style={{
                    background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.4), transparent 60%)`,
                  }}
                />
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-3xl mb-4">
                  <FaStar />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">Premium Experience</h4>
                <p className="text-gray-500 text-sm">Enjoy luxury dining experience</p>
              </motion.div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}