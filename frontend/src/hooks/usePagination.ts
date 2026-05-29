import { useState } from 'react';

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);

  const nextPage = (totalPages: number) => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const goToPage = (p: number) => setPage(p);

  const reset = () => setPage(1);

  return { page, pageSize, nextPage, prevPage, goToPage, reset };
}
