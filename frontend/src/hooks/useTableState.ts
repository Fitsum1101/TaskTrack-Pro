// hooks/useTableState.ts
import { useCallback, useState, useEffect } from "react";
import { useUrlState } from "./useUrlState";
import { useDebounce } from "./use-debounce";
import { UseTableStateProps, UseTableStateReturn } from "@/types/table";

// Define specific filter value types
type FilterValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | Array<string | number | boolean | null | undefined | object>;
type Filters = Record<string, FilterValue>;
type UrlUpdates = Record<string, string | number | undefined>;

export function useTableState({
  defaultPage = 1,
  defaultLimit = 10,
  defaultSearch = "",
  defaultSortBy = "createdAt",
  defaultSortOrder = "desc",
  defaultFilters = {},
  debounceDelay = 500,
}: UseTableStateProps = {}): UseTableStateReturn {
  const { updateUrl, getParam, getNumericParam } = useUrlState();

  // Get initial state from URL
  const initialPage = getNumericParam("page", defaultPage);
  const initialLimit = getNumericParam("limit", defaultLimit);
  const urlSearch = getParam("search", defaultSearch);
  const initialSearch = urlSearch !== undefined ? urlSearch : defaultSearch;
  const initialSortBy = getParam("sortBy", defaultSortBy);
  const initialSortOrder =
    (getParam("sortOrder", defaultSortOrder) as "asc" | "desc") ||
    defaultSortOrder;

  // Parse filters from URL
  const parseUrlFilters = (): Filters => {
    const filters: Filters = {};

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);

      searchParams.forEach((value, key) => {
        // Skip pagination, search, and sorting params
        if (!["page", "limit", "search", "sortBy", "sortOrder"].includes(key)) {
          try {
            // Try to parse JSON for complex objects, otherwise use as string
            filters[key] = JSON.parse(value);
          } catch {
            filters[key] = value;
          }
        }
      });
    }

    return { ...defaultFilters, ...filters };
  };

  // Local state
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>(initialSortBy ?? defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [filters, setFilters] = useState<Filters>(parseUrlFilters);

  const debouncedSearch = useDebounce(search, debounceDelay);

  // Sync state with URL
  useEffect(() => {
    const urlUpdates: UrlUpdates = {
      page: page > 1 ? page : undefined,
      limit: limit !== defaultLimit ? limit : undefined,
      search: debouncedSearch || undefined,
      sortBy: sortBy !== defaultSortBy ? sortBy : undefined,
      sortOrder: sortOrder !== defaultSortOrder ? sortOrder : undefined,
    };

    // Add filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlUpdates[key] =
          typeof value === "object" ? JSON.stringify(value) : value.toString();
      } else {
        urlUpdates[key] = undefined;
      }
    });

    updateUrl(urlUpdates);
  }, [
    page,
    limit,
    debouncedSearch,
    sortBy,
    sortOrder,
    filters,
    defaultLimit,
    defaultSortBy,
    defaultSortOrder,
    updateUrl,
  ]);

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleSortChange = useCallback(
    (newSortBy: string, newSortOrder: "asc" | "desc") => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setPage(1);
    },
    [],
  );

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setPage(1);
  }, []);

  const getQueryParams = useCallback((): Record<string, FilterValue> => {
    const params: Record<string, FilterValue> = {
      page,
      limit,
      sortBy,
      sortOrder,
      ...filters,
    };

    if (debouncedSearch && debouncedSearch.trim() !== "") {
      params.search = debouncedSearch;
    }

    return params;
  }, [page, limit, debouncedSearch, sortBy, sortOrder, filters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(defaultPage);
  }, [defaultFilters, defaultPage]);

  const resetAll = useCallback(() => {
    setPage(defaultPage);
    setLimit(defaultLimit);
    setSearch(defaultSearch);
    setSortBy(defaultSortBy);
    setSortOrder(defaultSortOrder);
    setFilters(defaultFilters);
  }, [
    defaultPage,
    defaultLimit,
    defaultSearch,
    defaultSortBy,
    defaultSortOrder,
    defaultFilters,
  ]);

  return {
    // State
    page,
    limit,
    search,
    debouncedSearch,
    sortBy,
    sortOrder,
    filters,

    // Handlers
    handlePageChange,
    handleSearch,
    handleLimitChange,
    handleSortChange,
    handleFilterChange,
    setFilter,
    removeFilter,

    // Utilities
    getQueryParams,
    resetFilters,
    resetAll,
  };
}
