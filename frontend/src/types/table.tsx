export type ColumnDefinition<T> = {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
};

export type DataGridProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  title?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showColumnSelector?: boolean;
  showPagination?: boolean;
  showRowSelection?: boolean;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  onItemPerPageChange?: (i: number) => void;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  rowClickPath?: (row: T) => string;
  onRowSelectionChange?: (selectedRows: T[]) => void;
  onFilterClick?: () => void;
  showFilter?: boolean;
  onAddClick?: () => void;
  showAddButton?: boolean;
  buttonTitle?: string;
  showActions?: boolean; // Added showActions prop
  onView?: (row: T) => void; // Added onView prop
  onEdit?: (row: T) => void; // Added onEdit prop
  onDelete?: (row: T) => void; // Added onDelete prop
  customButtons?: React.ReactNode[]; // custom button on the top of the table
  onSortChange?: (sort: { id: string; desc: boolean } | null) => void; // Add this new prop
  initialSort?: { id: string; desc: boolean } | null; // Add this for initial sort state
  initialSearchValue?: string;
  showItemsPerPage?: boolean;
};

// types/table.ts
export type FilterValue = string | number | boolean | null | undefined | object | Array<string | number | boolean | null | undefined | object>;
export type Filters = Record<string, FilterValue>;

export interface UseTableStateProps {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSearch?: string;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  defaultFilters?: Filters;
  debounceDelay?: number;
}

export interface UseTableStateReturn {
  // Pagination
  page: number;
  limit: number;
  
  // Search
  search: string;
  debouncedSearch: string;
  
  // Sorting
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Additional filters
  filters: Filters;
  
  // Handlers
  handlePageChange: (newPage: number) => void;
  handleSearch: (searchTerm: string) => void;
  handleLimitChange: (newLimit: number) => void;
  handleSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  handleFilterChange: (filters: Filters) => void;
  setFilter: (key: string, value: FilterValue) => void;
  removeFilter: (key: string) => void;
  
  // Utilities
  getQueryParams: () => Record<string, FilterValue>;
  resetFilters: () => void;
  resetAll: () => void;
}

