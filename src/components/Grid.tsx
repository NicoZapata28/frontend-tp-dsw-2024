import React, { useState } from 'react';
import styles from '../components/Grid.module.css';

interface GridProps {
  items: any[];
  CardComponent: React.FC<any>;
}

const Grid: React.FC<GridProps> = ({ items, CardComponent }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 20;
  
  const startIdx = currentPage * cardsPerPage;
  const endIdx = startIdx + cardsPerPage;
  const totalPages = Math.ceil(items.length / cardsPerPage);

  const currentCards = items.slice(startIdx, endIdx);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {currentCards.map((item, index) => (
          <div key={index} className={styles.cardContainer}>
            <CardComponent data={item} />
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          Anterior
        </button>
        <span>
          Página {currentPage + 1} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Grid;
