
import {
  Table,
  TableBody,
  TableCaption,
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Check, CheckCheck, Search } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const FullTable = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Input type="text" placeholder="Buscar" className="w-full max-w-xs" />
        <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger className="flex items-center text-sm text-gray-500 border border-gray-200 rounded-md px-3 py-2 h-9">Estados</PopoverTrigger>
          <PopoverContent>
            <div className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2">
              <span>Activo</span>
              <Check className="w-4 h-4" />
            </div>
            <Separator />
            <div className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2">
              <span>Inactivo</span>
              {/* <Check className="w-4 h-4" /> */}
            </div>
            <Separator />
            <div className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2">
              <span>Bloqueado</span>
              {/* <Check className="w-4 h-4" /> */}
            </div>
            <Separator />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="flex items-center text-sm text-gray-500 border border-gray-200 rounded-md px-3 py-2 h-9">Columnas</PopoverTrigger>
          <PopoverContent>
            <div className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2">
              <span>Columna 1</span>
              <Check className="w-4 h-4" />
            </div>
            <Separator />
            <div className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2">
              <span>Columna 2</span>
              {/* <Check className="w-4 h-4" /> */}
            </div>
            <Separator />
            <div className="text-sm flex items-center justify-between hover:bg-gray-200/75 cursor-pointer p-2">
              <span>Columna 3</span>
              {/* <Check className="w-4 h-4" /> */}
            </div>
            <Separator />
          </PopoverContent>
        </Popover>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">
          Total de registros: 100
        </span>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">Celda por página</span>
          <Select>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default FullTable