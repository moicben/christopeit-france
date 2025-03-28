import React, { useState, useEffect } from 'react';
import reviews from '../reviews.json';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(4); // Par défaut, 4 avis par page

  // Détecter si l'utilisateur est sur un appareil mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setReviewsPerPage(1); // 1 avis par page en version mobile
      } else {
        setReviewsPerPage(4); // 4 avis par page sur desktop
      }
    };

    handleResize(); // Vérifier au chargement
    window.addEventListener('resize', handleResize); // Écouter les changements de taille

    return () => {
      window.removeEventListener('resize', handleResize); // Nettoyer l'écouteur
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, reviews.length - reviewsPerPage) : prevIndex - reviewsPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + reviewsPerPage >= reviews.length ? 0 : prevIndex + reviewsPerPage
    );
  };

  const currentReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

  return (
    <section className="testimonials">
      <div className="wrapper">
        <img onClick={(e) => { document.querySelector("section.badge-container > img").click() }} src="https://christopeit-france.shop/avis-verifies.svg" alt="Avis vérifiés" />
        <h2>Avis clients de : <span>christopeit-france.shop</span></h2>
        <span className="info-rate">Basé sur <span className="bolder">378 avis</span> collectés au cours des 12 derniers mois<br/><span className="bolder">1464 avis depuis le 20/01/2019</span></span>
        <div className="testimonials-slider">
          <button className="slider-arrow left" onClick={handlePrev}>
            &#8249;
          </button>
          <div className="testimonial-list">
            {currentReviews.map((review, index) => (
              <div key={index} className="testimonial">
                <article className="star-head">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`stars-item ${i < Number(review.stars) ? 'full' : ''}`}
                      ></span>
                    ))}
                  </div>
                  <span className="rate">
                    <b>{review.stars}</b>/5
                  </span>
                </article>
                <p className='review-content'>{review.content}</p>
                <span className="review-info">
                  Avis du <b>{review.date}</b>, suite à une expérience du{' '}
                  {review.experienceDate} par <b>{review.author}</b>
                </span>
              </div>
            ))}
          </div>
          <button className="slider-arrow right" onClick={handleNext}>
            &#8250;
          </button>
        </div>
        <button onClick={(e) => { document.querySelector("section.badge-container > img").click() }} className='view-more'>Voir tous les avis</button>
      </div>
    </section>
  );
};

export default Testimonials;