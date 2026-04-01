export interface PageItem {
  label: string;
  value: number | null;
}

/**
 * Tạo danh sách số trang với ellipsis (...)
 * cho phân trang kiểu: 1 ... 4 5 6 ... 10
 */
export function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  const pages: PageItem[] = [];

  if (totalPages <= 0) return pages;

  pages.push({ label: '1', value: 1 });

  if (currentPage > 3) {
    pages.push({ label: '...', value: null });
  }

  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push({ label: String(i), value: i });
  }

  if (currentPage < totalPages - 2) {
    pages.push({ label: '...', value: null });
  }

  if (totalPages > 1) {
    pages.push({ label: String(totalPages), value: totalPages });
  }

  return pages;
}
