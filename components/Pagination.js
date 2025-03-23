import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <span>{currentPage} sur {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ visibility: currentPage === totalPages ? 'hidden' : 'visible' }}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;