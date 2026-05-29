interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
  onChangePageSize: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [3, 5, 7];

export function Pagination({ page, totalPages, totalCount, pageSize, onPrev, onNext, onChangePageSize }: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Mostrar</span>
        <select
          value={pageSize}
          onChange={e => onChangePageSize(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PAGE_SIZE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span>por página</span>
        <span className="hidden sm:inline ml-2">· {totalCount} resultados</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          ← Anterior
        </button>
        <span className="text-sm text-gray-600 px-2">
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
