export default function Pagination({ currentPage, totalPages, onPageChange, limit, setLimit }) {
    console.log(currentPage, totalPages);
    console.log(onPageChange);

    return (
        <div className="flex justify-center">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
    );
}