import React, { useState, useEffect, useRef } from 'react';

const ProductImages = ({ images, productTitle, handleImageClick, handleMouseMove, handleNextImages, selectedImageIndex, visibleImageIndex }) => {
  const visibleImages = images.slice(visibleImageIndex, visibleImageIndex + 4);
  if (visibleImages.length < 4) {
    visibleImages.push(...images.slice(0, 4 - visibleImages.length));
  }

  return (
    <div className="product-image">
      {images[selectedImageIndex] && (
        <img
          src={images[selectedImageIndex]}
          alt={productTitle}
          className="large-image"
          onMouseMove={handleMouseMove}
        />
      )}
      <div className="thumbnail-container">
        {visibleImages.map((image, index) => (
          image && (
            <img
              key={index + visibleImageIndex}
              src={image}
              alt={`${productTitle} ${index + 1}`}
              onClick={() => handleImageClick(index + visibleImageIndex)}
              className={`thumbnail ${selectedImageIndex === index + visibleImageIndex ? 'selected' : ''}`}
            />
          )
        ))}
        {images.length > 4 && (
          <button className="next-button" onClick={handleNextImages}>
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductImages;