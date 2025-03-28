import React, { useState, useEffect } from 'react';
import reviews from '../reviews.json'; // Import des avis


const ReviewsBadge = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStars, setSelectedStars] = useState([]); // État pour le filtre par étoiles
  const reviewsPerPage = 100;

  const togglePopup = () => {
    if (!isPopupOpen) {
      setIsLoading(true); // Activer le chargement
      setTimeout(() => {
        setIsLoading(false); // Désactiver le chargement après 3 secondes
        setIsPopupOpen(true); // Ouvrir la popup
      }, 3000);
    } else {
      setIsPopupOpen(false); // Fermer la popup
    }
  };

  useEffect(() => {
    // Désactiver le scroll du body lorsque la popup est ouverte
    if (isPopupOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }

    // Nettoyage lors du démontage
    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, [isPopupOpen]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterByStars = (stars) => {
    setSelectedStars((prevSelectedStars) => {
      if (prevSelectedStars.includes(stars)) {
        return prevSelectedStars.filter((star) => star !== stars);
      } else {
        return [...prevSelectedStars, stars];
      }
    });
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const getReviewCountByStars = (stars) => {
    return reviews.filter(
      (review) => Number(review.stars) === stars && review.stars !== undefined
    ).length;
  };

  const getReviewPercentageByStars = (stars) => {
    const totalReviews = reviews.filter((review) => review.stars !== undefined).length;
    const starReviews = getReviewCountByStars(stars);
    return totalReviews > 0 ? ((starReviews / totalReviews) * 100).toFixed(2) : 0;
  };

  // Filtrer les avis par étoiles si un filtre est sélectionné
  const filteredReviews = reviews
    .filter((review) => {
      const reviewStars = Number(review.stars);
      return (
        (selectedStars.length > 0 ? selectedStars.includes(reviewStars) : true) &&
        review.content &&
        review.date &&
        review.experienceDate &&
        review.author
      );
    })
    .slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  const totalPages = Math.ceil(
    reviews.filter((review) => {
      const reviewStars = Number(review.stars);
      return (
        (selectedStars.length > 0 ? selectedStars.includes(reviewStars) : true) &&
        review.content &&
        review.date &&
        review.experienceDate &&
        review.author
      );
    }).length / reviewsPerPage
  );

  return (
    <>
      <img
        src="https://christopeit-france.shop/avis-verifies.png"
        alt="Avis vérifiés"
        onClick={togglePopup}
        style={{ cursor: 'pointer' }}
      />
      {isLoading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {isPopupOpen && !isLoading && (
        <div className="popup-overlay" onClick={togglePopup}>
          <button className="close-popup" onClick={togglePopup}>
            <i className="fas fa-times"></i>
          </button>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <a
              className="popup-header"
              target="_blank"
              href="https://fr.avis-verifies.com/blog/"
              rel="noreferrer"
            >
              <img className="logo" src="avis-verifies.svg" alt="Avis vérifiés" />
              <a href="">Blog</a>
              <button>Pour les entreprises</button>
            </a>
            <ol className="popup-breadcrumb">
              <li className="breadcrumb-item">
                <a href="https://fr.avis-verifies.com" target="_blank" rel="nofollow">
                  <i className="fa fa-home breadcrumb-icon"></i>
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="#">Sport</a>
              </li>
              <li className="breadcrumb-item active">
                <a href="#">christopeit-france.shop</a>
              </li>
            </ol>
            <div className="popup-intro">
              <article>
                <img className="logo" src="/logo.png" alt="Logo" />
              </article>
              <article>
                <h5 className="title-rate">
                  Avis clients de : <br></br><span className="bolder">christopeit-france.shop</span>
                </h5>
                <img className="rate" src="/review-rate.png" alt="Note moyenne" />
                <span className="info-rate">
                  Basé sur <span className="bolder">378 avis</span> collectés au cours des 12
                  derniers mois
                  <br />
                  <span className="bolder">1464 avis depuis le 20/01/2019</span>
                </span>
              </article>
              <article className="control">
                <p>
                  Gestion des avis certifiée conforme NF ISO 20488 par AFNOR Certification.
                  <br />
                  <br />
                  Avis vérifiés soumis à contrôles d'authenticité.
                </p>
                <a
                  target="_blank"
                  href="https://certification.afnor.org/services/nf-service-avis-en-ligne"
                  rel="noreferrer"
                >
                  En savoir plus
                </a>
              </article>
            </div>

            <div className="popup-filters">
              <h4>Filtrer par note</h4>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="filter-item">
                  <input
                    type="checkbox"
                    id={`star-${stars}`}
                    checked={selectedStars.includes(stars)}
                    onChange={() => handleFilterByStars(stars)}
                  />
                  <label htmlFor={`star-${stars}`}>{stars} étoiles</label>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${getReviewPercentageByStars(stars)}%` }}
                    ></div>
                  </div>
                  <span className="review-count">{getReviewCountByStars(stars)}</span>
                </div>
              ))}
            </div>
            <div className="popup-reviews">
              <h4>Liste des avis</h4>

              <ul>
                {filteredReviews.map((review, index) => (
                  <li key={index}>
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
                    <p>{review.content}</p>
                    <span className="review-info">
                      Avis du <b>{review.date}</b>, suite à une expérience du{' '}
                      {review.experienceDate} par <b>{review.author}</b>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pagination">
              <p className="notice">Avis affichés par ordre alphabétique</p>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="page">Page</span>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                min="1"
                max={totalPages}
              />
              <span className="total-page">/ {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <p className="review-copyright">
              © 2025{' '}
              <a target="_blank" href="https://fr.avis-verifies.com/afnor/" rel="noreferrer">
                Avis Vérifiés
              </a>{' '}
              - Tous droits réservés
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsBadge;