export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center gap-1 mt-4">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 text-sm border border-gray-200 text-gray-500 hover:bg-gray-100 rounded"
        >
          &laquo;
        </button>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 text-sm border rounded ${
            p === currentPage
              ? 'bg-gray-900 text-white border-gray-900'
              : 'border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 text-sm border border-gray-200 text-gray-500 hover:bg-gray-100 rounded"
        >
          &raquo;
        </button>
      )}
    </div>
  );
}
