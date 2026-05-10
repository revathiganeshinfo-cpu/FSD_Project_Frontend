import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const called = useRef(false); 
  const reservationId = params.get("reservationId");

  useEffect(() => {
    if (!reservationId) {
      navigate("/my-reservations");
      return;
    }

    if (called.current) return; 
    called.current = true;

    const updatePayment = async () => {
      try {
        await API.put(`/api/reservations/pay/${reservationId}`);
        console.log("Payment updated ✅");
      } catch (err) {
        console.error("Payment update failed:", err);
      } finally {
        
        setTimeout(() => {
          navigate("/my-reservations");
        }, 1500);
      }
    };

    updatePayment();
  }, [reservationId, navigate]);

  return (
    <div className="h-screen flex items-center justify-center text-white text-center"
      style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
      <div>
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-green-100 mt-2">Redirecting to your reservations...</p>
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default Success;