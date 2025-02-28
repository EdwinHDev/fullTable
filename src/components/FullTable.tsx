"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Check, CheckCheck, Search, Eye, Pencil, Trash2, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
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

// Tipos para las columnas y filtros
export type AvatarShape = 'circle' | 'square' | 'rounded';

export interface ImageProps {
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  shape?: AvatarShape;
}

export interface TableColumn {
  key: string;
  label: string;
  visible?: boolean;
  type?: 'text' | 'image';
  imageProps?: ImageProps;
  className?: string;
  render?: (value: any) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableFilter {
  key: string;
  label: string;
  options: FilterOption[];
}

// Tipo para los tamaños de página permitidos
export type PageSize = 5 | 10 | 20 | 50 | 100;

// Constante con los tamaños de página disponibles
export const PAGE_SIZES: PageSize[] = [5, 10, 20, 50, 100];

// Tipos para las acciones
export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T | T[]) => void;
  show?: (item: T, selectedCount: number) => boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface FullTableProps<T> {
  data: T[];
  columns: TableColumn[];
  filters?: TableFilter[];
  actions?: TableAction<T>[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: PageSize) => void;
  pageSize?: PageSize;
  actionsMode?: 'inline' | 'dropdown'; // Nueva prop para controlar el modo de las acciones
  selectable?: boolean;
}

