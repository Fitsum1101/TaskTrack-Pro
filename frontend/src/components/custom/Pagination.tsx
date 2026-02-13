import { Button } from "../ui/button";

export const renderPageNumbers = (
  currentPage: number,
  totalPages: number,
  setCurrentPage: (page: number) => void,
) => {
  const pageNumbers = [];
  const maxPageNumbersToShow = 5;

  let startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2),
  );
  let endPage = startPage + maxPageNumbersToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const showFirstPage = startPage > 1;
  const showEllipsesBefore = startPage > 2;
  const showLastPage = endPage < totalPages;
  const showEllipsesAfter = endPage < totalPages - 1;

  return (
    <div className="flex items-center space-x-2 my-4">
      {/* Previous Button */}
      <Button
        className="border-[0.5px] border-gray-400 hover:border-primary/90"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      ></Button>

      {showFirstPage && (
        <>
          <Button
            className="border-[0.5px] border-gray-400 hover:border-primary/90"
            key={1}
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>
          {showEllipsesBefore && <span className="px-1">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          className="border-[0.5px] border-gray-400 hover:border-primary/90"
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Button>
      ))}

      {showLastPage && (
        <>
          {showEllipsesAfter && <span className="px-1">...</span>}
          <Button
            className="border-[0.5px] border-gray-400 hover:border-primary/90"
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        className="border-[0.5px] border-gray-400 hover:border-primary/90"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {/* {t?.components?.utils?.pagination?.next} &gt; */}
      </Button>
    </div>
  );
};
