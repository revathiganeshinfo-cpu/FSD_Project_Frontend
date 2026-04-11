import { useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aarav Sharma",
    review:
      "Absolutely amazing experience! The booking was seamless and the restaurant ambiance was top-notch.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    review:
      "Loved the beachside dining recommendation. Perfect place for a peaceful evening.",
    rating: 4,
  },
  {
    name: "Rahul Mehta",
    review:
      "Great variety of restaurants. Found my new favorite fine dining spot!",
    rating: 5,
  },
  {
    name: "Sneha Kapoor",
    review:
      "Super easy to use and very elegant UI. Booking tables has never been this simple.",
    rating: 4,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const next = () => {
    setCurrent((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="py-24 px-8  bg-gradient-to-br from-[#f8f9fb] to-[#eef1f5]">

      <div className="max-w-4xl mx-auto text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-semibold text-gray-800 mb-12"
        >
          What Our Customers Say
        </motion.h2>

        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/40"
        >
          <div className="mb-4">
            {"⭐".repeat(testimonials[current].rating)}
          </div>

          <p className="text-gray-600 text-lg mb-6">
            "{testimonials[current].review}"
          </p>

          <h3 className="text-gray-800 font-semibold">
            — {testimonials[current].name}
          </h3>
        </motion.div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            ❮
          </button>

          <button
            onClick={next}
            className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            ❯
          </button>
        </div>

      </div>
    </section>
  );
}