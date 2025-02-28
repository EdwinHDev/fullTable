This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# FullTable - Componente de Tabla Avanzada

Un componente de tabla React altamente personalizable con funcionalidades avanzadas como ordenamiento, filtrado, paginación, selección múltiple y acciones en lote.

## Características

- 🔍 Búsqueda global
- 🔄 Ordenamiento por columnas
- 📑 Paginación
- ✅ Selección múltiple de filas
- 🎯 Acciones individuales y en lote
- 📊 Filtros personalizables
- 👁️ Columnas ocultables
- 🖼️ Soporte para imágenes y avatares
- 🎨 Personalización de estilos
- 📱 Diseño responsivo

## Instalación

El componente requiere las siguientes dependencias:

```bash
npm install @radix-ui/react-checkbox @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
```

## Uso Básico

```tsx
import FullTable from "@/components/FullTable";

const MyComponent = () => {
  const data = [
    { id: 1, name: "John Doe", status: "active" },
    { id: 2, name: "Jane Smith", status: "inactive" }
  ];

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "status", label: "Estado" }
  ];

  return (
    <FullTable
      data={data}
      columns={columns}
      selectable={true}
    />
  );
};
```

## Props

### Propiedades Principales

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| data | `T[]` | Sí | Array de objetos con los datos a mostrar |
| columns | `TableColumn[]` | Sí | Configuración de las columnas |
| filters | `TableFilter[]` | No | Configuración de los filtros |
| actions | `TableAction<T>[]` | No | Acciones disponibles para cada fila |
| selectable | `boolean` | No | Habilita la selección múltiple |
| pageSize | `PageSize` | No | Cantidad de filas por página (5, 10, 20, 50, 100) |
| actionsMode | `'inline' \| 'dropdown'` | No | Modo de visualización de las acciones |

### Tipos de Datos

#### TableColumn

```typescript
interface TableColumn {
  key: string;              // Identificador único de la columna
  label: string;           // Texto a mostrar en el encabezado
  visible?: boolean;       // Si la columna es visible inicialmente
  type?: 'text' | 'image'; // Tipo de contenido
  imageProps?: ImageProps; // Configuración para columnas de tipo imagen
  className?: string;     // Clases CSS adicionales
  render?: (value: any) => React.ReactNode; // Función de renderizado personalizado
}
```

#### TableAction

```typescript
interface TableAction<T> {
  label: string;           // Texto de la acción
  icon?: React.ReactNode;  // Ícono de la acción
  onClick: (item: T | T[]) => void; // Manejador del click
  show?: (item: T, selectedCount: number) => boolean; // Control de visibilidad
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}
```

#### TableFilter

```typescript
interface TableFilter {
  key: string;           // Campo a filtrar
  label: string;         // Etiqueta del filtro
  options: FilterOption[]; // Opciones disponibles
}

interface FilterOption {
  value: string;
  label: string;
}
```

#### ImageProps

```typescript
interface ImageProps {
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  shape?: 'circle' | 'square' | 'rounded';
}
```

## Ejemplos

### Columna con Renderizado Personalizado

```tsx
const columns = [
  {
    key: "status",
    label: "Estado",
    render: (value: string) => (
      <Badge variant={value === "active" ? "success" : "danger"}>
        {value === "active" ? "Activo" : "Inactivo"}
      </Badge>
    )
  }
];
```

### Configuración de Acciones

```tsx
const actions: TableAction<typeof data[0]>[] = [
  {
    label: "Ver",
    icon: <Eye className="w-4 h-4" />,
    onClick: (item) => console.log("Ver:", item),
    show: (item, selectedCount) => selectedCount <= 1
  },
  {
    label: "Eliminar",
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (items) => console.log("Eliminar:", items),
    variant: "destructive"
  }
];
```

### Configuración de Filtros

```tsx
const filters = [
  {
    key: "role",
    label: "Roles",
    options: [
      { value: "admin", label: "Administrador" },
      { value: "user", label: "Usuario" }
    ]
  }
];
```

## Funcionalidades Detalladas

### Búsqueda Global
La búsqueda filtra automáticamente todas las columnas visibles.

### Ordenamiento
- Click en el encabezado de la columna para ordenar
- Secuencia de ordenamiento: ascendente → descendente → sin ordenar

### Selección Múltiple
- Checkbox en el encabezado para seleccionar/deseleccionar todo
- Contador de elementos seleccionados
- Acciones en lote para elementos seleccionados

### Paginación
- Navegación entre páginas
- Selector de elementos por página
- Indicador de total de registros

### Columnas Ocultables
- Menú para mostrar/ocultar columnas
- Persistencia del estado de visibilidad

## Personalización

### Estilos
El componente utiliza Tailwind CSS y puede ser personalizado mediante:
- className en las columnas
- variant en las acciones
- Sobrescritura de clases CSS base

### Modos de Acciones
- `inline`: Muestra las acciones como botones
- `dropdown`: Agrupa las acciones en un menú desplegable

## Mejores Prácticas

1. **Rendimiento**
   - Usar `pageSize` apropiado para el volumen de datos
   - Implementar renderizado personalizado con componentes memorizados

2. **Accesibilidad**
   - Incluir textos alternativos en imágenes
   - Usar variantes de botones apropiadas para el contraste

3. **Responsividad**
   - Considerar ocultar columnas menos importantes en móviles
   - Usar el modo `dropdown` para acciones en pantallas pequeñas

## Limitaciones

- Los tamaños de página están limitados a: 5, 10, 20, 50, 100
- Las imágenes requieren un fallback para manejar errores de carga
- El ordenamiento es sensible a mayúsculas/minúsculas

## Contribución

Si encuentras un bug o tienes una sugerencia, por favor crea un issue en el repositorio.
