import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./StarRatingInput.css"; // Kita akan buat file CSS-nya

const StarRatingInput = ({ rating, onRatingChange }) => {
  // State 'hover' hanya untuk efek visual saat mouse bergerak
  const [hover, setHover] = useState(null);

  return (
    <div className="star-rating-input">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              // Saat diklik, panggil fungsi 'onRatingChange' dari parent
              onClick={() => onRatingChange(ratingValue)}
            />
            <FaStar
              className="star"
              // Warna bintang berdasarkan state 'hover' atau 'rating'
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={30} // Ukuran bintang
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
