import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const reservationId = params.get("reservationId");

  useEffect(() => {
    if (!reservationId) {
      navigate("/my-reservations");
      return;
    }

    const updatePayment = async () => {
      try {
        await API.put(`/api/reservations/pay/${reservationId}`);
      } catch (err) {
        console.log(err);
      }

      // ALWAYS redirect after 1 sec
      setTimeout(() => {
        navigate("/my-reservations");
      }, 1000);
    };

    updatePayment();
  }, [reservationId, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-green-500 text-white text-center">
      <div>
        <h1 className="text-4xl font-bold">Payment Successful 🎉</h1>
        <p className="mt-2">Redirecting...</p>
      </div>
    </div>
  );
}

export default Success;