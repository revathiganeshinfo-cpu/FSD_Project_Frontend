import { useState } from "react";
import heroVideo from "../assets/heroVideo.mp4";
 

const slides = [
 {
  type: "video",
  src: heroVideo, 
},
  {
    type: "image",
    src: "https://i.pinimg.com/736x/7f/d5/bb/7fd5bb5cdc861b4b044b6e9770d66fb8.jpg",   
     title: "Elegant Fine Dining",
    subtitle: "Experience refined ambience and gourmet cuisine",
  },
  {
    type: "image",
    src: "https://i.pinimg.com/1200x/42/27/21/422721d087149cb8881a0fce5d0409dc.jpg",
     title: "Beach View Dining",
    subtitle: "Dine with ocean breeze and sunset views",
  },
  {
    type: "image",
    src: "https://i.pinimg.com/1200x/11/c4/6d/11c46d7094f356fd67538b810318f562.jpg",
     title: "Multi Cuisines",
    subtitle: "Explore flavors from around the world",
  },

];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="relative w-full h-[90vh] overflow-hidden bg-black">

      {slides[current].type === "video" ? (
        <video
          src={slides[current].src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={slides[current].src}
          alt="hero"
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❯
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-6 rounded-full ${
              index === current ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
      {slides[current].type === "image" && (
  <div className="absolute bottom-16 left-12 max-w-xl">
    
    <h2 className="text-white text-4xl font-semibold tracking-wide">
      {slides[current].title}
    </h2>

    <p className="text-gray-300 mt-3 text-lg">
      {slides[current].subtitle}
    </p>

  </div>
)}
    </section>
  );
}