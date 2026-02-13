import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Settings,
  Filter,
  PlusCircle,
  Eye,
  Trash2,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { renderPageNumbers } from "./Pagination";
import type { DataGridProps } from "@/types/table";
import { TableItemPerPageList } from "@/constant/table";
import { Link } from "react-router-dom";

export function BasicDataGrid<T>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  showSearch = true,
  showColumnSelector = true,
  showPagination = true,
  showRowSelection = false,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onItemPerPageChange,
  onPageChange,
  onSearch,
  rowClickPath,
  onRowSelectionChange,
  onFilterClick,
  showFilter = false,
  onAddClick,
  showAddButton = false,
  buttonTitle = "Add",
  showActions = true, // Default to true
  onView, // Destructure onView prop
  onEdit, // Destructure onEdit prop
  onDelete, // Destructure onDelete prop
  customButtons, // custom button on the top of the table
  onSortChange,
  initialSort,
  initialSearchValue,
  showItemsPerPage = false,
}: DataGridProps<T>) {
  const [itemsPerPageState, setItemsPerPageState] =
    React.useState(itemsPerPage);
  const randomNum = React.useRef(Math.floor(Math.random() * 1000) + 1); // Use useRef instead of variable
  const [sorting, setSorting] = React.useState<SortingState>(
    initialSort ? [{ id: initialSort.id, desc: initialSort.desc }] : [],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState(
    initialSearchValue ?? "",
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
      return; // rely on API search only; skip local filtering
    }
    setGlobalFilter(value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPageState(value);
    if (onItemPerPageChange) {
      onItemPerPageChange(value);
    }
    if (onPageChange) {
      onPageChange(1); // reset to first page when limit changes
    }
  };

  // Transform our custom column definitions to TanStack columns
  const tanstackColumns = React.useMemo<ColumnDef<T>[]>(() => {
    const result: ColumnDef<T>[] = [];

    if (showRowSelection) {
      result.push({
        id: "select",
        sortingFn: "textCaseSensitive",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    columns.forEach((column) => {
      result.push({
        id: column.id,
        sortingFn: "textCaseSensitive",
        accessorKey: column.accessorKey as string,
        header: ({ column: col }) => {
          if (!column.sortable) {
            return column.header;
          }
          return (
            <Button
              variant="ghost"
              onClick={() => {
                const isSorted = col.getIsSorted();
                let newSort: { id: string; desc: boolean } | null = null;

                if (isSorted === "asc") {
                  newSort = { id: column.id, desc: true };
                } else if (isSorted === "desc") {
                  newSort = null; // Clear sorting
                } else {
                  newSort = { id: column.id, desc: false }; // Default to ascending
                }

                // Update local state
                setSorting(
                  newSort ? [{ id: newSort.id, desc: newSort.desc }] : [],
                );

                // Notify parent component
                if (onSortChange) {
                  onSortChange(newSort);
                }
              }}
              className={`px-0 hover:bg-transparent ${
                col.getIsSorted() ? "text-primary" : ""
              }`}
            >
              {column.header}
              {col.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4 text-primary" />
              ) : col.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4 text-primary" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          if (column.cell) {
            return column.cell(row.original);
          }
          if (rowClickPath && column.id === "name") {
            return (
              <Link
                to={rowClickPath(row.original)}
                className="text-primary hover:underline"
              >
                {String(row.getValue(column.id))}
              </Link>
            );
          }
          return <div>{String(row.getValue(column.id))}</div>;
        },
        enableSorting: column.sortable,
        enableHiding: column.filterable,
      });
    });

    // Add actions column if showActions is true
    if (showActions) {
      result.push({
        id: `actions-sample-${randomNum.current}`, // Use .current with useRef
        header: "Actions",
        enableHiding: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex gap-1 ">
            {onView && (
              <Button
                size="icon"
                variant="outline"
                className="hover:bg-accent hover:text-accent-foreground border-none p-0"
                onClick={() => onView(row.original)}
              >
                <Eye className="h-2 w-2" />
                <span className="sr-only">View</span>
              </Button>
            )}
            {onEdit && (
              <Button
                size="icon"
                variant="outline"
                className="hover:bg-accent hover:text-accent-foreground border-none p-0"
                onClick={() => onEdit(row.original)}
              >
                <SquarePen className="h-2 w-2" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="outline"
                className="text-destructive hover:bg-destructive/20 hover:text-destructive border-none p-0"
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className="h-2 w-2" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        ),
      });
    }

    return result;
  }, [
    columns,
    showRowSelection,
    rowClickPath,
    showActions,
    onView,
    onEdit,
    onDelete,
    onSortChange,
    // randomNum is not needed in dependencies because we use useRef
  ]);

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    initialState: {
      pagination: {
        pageSize: itemsPerPage,
      },
      sorting: initialSort
        ? [{ id: initialSort.id, desc: initialSort.desc }]
        : [],
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    ...(onSearch ? {} : { onGlobalFilterChange: setGlobalFilter }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(onSearch ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(onSearch ? {} : { globalFilter }),
    },
    manualSorting: true,
  });

  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  // Handle external pagination control
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      table.setPageIndex(page - 1);
    }
  };

  return (
    <div className="space-y-4 w-full mx-auto border-none">
      {title && (
        <div className="flex items-center justify-between border-none">
          <div className="">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        </div>
      )}
      {/* Add the buttons here */}
      <div className="flex items-center justify-between">
        <div>
          {showSearch && (
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 hover:text-primary/90" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 focus-visible:outline-none focus-visible:ring-[0.5px] focus-visible:ring-ring focus-visible:ring-offset-1 border-[0.5px] border-primary/30"
              />
            </div>
          )}
        </div>
        {/* Empty div to balance the space */}
        <div className="space-x-2">
          {showColumnSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Customize Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showFilter && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-[0.5px] border-primary/90 hover:text-primary/90"
              onClick={onFilterClick}
            >
              <Filter className="h-4 w-4 hover:text-primary/90" />
              Filter
            </Button>
          )}
          {/* Items per page dropdown */}
          {showItemsPerPage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Per page: {itemsPerPageState}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {TableItemPerPageList.map((num) => (
                  <DropdownMenuCheckboxItem
                    key={num}
                    checked={itemsPerPageState === num}
                    onCheckedChange={() => handleItemsPerPageChange(num)}
                  >
                    {num}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* Render custom buttons here */}
          {customButtons &&
            customButtons.map((button, index) => (
              <React.Fragment key={index}>{button}</React.Fragment>
            ))}

          {showAddButton && (
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={onAddClick}
            >
              <PlusCircle className="h-4 w-4" />
              {buttonTitle}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-7">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-7 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-8"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-4 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tanstackColumns.length}
                  className="text-center h-16"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-end mt-4">
          {renderPageNumbers(currentPage, totalPages, handlePageChange)}
        </div>
      )}
    </div>
  );
}
