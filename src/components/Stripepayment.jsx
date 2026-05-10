import { useState } from "react";
import API from "../services/api";
import { CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StripePayment({ reservation }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {

  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      alert("Please login to make payment! 🔐");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/stripe/checkout", {
        restaurantName: reservation.restaurantName,
        price: reservation.price || 500,
        reservationId: reservation._id,
      });

      window.location.href = res.data.url;

    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "";

      if (message.includes("blocked")) {
        alert("Your account has been blocked. Contact admin. ❌");
        navigate("/login");
      } else if (message.includes("token") || message.includes("Token")) {
        alert("Session expired. Please login again. 🔐");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("Payment failed. Please try again. ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300
        ${loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 hover:shadow-lg"
        }`}
    >
      {loading ? (
        <><Loader2 className="animate-spin w-5 h-5" />Processing...</>
      ) : (
        <><CreditCard className="w-5 h-5" />Pay ₹{reservation.price || 500}</>
      )}
    </button>
  );
}

export default StripePayment;