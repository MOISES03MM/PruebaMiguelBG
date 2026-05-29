import { useState } from 'react';

export function usePagination(initialPage = 1, initialPageSize = 5) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const nextPage = (totalPages: number) => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const goToPage = (p: number) => setPage(p);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const reset = () => setPage(1);

  return { page, pageSize, nextPage, prevPage, goToPage, changePageSize, reset };
}
