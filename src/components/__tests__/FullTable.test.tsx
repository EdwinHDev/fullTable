import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FullTable, { AvatarShape } from '../FullTable';
import { Badge } from '@/components/ui/badge';
import '@testing-library/jest-dom';

describe('FullTable Component', () => {
  const mockData = [
    { id: 1, name: "John", status: "active", role: "admin", avatar: "https://example.com/1.jpg" },
    { id: 2, name: "Jane", status: "inactive", role: "user", avatar: "https://example.com/2.jpg" },
    { id: 3, name: "Bob", status: "active", role: "user", avatar: "https://example.com/3.jpg" },
  ];

  const mockColumns = [
    { 
      key: "avatar", 
      label: "Avatar", 
      type: "image" as const,
      className: "w-[64px]",
      imageProps: {
        width: 40,
        height: 40,
        className: "border border-gray-200",
        fallback: "/default-avatar.jpeg",
        shape: "rounded" as AvatarShape
      }
    },
    { key: "name", label: "Nombre", type: "text" as const },
    { 
      key: "status", 
      label: "Estado",
      type: "text" as const,
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "danger"}>
          {value === "active" ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    { 
      key: "role", 
      label: "Rol",
      type: "text" as const,
      render: (value: string) => (
        <Badge variant={value === "admin" ? "default" : "outline"}>
          {value === "admin" ? "Administrador" : "Usuario"}
        </Badge>
      )
    }
  ];

  const mockActions = [
    {
      label: "Ver",
      onClick: vi.fn(),
      show: (_: any, selectedCount: number) => selectedCount <= 1
    },
    {
      label: "Editar",
      onClick: vi.fn(),
      show: (_: any, selectedCount: number) => selectedCount <= 1
    },
    {
      label: "Eliminar",
      onClick: vi.fn()
    },
  ];

  beforeEach(() => {
    mockActions.forEach(action => {
      if (action.onClick) {
        action.onClick.mockClear();
      }
    });
  });

  it('renders all columns and data correctly', () => {
    render(
      <FullTable
        data={mockData}
        columns={mockColumns}
        actions={mockActions}
        selectable={true}
      />
    );

    // Verificar que se muestran todas las columnas
    mockColumns.forEach(column => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });

    // Verificar que se muestran todos los datos
    mockData.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('handles row selection correctly', async () => {
    const { container } = render(
      <FullTable
        data={mockData}
        columns={mockColumns}
        actions={mockActions}
        selectable={true}
      />
    );

    // Seleccionar la primera fila
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    const firstRowCheckbox = checkboxes[1]; // El primer checkbox es el "select all"
    await userEvent.click(firstRowCheckbox);

    // Verificar que se muestra el contador de selección
    const selectedCount = screen.getByText(/1 elemento/i);
    expect(selectedCount).toBeInTheDocument();
  });

  it('handles bulk actions correctly', async () => {
    const { container } = render(
      <FullTable
        data={mockData}
        columns={mockColumns}
        actions={mockActions}
        selectable={true}
      />
    );

    // Seleccionar todas las filas
    const selectAllCheckbox = container.querySelector('[role="checkbox"]');
    await userEvent.click(selectAllCheckbox!);

    // Verificar que las acciones "Ver" y "Editar" están ocultas
    expect(screen.queryByText('Ver')).not.toBeInTheDocument();
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();

    // Encontrar y ejecutar la acción de eliminar
    const deleteButtons = screen.getAllByText('Eliminar');
    // Usamos el primer botón de eliminar que encontremos
    await userEvent.click(deleteButtons[0]);

    // Verificar que se llamó a la función con todos los elementos seleccionados
    const selectedItems = mockData;
    expect(mockActions[2].onClick).toHaveBeenCalledWith(selectedItems);
  });

  it('handles sorting correctly', async () => {
    render(
      <FullTable
        data={mockData}
        columns={mockColumns}
        actions={mockActions}
        selectable={true}
      />
    );

    // Hacer clic en el encabezado de nombre para ordenar
    const nameHeader = screen.getByText('Nombre');
    await userEvent.click(nameHeader);

    // Verificar que los nombres están ordenados alfabéticamente
    const rows = screen.getAllByRole('row');
    const firstRowName = within(rows[1]).getByText('Bob');
    const lastRowName = within(rows[3]).getByText('John');
    
    expect(firstRowName).toBeInTheDocument();
    expect(lastRowName).toBeInTheDocument();
  });

  it('handles search correctly', async () => {
    render(
      <FullTable
        data={mockData}
        columns={mockColumns}
        actions={mockActions}
        selectable={true}
      />
    );

    // Buscar "John"
    const searchInput = screen.getByPlaceholderText('Buscar');
    await userEvent.type(searchInput, 'John');

    // Verificar que solo se muestra John
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    const manyItems = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      status: "active",
      role: "user",
      avatar: `https://example.com/${i + 1}.jpg`
    }));

    render(
      <FullTable
        data={manyItems}
        columns={mockColumns}
        actions={mockActions}
        selectable={true}
        pageSize={10}
      />
    );

    // Verificar que se muestran 10 elementos en la primera página
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(11); // 10 filas + 1 encabezado

    // Ir a la siguiente página
    const nextButton = screen.getByRole('link', { name: /Go to next page/i });
    await userEvent.click(nextButton);

    // Verificar que se muestran los elementos restantes
    const newRows = screen.getAllByRole('row');
    expect(newRows.length).toBe(3); // 2 filas + 1 encabezado
  });
}); 