import React from "react";
import "../css/Components/Pagination.css";

const Pagination = ({ currentPage, totalPages, loading, onPageChange }) => {
  const isFirstPage = currentPage <= 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className="pagination">
      {!isFirstPage && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={loading}
          className="pagination-button"
        >
          &laquo;
        </button>
      )}

      <span className="pagination-info">
        str. {currentPage + 1} z {totalPages}
      </span>

      {!isLastPage && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={loading}
          className="pagination-button"
        >
          &raquo;
        </button>
      )}
    </div>
  );
};

export default Pagination;
