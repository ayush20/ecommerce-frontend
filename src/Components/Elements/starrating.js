const StarRating = ({ numberOfStars }) => {
    // Generate an array of size "numberOfStars" filled with null values
    const starsArray = Array.from({ length: numberOfStars });
  
    return (
      <>
        {starsArray.map((_, index) => (
          <i key={index} className="d-icon-star-full fill"></i>
        ))}
        {/* Add the remaining empty stars */}
        {Array.from({ length: 5 - numberOfStars }).map((_, index) => (
          <i key={index + numberOfStars} className="d-icon-star-full"></i>
        ))}
        </>
    );
  }; 
  export default StarRating;
