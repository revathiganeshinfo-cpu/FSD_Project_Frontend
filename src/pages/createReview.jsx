import { useState } from "react";
import API from "../services/api";

function CreateReview({ restaurantId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThanks, setShowThanks] = useState(false); // ✅ NEW

  const submitReview = async () => {
    try {
      setLoading(true);

      if (!restaurantId) {
        alert("Restaurant ID missing ❌");
        return;
      }

      await API.post("/api/reviews", {
        restaurant: restaurantId,
        rating: Number(rating),
        comment,
      });

      // ✅ THANK YOU POPUP
      setShowThanks(true);

      setTimeout(() => {
        setShowThanks(false);
      }, 2000);

      setComment("");
      setRating(5);
    } catch (error) {
      alert(error?.response?.data?.message || "Error adding review ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Add Review</h3>

      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Write comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={submitReview} disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {showThanks && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "green",
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
          }}
        >
          🎉 Thanks for your review!
        </div>
      )}
    </div>
  );
}

export default CreateReview;