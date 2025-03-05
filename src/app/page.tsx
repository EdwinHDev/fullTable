"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import FullTable, { Column, TableRecord, TableValue } from "@/components/ui/FullTable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface Client extends TableRecord {
  id: number;
  name: string;
  status: "active" | "inactive";
  role: "admin" | "user";
  avatar: string;
}

export default function Home() {

  const [ isLoading, setIsLoading ] = useState(true);
  const [ tableData, setTableData ] = useState<Client[]>([]);
  const [ selectedIds, setSelectedIds ] = useState<(number | string)[]>([]);

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTableData( data );
    }, 1000);

    return () => clearTimeout(timer);
  }, [])

  const handleSelectionChange = (selectedIds: (number | string)[]) => {
    setSelectedIds(selectedIds);
    console.log(selectedIds);
  }

  const columns: Column<Client>[] = [
    {
      header: "ID",
      key: "id",
      sortable: true,
      visible: false,
      className: "w-[60px]",
      render: (value: TableValue, row: Client) => (
        <p>#{ row.id }</p>
      ),
    },
    {
      header: "Cliente",
      key: "name",
      sortable: true,
      render: (value: TableValue, row: Client) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={ row.avatar } />
            <AvatarFallback className="uppercase">{ row.name.split(" ")[0][0] }{ row.name.split(" ").length > 1 ? row.name.split(" ")[1][0] : "" }</AvatarFallback>
          </Avatar>
          <p>{ row.name }</p>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      filterable: true,
      render: (value: TableValue, row: Client) => (
        <Badge variant={row.status == "active" ? "default" : "secondary"}>{row.status}</Badge>
      ),
    },
    {
      header: "Rol",
      key: "role",
      sortable: true,
      filterable: true,
      className: "w-[100px]",
      render: (value: TableValue, row: Client) => (
        <Badge variant={row.role == "admin" ? "default" : "secondary"}>{row.role}</Badge>
      ),
    },
    {
      header: "Acciones",
      key: "actions",
      className: "w-[120px]",
      render: (value: TableValue, row: Client) => (
        <div className="flex justify-end items-center gap-2">
          {
            selectedIds.length <= 1 && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Eye className="w-4 h-4" onClick={() => {
                      console.log("Ver cliente", row.id);
                    }} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver cliente</p>
                  </TooltipContent>
                </Tooltip>

                {
                  row.status == "active" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Pencil className="w-4 h-4" onClick={() => {
                          console.log("Editar cliente", row.id);
                        }} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar cliente</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }
              </>
            )
          }
          <Tooltip>
            <TooltipTrigger asChild>
              <Trash className="w-4 h-4" onClick={() => {
                if (selectedIds.length > 0) {
                  console.log("Eliminar clientes", selectedIds);
                } else {
                  console.log("Eliminar cliente", row.id);
                }
              }} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Eliminar cliente</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  const data: Client[] = [
    { id: 1, name: "Alexander Ramos", status: "active", role: "admin", avatar: "https://mighty.tools/mockmind-api/content/human/1.jpg" },
    { id: 2, name: "Benjamin", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/2.jpg" },
    { id: 3, name: "Catherine", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/3.jpg" },
    { id: 4, name: "Daniel Jose", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/4.jpg" },
    { id: 5, name: "Elizabeth", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/5.jpg" },
    { id: 6, name: "Fernando", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/6.jpg" },
    { id: 7, name: "Gabriela", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/7.jpg" },
    { id: 8, name: "Harrison", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/8.jpg" },
    { id: 9, name: "Isabella", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/9.jpg" },
    { id: 10, name: "Jonathan", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/10.jpg" },
    { id: 11, name: "Katherine", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/11.jpg" },
    { id: 12, name: "Leonardo", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/12.jpg" },
    { id: 13, name: "Margaret", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/13.jpg" },
    { id: 14, name: "Nicholas", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/14.jpg" },
    { id: 15, name: "Olivia", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/15.jpg" },
    { id: 16, name: "Patricia", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/16.jpg" },
    { id: 17, name: "Quentin", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/17.jpg" },
    { id: 18, name: "Rebecca", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/18.jpg" },
    { id: 19, name: "Sebastian", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/19.jpg" },
    { id: 20, name: "Theodore", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/20.jpg" },
    { id: 21, name: "Ursula", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/21.jpg" },
    { id: 22, name: "Victoria", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/22.jpg" },
    { id: 23, name: "William", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/23.jpg" },
    { id: 24, name: "Xavier", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/24.jpg" },
    { id: 25, name: "Yasmine", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/25.jpg" },
    { id: 26, name: "Zachary", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/26.jpg" },
    { id: 27, name: "Andrea", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/27.jpg" },
    { id: 28, name: "Brandon", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/28.jpg" },
    { id: 29, name: "Camila", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/29.jpg" },
    { id: 30, name: "Derek", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/30.jpg" },
    { id: 31, name: "Emma", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/31.jpg" },
    { id: 32, name: "Felix", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/32.jpg" },
    { id: 33, name: "Georgia", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/33.jpg" },
    { id: 34, name: "Hugo", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/34.jpg" },
    { id: 35, name: "Iris", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/35.jpg" },
    { id: 36, name: "Julian", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/36.jpg" },
    { id: 37, name: "Kylie", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/37.jpg" },
    { id: 38, name: "Lucas", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/38.jpg" },
    { id: 39, name: "Marcus", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/39.jpg" },
    { id: 40, name: "Nina", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/40.jpg" },
    { id: 41, name: "Oscar", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/41.jpg" },
    { id: 42, name: "Penelope", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/42.jpg" },
    { id: 43, name: "Quincy", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/43.jpg" },
    { id: 44, name: "Rachel", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/44.jpg" },
    { id: 45, name: "Samuel", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/45.jpg" },
    { id: 46, name: "Talia", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/46.jpg" },
    { id: 47, name: "Uma", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/47.jpg" },
    { id: 48, name: "Vincent", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/48.jpg" },
    { id: 49, name: "Wendy", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/49.jpg" },
    { id: 50, name: "Xander", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/50.jpg" },
    { id: 51, name: "Yolanda", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/51.jpg" },
    { id: 52, name: "Zane", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/52.jpg" },
    { id: 53, name: "Alice", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/53.jpg" },
    { id: 54, name: "Bruce", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/54.jpg" },
    { id: 55, name: "Clara", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/55.jpg" },
    { id: 56, name: "David", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/56.jpg" },
    { id: 57, name: "Eva", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/57.jpg" },
    { id: 58, name: "Frank", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/58.jpg" },
    { id: 59, name: "Grace", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/59.jpg" },
    { id: 60, name: "Henry", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/60.jpg" },
    { id: 61, name: "Ivy", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/61.jpg" },
    { id: 62, name: "Jack", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/62.jpg" },
    { id: 63, name: "Karen", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/63.jpg" },
    { id: 64, name: "Leon", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/64.jpg" },
    { id: 65, name: "Mia", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/65.jpg" },
    { id: 66, name: "Nathan", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/66.jpg" },
    { id: 67, name: "Olivia", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/67.jpg" },
    { id: 68, name: "Paul", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/68.jpg" },
    { id: 69, name: "Quinn", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/69.jpg" },
    { id: 70, name: "Rose", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/70.jpg" },
    { id: 71, name: "Steve", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/71.jpg" },
    { id: 72, name: "Tina", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/72.jpg" },
    { id: 73, name: "Uri", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/73.jpg" },
    { id: 74, name: "Violet", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/74.jpg" },
    { id: 75, name: "Wade", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/75.jpg" },
    { id: 76, name: "Ximena", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/76.jpg" },
    { id: 77, name: "Yuri", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/77.jpg" },
    { id: 78, name: "Zack", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/78.jpg" },
    { id: 79, name: "Amy", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/79.jpg" },
    { id: 80, name: "Ben", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/80.jpg" },
    { id: 81, name: "Chloe", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/81.jpg" },
    { id: 82, name: "Dylan", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/82.jpg" },
    { id: 83, name: "Ella", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/83.jpg" },
    { id: 84, name: "Finn", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/84.jpg" },
    { id: 85, name: "Gina", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/85.jpg" },
    { id: 86, name: "Hans", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/86.jpg" },
    { id: 87, name: "Ida", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/87.jpg" },
    { id: 88, name: "Jake", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/88.jpg" },
    { id: 89, name: "Kim", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/89.jpg" },
    { id: 90, name: "Luke", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/90.jpg" },
    { id: 91, name: "Maya", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/91.jpg" },
    { id: 92, name: "Noah", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/92.jpg" },
    { id: 93, name: "Owen", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/93.jpg" },
    { id: 94, name: "Piper", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/94.jpg" },
    { id: 95, name: "Quin", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/95.jpg" },
    { id: 96, name: "Ryan", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/96.jpg" },
    { id: 97, name: "Sara", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/97.jpg" },
    { id: 98, name: "Tom", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/98.jpg" },
    { id: 99, name: "Uma", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/99.jpg" },
    { id: 100, name: "Vera", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/100.jpg" },
    { id: 101, name: "Will", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/101.jpg" },
    { id: 102, name: "Xena", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/102.jpg" },
    { id: 103, name: "Yara", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/103.jpg" },
    { id: 104, name: "Zoe", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/104.jpg" },
    { id: 105, name: "Adam", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/105.jpg" },
    { id: 106, name: "Beth", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/106.jpg" },
    { id: 107, name: "Cole", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/107.jpg" },
    { id: 108, name: "Dana", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/108.jpg" },
    { id: 109, name: "Erik", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/109.jpg" },
    { id: 110, name: "Faye", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/110.jpg" },
    { id: 111, name: "Greg", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/111.jpg" },
    { id: 112, name: "Hope", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/112.jpg" },
    { id: 113, name: "Ian", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/113.jpg" },
    { id: 114, name: "Jane", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/114.jpg" },
    { id: 115, name: "Kent", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/115.jpg" },
    { id: 116, name: "Liam", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/116.jpg" },
    { id: 117, name: "Mona", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/117.jpg" },
    { id: 118, name: "Neil", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/118.jpg" },
    { id: 119, name: "Opal", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/119.jpg" },
    { id: 120, name: "Pete", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/120.jpg" },
    { id: 121, name: "Ruth", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/121.jpg" },
    { id: 122, name: "Sean", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/122.jpg" },
    { id: 123, name: "Tara", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/123.jpg" },
    { id: 124, name: "Umar", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/124.jpg" },
    { id: 125, name: "Vick", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/125.jpg" },
    { id: 126, name: "Wade", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/126.jpg" },
    { id: 127, name: "Xavi", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/127.jpg" },
    { id: 128, name: "Yves", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/128.jpg" },
    { id: 129, name: "Zara", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/129.jpg" },
    { id: 130, name: "Alan", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/130.jpg" },
    { id: 131, name: "Bella", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/131.jpg" },
    { id: 132, name: "Carl", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/132.jpg" },
    { id: 133, name: "Dora", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/133.jpg" },
    { id: 134, name: "Ethan", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/134.jpg" },
    { id: 135, name: "Flora", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/135.jpg" },
    { id: 136, name: "Gary", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/136.jpg" },
    { id: 137, name: "Helen", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/137.jpg" },
    { id: 138, name: "Igor", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/138.jpg" },
    { id: 139, name: "June", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/139.jpg" },
    { id: 140, name: "Kyle", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/140.jpg" },
    { id: 141, name: "Lisa", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/141.jpg" },
    { id: 142, name: "Mark", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/142.jpg" },
    { id: 143, name: "Nora", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/143.jpg" },
    { id: 144, name: "Otto", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/144.jpg" },
    { id: 145, name: "Pam", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/145.jpg" },
    { id: 146, name: "Ross", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/146.jpg" },
    { id: 147, name: "Sue", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/147.jpg" },
    { id: 148, name: "Troy", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/148.jpg" },
    { id: 149, name: "Ulla", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/149.jpg" },
    { id: 150, name: "Vern", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/150.jpg" },
    { id: 151, name: "Wren", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/151.jpg" },
    { id: 152, name: "Xu", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/152.jpg" },
    { id: 153, name: "Yuki", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/153.jpg" },
    { id: 154, name: "Zeke", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/154.jpg" },
    { id: 155, name: "Abe", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/155.jpg" },
    { id: 156, name: "Bree", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/156.jpg" },
    { id: 157, name: "Chad", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/157.jpg" },
    { id: 158, name: "Dawn", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/158.jpg" },
    { id: 159, name: "Earl", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/159.jpg" },
    { id: 160, name: "Fran", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/160.jpg" },
    { id: 161, name: "Gage", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/161.jpg" },
    { id: 162, name: "Hazel", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/162.jpg" },
    { id: 163, name: "Ike", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/163.jpg" },
    { id: 164, name: "Jean", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/164.jpg" },
    { id: 165, name: "Kurt", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/165.jpg" },
    { id: 166, name: "Lynn", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/166.jpg" },
    { id: 167, name: "Mike", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/167.jpg" },
    { id: 168, name: "Nova", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/168.jpg" },
    { id: 169, name: "Omar", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/169.jpg" },
    { id: 170, name: "Page", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/170.jpg" },
    { id: 171, name: "Rex", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/171.jpg" },
    { id: 172, name: "Sky", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/172.jpg" },
    { id: 173, name: "Tess", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/173.jpg" },
    { id: 174, name: "Uri", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/174.jpg" },
    { id: 175, name: "Val", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/175.jpg" },
    { id: 176, name: "Ward", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/176.jpg" },
    { id: 177, name: "Xian", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/177.jpg" },
    { id: 178, name: "Yale", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/178.jpg" },
    { id: 179, name: "Zena", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/179.jpg" },
    { id: 180, name: "Axel", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/180.jpg" },
    { id: 181, name: "Brit", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/181.jpg" },
    { id: 182, name: "Cade", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/182.jpg" },
    { id: 183, name: "Dale", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/183.jpg" },
    { id: 184, name: "Eden", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/184.jpg" },
    { id: 185, name: "Flor", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/185.jpg" },
    { id: 186, name: "Gwen", status: "inactive", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/186.jpg" },
    { id: 187, name: "Hugh", status: "active", role: "user", avatar: "https://mighty.tools/mockmind-api/content/human/187.jpg" },
  ];

  return (
    <div className="w-full min-h-screen py-10">
      <div className="container mx-auto space-y-4">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-center">Table test</h1>
        </div>
        <FullTable
          data={ tableData }
          columns={ columns }
          enableSorting
          enableColumnToggle
          enablePagination
          enableSearch
          enableSelection
          enableStickyHeader
          enableStriped
          showRowCount
          isLoading={ isLoading }
          searchPlaceholder="Buscar cliente"
          emptyMessage="No hay clientes para mostrar"
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
}
