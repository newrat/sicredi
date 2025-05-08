import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (row: T) => React.ReactNode;
}

interface PaginationProps {
  itemsPerPage: number;
  totalLabel: (from: number, to: number, total: number) => string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  paginationProps?: PaginationProps;
}

export function DataTable<T>({ data, columns, paginationProps }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = paginationProps?.itemsPerPage || 10;
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Generate page numbers
  const pageNumbers = [];
  const maxPageButtons = 3; // Maximum number of page buttons to display
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  
  // Adjust if we're at the end
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-gray-600">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {column.cell
                        ? column.cell(row)
                        : (row[column.accessor as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {paginationProps && data.length > 0 && (
        <div className="px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {paginationProps.totalLabel(
              indexOfFirstItem + 1,
              Math.min(indexOfLastItem, data.length),
              data.length
            )}
          </p>
          
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {pageNumbers.map(number => (
              <Button
                key={number}
                variant={currentPage === number ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(number)}
                className={`px-3 py-1 ${
                  currentPage === number
                    ? "bg-[#33820D] text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                } rounded-md`}
              >
                {number}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
