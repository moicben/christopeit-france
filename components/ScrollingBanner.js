import React from 'react';

const ScrollingBanner = ({ items }) => {
  // Dupliquez les éléments pour éviter l'espace blanc
  const repeatedItems = [...items, ...items];

  return (
    <div className="scrolling-banner">
      <div className="scrolling-banner-track">
        {repeatedItems.map((item, index) => (
          <div key={index} className="scrolling-banner-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;