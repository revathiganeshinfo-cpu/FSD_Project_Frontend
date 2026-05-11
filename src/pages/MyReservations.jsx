import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";


const isBookingPast = (date, time) => {
  const bookingDateTime = new Date(`${date?.split("T")[0]}T${time}`);
  return bookingDateTime < new Date();
};

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editSize, setEditSize] = useState(1);

  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");



const fetchReservations = async () => {
  const res = await API.get("/api/reservations/my");
    console.log("Cancel response:", res.data);
  const data = res.data.reservations || [];

  setReservations((prev) => {
    return data.map((r) => {
      const old = prev.find((p) => p._id === r._id);

      if (old?.status === "cancelled") {
        return { ...r, status: "cancelled" };
      }

      return r;
    });
  });
};

const fetchReviews = async () => {
  const res = await API.get("/api/reviews/my");
  setReviews(res.data || []);
};

useEffect(() => {
  const loadData = async () => {
    await fetchReservations();
    await fetchReviews();
  };

  loadData();
}, []);

  const handlePayment = async (r) => {
    if (r.paidAmount >= r.totalAmount) {
      alert("Already Paid ✅");
      return;
    }

    const price = r.restaurant?.price;
    const total = price * r.partySize;

    if (total <= 0) return alert("Price is 0 ❌");

    const res = await API.post("/api/stripe/checkout", {
      restaurantName: r.restaurant?.name || "Restaurant Booking",
      price: total,
      reservationId: r._id,
    });

window.open(res.data.url, "_self");
  };

const handleCancel = async (id) => {
  const res = await API.delete(`/api/reservations/${id}`);
  const { refundAmount } = res.data;

  if (refundAmount > 0) {
    alert(`Reservation cancelled! ₹${refundAmount} refund will be processed to your account. 💰`);
  } else {
    alert("Reservation cancelled successfully! ✅");
  }

  setReservations((prev) =>
    prev.map((r) =>
      r._id === id ? { ...r, status: "cancelled" } : r
    )
  );
};

  const handleUpdate = async (id) => {
    const res = await API.put(`/api/reservations/${id}`, {
      date: editDate,
      time: editTime,
      partySize: editSize,
    });

    const { extraToPay, refundAmount } = res.data;

    if (extraToPay > 0) {
      alert(`Extra payment needed: ₹${extraToPay}`);

      const payRes = await API.post("/api/stripe/checkout", {
        restaurantName: "Extra Payment",
        price: extraToPay,
        reservationId: id,
      });

window.open(payRes.data.url, "_self");      
return;
    }

    if (refundAmount > 0) {
      alert(`Refund ₹${refundAmount} will be processed 💰`);
    }

    alert("Updated successfully ✅");

    setEditId(null);
    fetchReservations();
  };

  const addReview = async (restaurantId) => {
    await API.post("/api/reviews", {
      restaurant: restaurantId,
      rating: editRating,
      comment: editComment,
    });

    setEditComment("");
    fetchReviews();
  };

  const deleteReview = async (id) => {
    await API.delete(`/api/reviews/${id}`);
    fetchReviews();
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-black/60 backdrop-blur-xxl" />

      <div className="relative z-10 pt-24">


<h2 className="gold-shine text-4xl md:text-5xl font-extrabold text-center mb-10 pb-8 pt-8 tracking-wide 
               drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]">
  🍽 My Reservations