const FullTable = <T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  actions = [],
  onPageChange,
  onPageSizeChange,
  pageSize = 10,
  actionsMode = 'inline',
  selectable = false,
}: FullTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter(col => col.visible !== false).map(col => col.key)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState<PageSize>(
    PAGE_SIZES.includes(pageSize as PageSize) ? pageSize as PageSize : 10
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });
  const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

  // Función para filtrar los datos según los filtros seleccionados
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Aplicar filtros
      const passesFilters = Object.entries(selectedFilters).every(([filterKey, selectedValues]) => {
        if (selectedValues.length === 0) return true;
        return selectedValues.includes(String(item[filterKey]));
      });

      // Aplicar búsqueda
      const passesSearch = searchTerm === "" || Object.entries(item).some(([key, value]) => {
        if (!visibleColumns.includes(key)) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      return passesFilters && passesSearch;
    });
  }, [data, selectedFilters, searchTerm, visibleColumns]);

  // Función para manejar el ordenamiento
  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: 
        current.key === key
          ? current.direction === 'asc'
            ? 'desc'
            : current.direction === 'desc'
              ? null
              : 'asc'
          : 'asc'
    }));
  };

  // Función para obtener el ícono de ordenamiento
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />;
    if (sortConfig.direction === 'asc') return <ArrowUp className="w-3 h-3 ml-1 opacity-70" />;
    if (sortConfig.direction === 'desc') return <ArrowDown className="w-3 h-3 ml-1 opacity-70" />;
    return <ArrowUpDown className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />;
  };

  // Aplicar ordenamiento a los datos filtrados
  const sortedAndFilteredData = useMemo(() => {
    let sorted = [...filteredData];
    
    if (sortConfig.key && sortConfig.direction) {
      sorted.sort((a, b) => {
        const aValue = String(a[sortConfig.key]).toLowerCase();
        const bValue = String(b[sortConfig.key]).toLowerCase();
        
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }
    
    return sorted;
  }, [filteredData, sortConfig]);

  const totalRecords = sortedAndFilteredData.length;
  const totalPages = Math.ceil(totalRecords / currentPageSize);

  // Obtener los datos paginados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;
    return sortedAndFilteredData.slice(start, end);
  }, [sortedAndFilteredData, currentPage, currentPageSize]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a la primera página cuando se busca
  };

  const toggleFilter = (filterKey: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      const newFilters = {
        ...prev,
        [filterKey]: updated
      };
      
      return newFilters;
    });
    setCurrentPage(1); // Resetear a la primera página cuando se filtra
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value) as PageSize;
    setCurrentPageSize(newSize);
    setCurrentPage(1); // Resetear a la primera página cuando se cambia el tamaño
    onPageSizeChange?.(newSize);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // Función para manejar la selección de todas las filas en la página actual
  const handleSelectAllInPage = (checked: boolean) => {
    const newSelectedRows = { ...selectedRows };
    paginatedData.forEach(row => {
      newSelectedRows[row.id] = checked;
    });
    setSelectedRows(newSelectedRows);
  };

  // Función para manejar la selección individual
  const handleSelectRow = (id: string | number, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  // Verificar si todas las filas de la página actual están seleccionadas
  const isAllInPageSelected = useMemo(() => {
    return paginatedData.every(row => selectedRows[row.id]);
  }, [paginatedData, selectedRows]);

  // Obtener todas las filas seleccionadas
  const selectedItems = useMemo(() => {
    return data.filter(row => selectedRows[row.id]);
  }, [data, selectedRows]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Input 
            type="text" 
            placeholder="Buscar" 
            className="w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {selectedItems.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedItems.length} elementos seleccionados
            </span>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {filters.map((filter) => (
            <Popover key={filter.key}>
              <PopoverTrigger className="flex items-center text-sm text-gray-500 border border-gray-200 rounded-md px-3 py-2 h-9">
                {filter.label}
              </PopoverTrigger>
              <PopoverContent>
                {filter.options.map((option) => (
                  <div key={option.value}>
                    <div 
                      className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2"
                      onClick={() => toggleFilter(filter.key, option.value)}
                    >
                      <span>{option.label}</span>
                      {selectedFilters[filter.key]?.includes(option.value) && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                    <Separator />
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          ))}
          <Popover>
            <PopoverTrigger className="flex items-center text-sm text-gray-500 border border-gray-200 rounded-md px-3 py-2 h-9">
              Columnas
            </PopoverTrigger>
            <PopoverContent>
              {columns.map((column) => (
                <div key={column.key}>
                  <div 
                    className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2"
                    onClick={() => toggleColumn(column.key)}
                  >
                    <span>{column.label}</span>
                    {visibleColumns.includes(column.key) && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                  <Separator />
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">
          Total de registros: {totalRecords}
        </span>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">Celda por página</span>
          <Select onValueChange={handlePageSizeChange} defaultValue={String(currentPageSize)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllInPageSelected}
                  onCheckedChange={handleSelectAllInPage}
                />
              </TableHead>
            )}
            {columns
              .filter(col => visibleColumns.includes(col.key))
              .map(column => (
                <TableHead 
                  key={column.key} 
                  className={cn(
                    "cursor-pointer select-none group hover:bg-gray-50/50 transition-colors",
                    column.className
                  )}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            {actions.length > 0 && (
              <TableHead className="text-right">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow key={index} className={selectedRows[row.id] ? "bg-gray-50/50" : ""}>
              {selectable && (
                <TableCell className="w-[50px]">
                  <Checkbox
                    checked={selectedRows[row.id] || false}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                  />
                </TableCell>
              )}
              {columns
                .filter(col => visibleColumns.includes(col.key))
                .map(column => (
                  <TableCell key={column.key} className={column.className}>
                    {column.type === 'image' ? (
                      <div className="flex items-center justify-center">
                        {row[column.key] ? (
                          <img
                            src={row[column.key]}
                            alt={`${column.label}`}
                            width={column.imageProps?.width || 40}
                            height={column.imageProps?.height || 40}
                            className={`object-cover ${
                              column.imageProps?.shape === 'circle' ? 'rounded-full' :
                              column.imageProps?.shape === 'rounded' ? 'rounded-lg' :
                              ''
                            } ${column.imageProps?.className || ''}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (column.imageProps?.fallback) {
                                target.src = column.imageProps.fallback;
                              }
                            }}
                          />
                        ) : (
                          column.imageProps?.fallback && (
                            <img
                              src={column.imageProps.fallback}
                              alt={`${column.label} fallback`}
                              width={column.imageProps.width || 40}
                              height={column.imageProps.height || 40}
                              className={`object-cover ${
                                column.imageProps.shape === 'circle' ? 'rounded-full' :
                                column.imageProps.shape === 'rounded' ? 'rounded-lg' :
                                ''
                              } ${column.imageProps.className || ''}`}
                            />
                          )
                        )}
                      </div>
                    ) : column.render ? (
                      column.render(row[column.key])
                    ) : (
                      row[column.key]
                    )}
                  </TableCell>
                ))}
              {actions.length > 0 && (
                <TableCell className="text-right space-x-2 whitespace-nowrap">
                  {actionsMode === 'dropdown' ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions
                          .filter(action => {
                            if (!action.show) return true;
                            try {
                              return action.show(row, Object.keys(selectedRows).filter(key => selectedRows[key]).length);
                            } catch (error) {
                              console.error('Error evaluating show condition:', error);
                              return true;
                            }
                          })
                          .map((action, actionIndex) => {
                            const itemsToProcess = selectedItems.length > 0 ? selectedItems : [row];
                            return (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(itemsToProcess.length === 1 ? itemsToProcess[0] : itemsToProcess);
                                }}
                              >
                                {action.icon && (
                                  <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                                {selectedItems.length > 0 && ` (${selectedItems.length})`}
                              </DropdownMenuItem>
                            );
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    actions
                      .filter(action => {
                        if (!action.show) return true;
                        try {
                          return action.show(row, Object.keys(selectedRows).filter(key => selectedRows[key]).length);
                        } catch (error) {
                          console.error('Error evaluating show condition:', error);
                          return true;
                        }
                      })
                      .map((action, actionIndex) => {
                        const itemsToProcess = selectedItems.length > 0 ? selectedItems : [row];
                        return (
                          <Button
                            key={actionIndex}
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(itemsToProcess.length === 1 ? itemsToProcess[0] : itemsToProcess);
                            }}
                            className="h-8 w-8"
                            title={`${action.label}${selectedItems.length > 0 ? ` (${selectedItems.length})` : ''}`}
                          >
                            {action.icon}
                            <span className="sr-only">{action.label}</span>
                          </Button>
                        );
                      })
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {(() => {
              const pages: (number | 'ellipsis')[] = [];
              let lastAddedPage: number | null = null;

              // Función para añadir página o puntos suspensivos
              const addToPages = (page: number | 'ellipsis') => {
                if (page === 'ellipsis' && pages[pages.length - 1] === 'ellipsis') {
                  return;
                }
                if (typeof page === 'number' && lastAddedPage === page) {
                  return;
                }
                if (typeof page === 'number') {
                  lastAddedPage = page;
                }
                pages.push(page);
              };

              // Siempre mostrar la primera página
              addToPages(1);

              // Lógica para páginas intermedias
              for (let i = 2; i <= totalPages - 1; i++) {
                if (
                  i === currentPage || // Página actual
                  i === currentPage - 1 || // Página anterior
                  i === currentPage + 1 || // Página siguiente
                  i === 2 || // Segunda página
                  i === totalPages - 1 // Penúltima página
                ) {
                  addToPages(i);
                } else if (
                  lastAddedPage && 
                  typeof lastAddedPage === 'number' && 
                  i > lastAddedPage + 1
                ) {
                  addToPages('ellipsis');
                }
              }

              // Siempre mostrar la última página si hay más de una página
              if (totalPages > 1) {
                addToPages(totalPages);
              }

              return pages.map((page, index) => 
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })()}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default FullTable;