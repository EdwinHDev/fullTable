"use client"

import { ReactNode, useState, useMemo, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown, Loader2, Search, Columns, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export type TableValue = string | number | boolean | null

export type SortDirection = "asc" | "desc" | null

export type TableSize = "sm" | "md" | "lg"

export interface Column<T> {
  header: string | ReactNode
  key: keyof T
  className?: string
  render?: (value: T[keyof T], row: T) => ReactNode
  sortable?: boolean
  visible?: boolean
  filterable?: boolean
}

export type TableRecord = {
  id: string | number
  [key: string]: TableValue | string
}

export interface FullTableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
  enableSorting?: boolean
  enableSelection?: boolean
  enableStriped?: boolean
  enableStickyHeader?: boolean
  isLoading?: boolean
  emptyMessage?: string | ReactNode
  size?: TableSize
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  enablePagination?: boolean
  defaultPageSize?: 5 | 10 | 20 | 50 | 100
  enableSearch?: boolean
  enableColumnToggle?: boolean
  searchPlaceholder?: string
  showRowCount?: boolean
}

const MAX_DROPDOWN_OPTIONS = 10;

const useContainerWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1024); // Inicializar con un valor de escritorio por defecto

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        setWidth(newWidth);
      }
    };

    // Actualizar el ancho inicial después del montaje
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return { containerRef, width };
};

const FullTable = <T extends TableRecord>({ 
  columns,
  data,
  className,
  enableSorting = false,
  enableSelection = false,
  enableStriped = false,
  enableStickyHeader = false,
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  size = "md",
  onSelectionChange,
  enablePagination = false,
  defaultPageSize = 10,
  enableSearch = false,
  enableColumnToggle = false,
  searchPlaceholder = "Buscar...",
  showRowCount = false
}: FullTableProps<T>) => {
  const { containerRef, width } = useContainerWidth();
  const isCompact = width < 1024; // Cambiar a 1024px para desktop
  const isMobile = width < 768; // Cambiar a 768px para tablet/móvil

  const [sortConfig, setSortConfig] = useState<{
    column: keyof T | undefined;
    direction: "asc" | "desc";
  }>({
    column: undefined,
    direction: "asc"
  });

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.filter(col => col.visible !== false).map(col => col.key))
  );

  const [filters, setFilters] = useState<Record<keyof T, Set<string>>>(
    columns.reduce((acc, col) => {
      if (col.filterable) {
        acc[col.key] = new Set<string>();
      }
      return acc;
    }, {} as Record<keyof T, Set<string>>)
  );

  const [filterSearch, setFilterSearch] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

  const filterOptions = useMemo(() => {
    return columns.reduce((acc, col) => {
      if (col.filterable) {
        acc[col.key] = new Set(
          data.map(item => String(item[col.key]))
        );
      }
      return acc;
    }, {} as Record<keyof T, Set<string>>);
  }, [columns, data]);

  const handleSort = (column: keyof T) => {
    setSortConfig({
      column,
      direction: column === sortConfig.column ? (sortConfig.direction === "asc" ? "desc" : "asc") : "asc"
    });
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set<string | number>();
    if (checked) {
      sortedData.forEach(row => {
        if ('id' in row) newSelected.add(row.id);
      });
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const toggleColumnVisibility = (columnKey: keyof T) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnKey)) {
      newVisibleColumns.delete(columnKey);
    } else {
      newVisibleColumns.add(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const toggleFilter = (column: keyof T, value: string) => {
    const newFilters = new Set(filters[column]);
    if (newFilters.has(value)) {
      newFilters.delete(value);
    } else {
      newFilters.add(value);
    }
    setFilters(prev => ({
      ...prev,
      [column]: newFilters
    }));
  };

  const filteredColumns = useMemo(() => {
    return columns.filter(column => visibleColumns.has(column.key));
  }, [columns, visibleColumns]);

  const filteredData = useMemo(() => {
    if (!searchQuery && Object.values(filters).every(set => set.size === 0)) return data;

    let result = data;

    // Aplicar filtros de columna
    Object.entries(filters).forEach(([key, values]) => {
      if (values.size > 0) {
        result = result.filter(item => values.has(String(item[key as keyof T])));
      }
    });

    // Aplicar búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        return Object.entries(item).some(([key, value]) => {
          if (key === "id") return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    return result;
  }, [data, searchQuery, filters]);

  const sortedData = useMemo(() => {
    if (!enableSorting || !sortConfig.column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = String(a[sortConfig.column!]);
      const bValue = String(b[sortConfig.column!]);

      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [filteredData, sortConfig, enableSorting]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, enablePagination, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (!enablePagination) return 0;
    return Math.ceil(sortedData.length / pageSize);
  }, [enablePagination, sortedData.length, pageSize]);

  const allSelected = paginatedData.length > 0 && paginatedData.every(row => 'id' in row && selectedRows.has(row.id));
  const someSelected = paginatedData.some(row => 'id' in row && selectedRows.has(row.id));

  const sizeStyles = {
    sm: {
      cell: "h-8 px-3 py-2",
      checkbox: "h-8 w-[50px] px-3"
    },
    md: {
      cell: "h-12 px-4 py-3",
      checkbox: "h-12 w-[50px] px-4"
    },
    lg: {
      cell: "h-16 px-6 py-4",
      checkbox: "h-16 w-[50px] px-6"
    }
  }

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value) as typeof defaultPageSize
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-md border",
        className
      )}>
        <div className={cn(
          "relative",
          enableStickyHeader && "max-h-[600px] overflow-auto"
        )}>
          <table className="w-full caption-bottom text-sm">
            <thead className={cn(
              "bg-background",
              enableStickyHeader && "sticky top-0 z-10 shadow-sm"
            )}>
              <tr className="border-b transition-colors hover:bg-muted/50">
                {enableSelection && (
                  <th className={cn(
                    "text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
                    sizeStyles[size].checkbox
                  )} />
                )}
                {filteredColumns.map((column, index) => (
                  <th 
                    key={`${String(column.key)}-${index}`}
                    className={cn(
                      "text-left align-middle font-medium text-muted-foreground",
                      sizeStyles[size].cell,
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td 
                  colSpan={filteredColumns.length + (enableSelection ? 1 : 0)}
                  className="h-60"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className={cn(
        "rounded-md border",
        className
      )}>
        <div className={cn(
          "relative",
          enableStickyHeader && "max-h-[600px] overflow-auto"
        )}>
          <table className="w-full caption-bottom text-sm">
            <thead className={cn(
              "bg-background",
              enableStickyHeader && "sticky top-0 z-10 shadow-sm"
            )}>
              <tr className="border-b transition-colors hover:bg-muted/50">
                {enableSelection && (
                  <th className={cn(
                    "text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
                    sizeStyles[size].checkbox
                  )} />
                )}
                {filteredColumns.map((column, index) => (
                  <th 
                    key={`${String(column.key)}-${index}`}
                    className={cn(
                      "text-left align-middle font-medium text-muted-foreground",
                      sizeStyles[size].cell,
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td 
                  colSpan={filteredColumns.length + (enableSelection ? 1 : 0)}
                  className="h-60"
                >
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn(
      "rounded-md border",
      className
    )}>
      {(enableSearch || enablePagination || enableColumnToggle) && (
        <div className="p-4 border-b">
          <div className={cn(
            "flex flex-col items-stretch gap-4",
            !isCompact && "flex-row justify-end items-center"
          )}>
            <div className={cn(
              "flex flex-col w-full gap-4",
              !isMobile && "flex-row items-center",
              !isCompact && "w-auto mr-auto"
            )}>
              <div className={cn(
                "flex flex-row items-center gap-4 w-full",
                !isCompact && "w-auto"
              )}>
                {enableSearch && (
                  <div className={cn(
                    "relative flex-1",
                    !isCompact && "flex-none min-w-[200px] w-[300px]"
                  )}>
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-full"
                    />
                  </div>
                )}
                
                {/* Menú de controles para modo compacto */}
                {(enablePagination || columns.some(col => col.filterable) || enableColumnToggle) && (
                  <div className={cn(
                    "w-auto",
                    !isCompact && "hidden"
                  )}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 whitespace-nowrap">
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Controles
                          {Object.values(filters).some(set => set.size > 0) && (
                            <Badge variant="secondary" className="ml-2">
                              {Object.values(filters).reduce((acc, set) => acc + set.size, 0)}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[280px]">
                        {enablePagination && (
                          <>
                            <DropdownMenuLabel>Filas por página</DropdownMenuLabel>
                            <div className="px-2 py-1.5">
                              <Select
                                value={String(pageSize)}
                                onValueChange={handlePageSizeChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Filas por página" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5 por página</SelectItem>
                                  <SelectItem value="10">10 por página</SelectItem>
                                  <SelectItem value="20">20 por página</SelectItem>
                                  <SelectItem value="50">50 por página</SelectItem>
                                  <SelectItem value="100">100 por página</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        
                        <div className="flex flex-col">
                          {columns.map(column => {
                            if (!column.filterable) return null;
                            const options = filterOptions[column.key];
                            if (!options?.size) return null;
                            
                            const optionsArray = Array.from(options);
                            const useDialog = optionsArray.length > MAX_DROPDOWN_OPTIONS;
                            
                            if (useDialog) {
                              return (
                                <div key={`dropdown-compact-${String(column.key)}`} className="w-full px-2 py-1.5">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full h-10 justify-between">
                                        <span>{typeof column.header === 'string' ? column.header : String(column.key)}</span>
                                        {filters[column.key].size > 0 && (
                                          <Badge variant="secondary">
                                            {filters[column.key].size}
                                          </Badge>
                                        )}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[400px]">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Filtrar por {typeof column.header === 'string' ? column.header.toLowerCase() : String(column.key)}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          placeholder="Buscar opciones..."
                                          value={filterSearch[column.key] || ''}
                                          onChange={(e) => setFilterSearch(prev => ({
                                            ...prev,
                                            [column.key]: e.target.value
                                          }))}
                                          className="pl-8"
                                        />
                                      </div>
                                      <ScrollArea className="h-[300px] pr-4">
                                        <div className="space-y-2">
                                          {optionsArray
                                            .filter(value => !filterSearch[column.key] || 
                                              value.toLowerCase().includes(filterSearch[column.key].toLowerCase()))
                                            .map((value) => (
                                              <div key={value} className="flex items-center space-x-2">
                                                <Checkbox
                                                  checked={filters[column.key].has(value)}
                                                  onCheckedChange={() => toggleFilter(column.key, value)}
                                                />
                                                <label className="text-sm">{value}</label>
                                              </div>
                                            ))}
                                        </div>
                                      </ScrollArea>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={`dropdown-compact-${String(column.key)}`} className="w-full px-2 py-1.5">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full h-10 justify-between">
                                      <span>{typeof column.header === 'string' ? column.header : String(column.key)}</span>
                                      {filters[column.key].size > 0 && (
                                        <Badge variant="secondary">
                                          {filters[column.key].size}
                                        </Badge>
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuLabel>Filtrar por {typeof column.header === 'string' ? column.header.toLowerCase() : String(column.key)}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {optionsArray.map((value) => (
                                      <DropdownMenuCheckboxItem
                                        key={value}
                                        checked={filters[column.key].has(value)}
                                        onCheckedChange={() => toggleFilter(column.key, value)}
                                      >
                                        {value}
                                      </DropdownMenuCheckboxItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            );
                          })}
                        </div>

                        {enableColumnToggle && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                            {columns.map((column, index) => (
                              <DropdownMenuCheckboxItem
                                key={`dropdown-compact-${String(column.key)}-${index}`}
                                checked={visibleColumns.has(column.key)}
                                onCheckedChange={() => toggleColumnVisibility(column.key)}
                              >
                                {typeof column.header === 'string' ? column.header : String(column.key)}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
            
            {/* Controles para modo normal */}
            <div className={cn(
              "hidden",
              !isCompact && "flex flex-row items-center gap-4"
            )}>
              {enablePagination && (
                <Select
                  value={String(pageSize)}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filas por página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 por página</SelectItem>
                    <SelectItem value="10">10 por página</SelectItem>
                    <SelectItem value="20">20 por página</SelectItem>
                    <SelectItem value="50">50 por página</SelectItem>
                    <SelectItem value="100">100 por página</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {columns.map(column => {
                if (!column.filterable) return null;
                const options = filterOptions[column.key];
                if (!options?.size) return null;
                
                const optionsArray = Array.from(options);
                const useDialog = optionsArray.length > MAX_DROPDOWN_OPTIONS;
                
                if (useDialog) {
                  return (
                    <Dialog key={`dropdown-normal-${String(column.key)}`}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10">
                          {typeof column.header === 'string' ? column.header : String(column.key)}
                          {filters[column.key].size > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {filters[column.key].size}
                            </Badge>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>
                            Filtrar por {typeof column.header === 'string' ? column.header.toLowerCase() : String(column.key)}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar opciones..."
                            value={filterSearch[column.key] || ''}
                            onChange={(e) => setFilterSearch(prev => ({
                              ...prev,
                              [column.key]: e.target.value
                            }))}
                            className="pl-8"
                          />
                        </div>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-2">
                            {optionsArray
                              .filter(value => !filterSearch[column.key] || 
                                value.toLowerCase().includes(filterSearch[column.key].toLowerCase()))
                              .map((value) => (
                                <div key={value} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={filters[column.key].has(value)}
                                    onCheckedChange={() => toggleFilter(column.key, value)}
                                  />
                                  <label className="text-sm">{value}</label>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  );
                }
                
                return (
                  <DropdownMenu key={`dropdown-normal-${String(column.key)}`}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10">
                        {typeof column.header === 'string' ? column.header : String(column.key)}
                        {filters[column.key].size > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {filters[column.key].size}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filtrar por {typeof column.header === 'string' ? column.header.toLowerCase() : String(column.key)}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {optionsArray.map((value) => (
                        <DropdownMenuCheckboxItem
                          key={value}
                          checked={filters[column.key].has(value)}
                          onCheckedChange={() => toggleFilter(column.key, value)}
                        >
                          {value}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
              {enableColumnToggle && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Columns className="mr-2 h-4 w-4" />
                      Columnas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columns.map((column, index) => (
                      <DropdownMenuCheckboxItem
                        key={`dropdown-normal-${String(column.key)}-${index}`}
                        checked={visibleColumns.has(column.key)}
                        onCheckedChange={() => toggleColumnVisibility(column.key)}
                      >
                        {typeof column.header === 'string' ? column.header : String(column.key)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "relative overflow-x-auto",
        enableStickyHeader && "max-h-[600px] overflow-y-auto"
      )}>
        <table className="w-full caption-bottom text-sm">
          <thead className={cn(
            "bg-background",
            enableStickyHeader && "sticky top-0 z-10 shadow-sm"
          )}>
            <tr className="border-b transition-colors hover:bg-muted/50">
              {enableSelection && (
                <th className={cn(
                  "text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
                  sizeStyles[size].checkbox
                )}>
                  <Checkbox 
                    checked={allSelected || someSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {filteredColumns.map((column, index) => (
                <th 
                  key={`header-${String(column.key)}-${index}`}
                  className={cn(
                    "text-left align-middle font-medium text-muted-foreground",
                    sizeStyles[size].cell,
                    column.className,
                    enableSorting && column.sortable && "cursor-pointer hover:text-foreground"
                  )}
                  onClick={() => enableSorting && column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {enableSorting && column.sortable && (
                      <div className="flex flex-col -space-y-2">
                        <ChevronUp 
                          className={cn(
                            "w-3 h-3 transition-colors",
                            sortConfig.column === column.key
                              ? sortConfig.direction === "asc"
                                ? "text-foreground"
                                : "text-muted-foreground/30"
                              : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
                          )}
                        />
                        <ChevronDown 
                          className={cn(
                            "w-3 h-3 transition-colors",
                            sortConfig.column === column.key
                              ? sortConfig.direction === "desc"
                                ? "text-foreground"
                                : "text-muted-foreground/30"
                              : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedData.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50",
                  enableStriped && rowIndex % 2 === 1 && "bg-primary/10"
                )}
              >
                {enableSelection && (
                  <td className={cn(
                    "align-middle [&:has([role=checkbox])]:pr-0",
                    sizeStyles[size].checkbox
                  )}>
                    <Checkbox 
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                    />
                  </td>
                )}
                {filteredColumns.map((column, colIndex) => (
                  <td 
                    key={`cell-${String(column.key)}-${rowIndex}-${colIndex}-${row.id}`}
                    className={cn(
                      "align-middle",
                      sizeStyles[size].cell,
                      column.className
                    )}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(enablePagination || showRowCount) && (
        <div className="py-4 px-2 border-t overflow-x-auto">
          <div className={cn(
            "flex flex-col items-center gap-4",
            !isMobile && "flex-row items-center",
            !isMobile && !showRowCount && "justify-end",
            !isMobile && showRowCount && "justify-between"
          )}>
            {showRowCount && (
              <div className={cn(
                "text-sm text-muted-foreground whitespace-nowrap text-center",
                isMobile ? "order-2" : ""
              )}>
                {enablePagination ? (
                  <>
                    Mostrando {paginatedData.length} de {sortedData.length} filas
                  </>
                ) : (
                  <>{sortedData.length} filas en total</>
                )}
              </div>
            )}
            {enablePagination && totalPages > 1 && (
              <div className={cn(
                "flex",
                isMobile ? "w-full justify-center" : "w-auto"
              )}>
                <Pagination>
                  <PaginationContent className="flex-wrap justify-center gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={cn(
                          currentPage === 1 && "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const shouldShow = 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(currentPage - page) <= 1;

                      if (!shouldShow) {
                        if (page === 2 || page === totalPages - 1) {
                          return (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className={cn(
                          currentPage === totalPages && "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FullTable