</h2>
        {reservations.length === 0 && (
          <p className="text-center text-gray-300">No reservations</p>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {reservations.map((r, i) => {
            const isCancelled = r.status === "cancelled";
            const price = r.restaurant?.price;
            const total = price * r.partySize;

            const isPaid =
              r.paidAmount >= r.totalAmount ||
              r.status?.toLowerCase() === "paid";

const isPast = isBookingPast(r.date, r.time);


            const myReview = reviews.find(
              (rev) =>
                (rev.restaurant?._id || rev.restaurant) ===
                r.restaurant?._id
            );

            return (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.04, rotate: 0.3 }}
                className="relative rounded-3xl overflow-hidden group"
              >

                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-40 blur-xl transition" />

<div
  className={`relative bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-2xl ${
    isCancelled ? "opacity-50 pointer-events-none" : ""
  }`}
>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">
                      {r.restaurant?.name || "Deleted ❌"}
                    </h3>

                   <span
  className={`text-xs px-3 py-1 rounded-full ${
    r.status === "cancelled"
      ? "bg-red-500/20 text-red-400"
      : isPaid
      ? "bg-green-500/20 text-green-400"
      : "bg-yellow-500/20 text-yellow-300"
  }`}
>
  {r.status === "cancelled"
    ? "cancelled"
    : isPaid
    ? "paid"
    : "pending"}
</span>
                  </div>

                  <p className="text-gray-300 text-sm">
                    📅 {r.date?.split("T")[0]} • ⏰ {r.time}
                  </p>

                  <p className="text-gray-300 text-sm">
                    👥 {r.partySize} People
                  </p>

                  <div className="mt-4 bg-white/10 p-4 rounded-xl backdrop-blur-md">
                    <div className="flex justify-between text-sm">
                      <span>Price / person</span>
                      <span>₹{price}</span>
                    </div>

                    <div className="flex justify-between text-sm mt-1">
                      <span>People</span>
                      <span>{r.partySize}</span>
                    </div>

                    <div className="border-t border-white/20 mt-3 pt-3 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-green-400">₹{total}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {editId === r._id ? (
                      <>
                        <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="p-2 rounded bg-white/20" />
                        <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="p-2 rounded bg-white/20" />

                        <select value={editSize} onChange={(e) => setEditSize(Number(e.target.value))} className="p-2 rounded bg-white/20">
                          {[...Array(20)].map((_, i) => (
                            <option key={i + 1}>{i + 1}</option>
                          ))}
                        </select>

                        <button onClick={() => handleUpdate(r._id)} className="bg-green-500 px-3 py-1 rounded">Save</button>
                        <button onClick={() => setEditId(null)} className="bg-gray-500 px-3 py-1 rounded">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(r._id);
                            setEditDate(r.date.split("T")[0]);
                            setEditTime(r.time);
                            setEditSize(r.partySize);
                          }}
                          className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>

                      {r.status === "cancelled" ? (
  <button disabled className="bg-gray-500 px-3 py-1 rounded cursor-not-allowed">
    Cancelled
  </button>
) : isPaid || isPast ? (
  <button disabled className="bg-gray-500 px-3 py-1 rounded opacity-50 cursor-not-allowed">
    🔒 Cannot Cancel
  </button>
) : (
  <button
    onClick={() => handleCancel(r._id)}
    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
  >
    Cancel
  </button>
)}

{isPaid ? (
  <button disabled className="bg-green-600 px-3 py-1 rounded opacity-70">
    ✅ Paid
  </button>
) : isPast ? (
  <button disabled className="bg-gray-500 px-3 py-1 rounded opacity-50 cursor-not-allowed">
    ⛔ Expired
  </button>
) : (
  <button
    onClick={() => handlePayment(r)}
    className="bg-gradient-to-r from-pink-500 to-red-500 px-3 py-1 rounded hover:scale-105 transition"
  >
    💳 Pay ₹{total}
  </button>
)}
                      </>
                    )}
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-3">
                    {myReview ? (
                      <>
                        <div className="text-yellow-400 text-lg">
                          {"★".repeat(myReview.rating)}
                          {"☆".repeat(5 - myReview.rating)}
                        </div>
                        <p className="text-gray-300">{myReview.comment}</p>

                        <button
  onClick={() => deleteReview(myReview._id)}
  className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 
             transition duration-200 mt-2"
  title="Delete Review"
>
  🗑 Delete Review
</button>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm mb-1">Add Review</h4>

                        <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))} className="w-full p-2 mb-2 rounded bg-white/20">
                          {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
                        </select>

                        <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} className="w-full p-2 mb-2 rounded bg-white/20" />

                        <button onClick={() => addReview(r.restaurant?._id)} className="w-full bg-green-500 py-2 rounded">
                          Submit
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyReservations;