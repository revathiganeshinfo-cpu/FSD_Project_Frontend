import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const reservationId = params.get("reservationId");

    console.log("Reservation ID:", reservationId);

    if (!reservationId) {
      console.log("❌ No reservationId");

      setTimeout(() => {
        navigate("/my-reservations");
      }, 1500);

      return;
    }

    const updatePayment = async () => {
      try {
        await API.put(`/reservations/pay/${reservationId}`);

        console.log("✅ Payment updated");

        setTimeout(() => {
          navigate("/my-reservations");
        }, 1500);

      } catch (err) {
        console.log("❌ Payment update failed", err);

        setTimeout(() => {
          navigate("/my-reservations");
        }, 1500);
      }
    };

    updatePayment();

  }, [params, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-400 to-emerald-600 text-white">
      
      <h1 className="text-4xl font-bold mb-4">
        ✅ Payment Successful
      </h1>

      <p className="text-lg">
        Redirecting to your reservations...
      </p>

    </div>
  );
}

export default Success;