import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FullTable, { Column, TableRecord } from '../ui/FullTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import '@testing-library/jest-dom';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

interface TestRecord extends TableRecord {
  name: string;
  status: "active" | "inactive";
  role: "admin" | "user";
  avatar: string;
  [key: string]: string | number;
}

describe('FullTable Component', () => {
  const mockData: TestRecord[] = [
    { id: 1, name: "John", status: "active", role: "admin", avatar: "https://example.com/1.jpg" },
    { id: 2, name: "Jane", status: "inactive", role: "user", avatar: "https://example.com/2.jpg" },
    { id: 3, name: "Bob", status: "active", role: "user", avatar: "https://example.com/3.jpg" },
  ];

  const mockColumns: Column<TestRecord>[] = [
    { 
      header: "Avatar",
      key: "avatar",
      className: "w-[64px]",
      render: (value, row) => (
        <Avatar>
          <AvatarImage src={row.avatar} />
          <AvatarFallback>{ row.name.split(" ")[0][0] }</AvatarFallback>
        </Avatar>
      )
    },
    { 
      header: "Nombre",
      key: "name",
      sortable: true
    },
    { 
      header: "Estado",
      key: "status",
      filterable: true,
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    { 
      header: "Rol",
      key: "role",
      className: "w-[100px]",
      filterable: true,
      render: (value) => (
        <Badge variant={value === "admin" ? "default" : "secondary"}>
          {value === "admin" ? "Administrador" : "Usuario"}
        </Badge>
      )
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all columns and data correctly', () => {
    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
      />
    );

    // Verificar que se muestran todas las columnas
    mockColumns.forEach(column => {
      if (typeof column.header === 'string') {
        expect(screen.getByText(column.header)).toBeInTheDocument();
      }
    });

    // Verificar que se muestran todos los datos
    mockData.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('handles row selection correctly', async () => {
    const handleSelectionChange = vi.fn();
    const { container } = render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        enableSelection={true}
        onSelectionChange={handleSelectionChange}
      />
    );

    // Seleccionar la primera fila
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    const firstRowCheckbox = checkboxes[1]; // El primer checkbox es el "select all"
    await userEvent.click(firstRowCheckbox);

    // Verificar que se llamó al callback con el ID correcto
    expect(handleSelectionChange).toHaveBeenCalledWith([1]);
  });

  it('handles sorting correctly', async () => {
    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        enableSorting={true}
      />
    );

    // Hacer clic en el encabezado de nombre para ordenar
    const nameHeader = screen.getByText('Nombre');
    await userEvent.click(nameHeader);

    // Verificar que los nombres están ordenados alfabéticamente (asc)
    const rows = screen.getAllByRole('row');
    const firstRowName = within(rows[1]).getByText('Bob');
    const lastRowName = within(rows[3]).getByText('John');
    
    expect(firstRowName).toBeInTheDocument();
    expect(lastRowName).toBeInTheDocument();

    // Hacer clic nuevamente para ordenar desc
    await userEvent.click(nameHeader);

    const rowsDesc = screen.getAllByRole('row');
    const firstRowNameDesc = within(rowsDesc[1]).getByText('John');
    const lastRowNameDesc = within(rowsDesc[3]).getByText('Bob');
    
    expect(firstRowNameDesc).toBeInTheDocument();
    expect(lastRowNameDesc).toBeInTheDocument();
  });

  it('handles search correctly', async () => {
    const searchPlaceholder = "Buscar cliente";
    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        enableSearch={true}
        searchPlaceholder={searchPlaceholder}
      />
    );

    // Buscar "John"
    const searchInput = screen.getByPlaceholderText(searchPlaceholder);
    await userEvent.type(searchInput, 'John');

    // Verificar que solo se muestra John
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    const manyItems: TestRecord[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      status: "active",
      role: "user",
      avatar: `https://example.com/${i + 1}.jpg`
    }));

    render(
      <FullTable<TestRecord>
        data={manyItems}
        columns={mockColumns}
        enablePagination={true}
        defaultPageSize={10}
      />
    );

    // Verificar que se muestran 10 elementos en la primera página
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(11); // 10 filas + 1 encabezado

    // Ir a la siguiente página
    const nextButton = screen.getByLabelText('Go to next page');
    await userEvent.click(nextButton);

    // Verificar que se muestran los elementos restantes
    const newRows = screen.getAllByRole('row');
    expect(newRows.length).toBe(3); // 2 filas + 1 encabezado
  });

  it('respects initial column visibility', () => {
    const columnsWithHidden: Column<TestRecord>[] = [
      ...mockColumns,
      { 
        header: "Hidden Column",
        key: "id",
        visible: false
      }
    ];

    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={columnsWithHidden}
      />
    );

    // Verificar que la columna oculta no está presente
    expect(screen.queryByText('Hidden Column')).not.toBeInTheDocument();
  });

  it('applies sticky header styles correctly', () => {
    const { container } = render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        enableStickyHeader={true}
      />
    );

    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('sticky', 'top-0', 'z-10', 'shadow-sm');
  });

  it('handles responsive layout correctly', () => {
    const { container } = render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        enablePagination={true}
        showRowCount={true}
      />
    );

    // Verificar el contenedor de paginación
    const paginationContainer = container.querySelector('.flex.flex-col.items-center.gap-4');
    expect(paginationContainer).toBeInTheDocument();

    // En modo desktop (por defecto)
    expect(paginationContainer).toHaveClass('flex-row', 'items-center', 'justify-between');
  });

  it('handles column toggle menu correctly', async () => {
    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        enableColumnToggle={true}
      />
    );

    // Abrir el menú de columnas
    const toggleButton = screen.getByRole('button', { name: /Columnas/i });
    await userEvent.click(toggleButton);

    // Verificar que todas las columnas están listadas
    mockColumns.forEach(column => {
      if (typeof column.header === 'string') {
        expect(screen.getByRole('menuitemcheckbox', { name: column.header })).toBeInTheDocument();
      }
    });

    // Toggle una columna
    const firstColumnToggle = screen.getByRole('menuitemcheckbox', { name: mockColumns[0].header as string });
    await userEvent.click(firstColumnToggle);

    // Verificar que la columna se ocultó
    expect(screen.queryByRole('columnheader', { name: mockColumns[0].header as string })).not.toBeInTheDocument();
  });

  it('handles empty state correctly', () => {
    const emptyMessage = "No hay datos disponibles";
    render(
      <FullTable<TestRecord>
        data={[]}
        columns={mockColumns}
        emptyMessage={emptyMessage}
      />
    );

    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        isLoading={true}
      />
    );

    // Verificar que se muestra el loader
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('animate-spin');
  });

  it('handles row count display correctly', () => {
    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        showRowCount={true}
      />
    );

    expect(screen.getByText(`${mockData.length} filas en total`)).toBeInTheDocument();
  });

  it('handles striped rows correctly', () => {
    const { container } = render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
        enableStriped={true}
      />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).not.toHaveClass('bg-primary/10');
    expect(rows[1]).toHaveClass('bg-primary/10');
  });

  it('handles filterable columns correctly', async () => {
    render(
      <FullTable<TestRecord>
        data={mockData}
        columns={mockColumns}
      />
    );

    // Verificar que los botones de filtro están presentes
    const statusButton = screen.getByRole('button', { name: /Estado/i });
    const roleButton = screen.getByRole('button', { name: /Rol/i });

    expect(statusButton).toBeInTheDocument();
    expect(roleButton).toBeInTheDocument();

    // Probar el filtro de estado
    await userEvent.click(statusButton);
    const activeCheckbox = screen.getByRole('menuitemcheckbox', { name: /Activo/i });
    await userEvent.click(activeCheckbox);

    // Verificar que solo se muestran los usuarios activos
    expect(screen.getAllByText(/Activo/i)).toHaveLength(2);
  });
}); 