import { useState } from 'react';

export const usePagination = (data = [], itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  };

  const next = () => setCurrentPage(p => Math.min(p + 1, maxPage));
  const prev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const jump = (page) => setCurrentPage(Math.max(1, Math.min(page, maxPage)));

  return { next, prev, jump, currentData, currentPage, maxPage };
};