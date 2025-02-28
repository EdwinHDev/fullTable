"use client"

import FullTable, { TableAction, AvatarShape } from "@/components/FullTable";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home() {

  const [actionsMode, setActionsMode] = useState<'inline' | 'dropdown'>('dropdown');

  const avatarShape: AvatarShape = "rounded";

  const data = [
    { id: 1, name: "Alexander", status: "active", role: "admin", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Benjamin", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Catherine", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Daniel", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Elizabeth", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, name: "Fernando", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=6" },
    { id: 7, name: "Gabriela", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=7" },
    { id: 8, name: "Harrison", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=8" },
    { id: 9, name: "Isabella", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=9" },
    { id: 10, name: "Jonathan", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=10" },
    { id: 11, name: "Katherine", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 12, name: "Leonardo", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=12" },
    { id: 13, name: "Margaret", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=13" },
    { id: 14, name: "Nicholas", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=14" },
    { id: 15, name: "Olivia", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=15" },
    { id: 16, name: "Patricia", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=16" },
    { id: 17, name: "Quentin", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=17" },
    { id: 18, name: "Rebecca", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=18" },
    { id: 19, name: "Sebastian", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=19" },
    { id: 20, name: "Theodore", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=20" },
    { id: 21, name: "Ursula", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=21" },
    { id: 22, name: "Victoria", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=22" },
    { id: 23, name: "William", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=23" },
    { id: 24, name: "Xavier", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=24" },
    { id: 25, name: "Yasmine", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=25" },
    { id: 26, name: "Zachary", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=26" },
    { id: 27, name: "Andrea", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=27" },
    { id: 28, name: "Brandon", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=28" },
    { id: 29, name: "Camila", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=29" },
    { id: 30, name: "Derek", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=30" },
    { id: 31, name: "Emma", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=31" },
    { id: 32, name: "Felix", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=32" },
    { id: 33, name: "Georgia", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=33" },
    { id: 34, name: "Hugo", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=34" },
    { id: 35, name: "Iris", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=35" },
    { id: 36, name: "Julian", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=36" },
    { id: 37, name: "Kylie", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=37" },
    { id: 38, name: "Lucas", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=38" },
    { id: 39, name: "Marcus", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=39" },
    { id: 40, name: "Nina", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=40" },
    { id: 41, name: "Oscar", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=41" },
    { id: 42, name: "Penelope", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=42" },
    { id: 43, name: "Quincy", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=43" },
    { id: 44, name: "Rachel", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=44" },
    { id: 45, name: "Samuel", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=45" },
    { id: 46, name: "Talia", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=46" },
    { id: 47, name: "Uma", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=47" },
    { id: 48, name: "Vincent", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=48" },
    { id: 49, name: "Wendy", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=49" },
    { id: 50, name: "Xander", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=50" },
    { id: 51, name: "Yolanda", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=51" },
    { id: 52, name: "Zane", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=52" },
    { id: 53, name: "Alice", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=53" },
    { id: 54, name: "Bruce", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=54" },
    { id: 55, name: "Clara", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=55" },
    { id: 56, name: "David", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=56" },
    { id: 57, name: "Eva", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=57" },
    { id: 58, name: "Frank", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=58" },
    { id: 59, name: "Grace", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=59" },
    { id: 60, name: "Henry", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=60" },
    { id: 61, name: "Ivy", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=61" },
    { id: 62, name: "Jack", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=62" },
    { id: 63, name: "Karen", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=63" },
    { id: 64, name: "Leon", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=64" },
    { id: 65, name: "Mia", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=65" },
    { id: 66, name: "Nathan", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=66" },
    { id: 67, name: "Olivia", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=67" },
    { id: 68, name: "Paul", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=68" },
    { id: 69, name: "Quinn", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=69" },
    { id: 70, name: "Rose", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=70" },
    { id: 71, name: "Steve", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=71" },
    { id: 72, name: "Tina", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=72" },
    { id: 73, name: "Uri", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=73" },
    { id: 74, name: "Violet", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=74" },
    { id: 75, name: "Wade", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=75" },
    { id: 76, name: "Ximena", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=76" },
    { id: 77, name: "Yuri", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=77" },
    { id: 78, name: "Zack", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=78" },
    { id: 79, name: "Amy", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=79" },
    { id: 80, name: "Ben", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=80" },
    { id: 81, name: "Chloe", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=81" },
    { id: 82, name: "Dylan", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=82" },
    { id: 83, name: "Ella", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=83" },
    { id: 84, name: "Finn", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=84" },
    { id: 85, name: "Gina", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=85" },
    { id: 86, name: "Hans", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=86" },
    { id: 87, name: "Ida", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=87" },
    { id: 88, name: "Jake", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=88" },
    { id: 89, name: "Kim", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=89" },
    { id: 90, name: "Luke", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=90" },
    { id: 91, name: "Maya", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=91" },
    { id: 92, name: "Noah", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=92" },
    { id: 93, name: "Owen", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=93" },
    { id: 94, name: "Piper", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=94" },
    { id: 95, name: "Quin", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=95" },
    { id: 96, name: "Ryan", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=96" },
    { id: 97, name: "Sara", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=97" },
    { id: 98, name: "Tom", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=98" },
    { id: 99, name: "Uma", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=99" },
    { id: 100, name: "Vera", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=100" },
    { id: 101, name: "Will", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=101" },
    { id: 102, name: "Xena", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=102" },
    { id: 103, name: "Yara", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=103" },
    { id: 104, name: "Zoe", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=104" },
    { id: 105, name: "Adam", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=105" },
    { id: 106, name: "Beth", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=106" },
    { id: 107, name: "Cole", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=107" },
    { id: 108, name: "Dana", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=108" },
    { id: 109, name: "Erik", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=109" },
    { id: 110, name: "Faye", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=110" },
    { id: 111, name: "Greg", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=111" },
    { id: 112, name: "Hope", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=112" },
    { id: 113, name: "Ian", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=113" },
    { id: 114, name: "Jane", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=114" },
    { id: 115, name: "Kent", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=115" },
    { id: 116, name: "Liam", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=116" },
    { id: 117, name: "Mona", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=117" },
    { id: 118, name: "Neil", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=118" },
    { id: 119, name: "Opal", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=119" },
    { id: 120, name: "Pete", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=120" },
    { id: 121, name: "Ruth", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=121" },
    { id: 122, name: "Sean", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=122" },
    { id: 123, name: "Tara", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=123" },
    { id: 124, name: "Umar", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=124" },
    { id: 125, name: "Vick", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=125" },
    { id: 126, name: "Wade", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=126" },
    { id: 127, name: "Xavi", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=127" },
    { id: 128, name: "Yves", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=128" },
    { id: 129, name: "Zara", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=129" },
    { id: 130, name: "Alan", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=130" },
    { id: 131, name: "Bella", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=131" },
    { id: 132, name: "Carl", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=132" },
    { id: 133, name: "Dora", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=133" },
    { id: 134, name: "Ethan", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=134" },
    { id: 135, name: "Flora", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=135" },
    { id: 136, name: "Gary", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=136" },
    { id: 137, name: "Helen", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=137" },
    { id: 138, name: "Igor", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=138" },
    { id: 139, name: "June", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=139" },
    { id: 140, name: "Kyle", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=140" },
    { id: 141, name: "Lisa", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=141" },
    { id: 142, name: "Mark", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=142" },
    { id: 143, name: "Nora", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=143" },
    { id: 144, name: "Otto", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=144" },
    { id: 145, name: "Pam", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=145" },
    { id: 146, name: "Ross", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=146" },
    { id: 147, name: "Sue", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=147" },
    { id: 148, name: "Troy", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=148" },
    { id: 149, name: "Ulla", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=149" },
    { id: 150, name: "Vern", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=150" },
    { id: 151, name: "Wren", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=151" },
    { id: 152, name: "Xu", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=152" },
    { id: 153, name: "Yuki", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=153" },
    { id: 154, name: "Zeke", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=154" },
    { id: 155, name: "Abe", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=155" },
    { id: 156, name: "Bree", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=156" },
    { id: 157, name: "Chad", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=157" },
    { id: 158, name: "Dawn", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=158" },
    { id: 159, name: "Earl", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=159" },
    { id: 160, name: "Fran", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=160" },
    { id: 161, name: "Gage", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=161" },
    { id: 162, name: "Hazel", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=162" },
    { id: 163, name: "Ike", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=163" },
    { id: 164, name: "Jean", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=164" },
    { id: 165, name: "Kurt", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=165" },
    { id: 166, name: "Lynn", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=166" },
    { id: 167, name: "Mike", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=167" },
    { id: 168, name: "Nova", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=168" },
    { id: 169, name: "Omar", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=169" },
    { id: 170, name: "Page", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=170" },
    { id: 171, name: "Rex", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=171" },
    { id: 172, name: "Sky", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=172" },
    { id: 173, name: "Tess", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=173" },
    { id: 174, name: "Uri", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=174" },
    { id: 175, name: "Val", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=175" },
    { id: 176, name: "Ward", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=176" },
    { id: 177, name: "Xian", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=177" },
    { id: 178, name: "Yale", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=178" },
    { id: 179, name: "Zena", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=179" },
    { id: 180, name: "Axel", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=180" },
    { id: 181, name: "Brit", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=181" },
    { id: 182, name: "Cade", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=182" },
    { id: 183, name: "Dale", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=183" },
    { id: 184, name: "Eden", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=184" },
    { id: 185, name: "Flor", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=185" },
    { id: 186, name: "Gwen", status: "inactive", role: "user", avatar: "https://i.pravatar.cc/150?img=186" },
    { id: 187, name: "Hugh", status: "active", role: "user", avatar: "https://i.pravatar.cc/150?img=187" },
  ];

  const columns = [
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
        shape: avatarShape
      }
    },
    { key: "id", label: "ID", visible: false },
    { key: "name", label: "Nombre" },
    { 
      key: "status", 
      label: "Estado",
      render: (value: string) => (
        <Badge variant={value === "active" ? "success" : "danger"}>
          {value === "active" ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    { 
      key: "role", 
      label: "Rol",
      render: (value: string) => (
        <Badge variant={value === "admin" ? "default" : "outline"}>
          {value === "admin" ? "Administrador" : "Usuario"}
        </Badge>
      )
    }
  ];

  const filters = [
    {
      key: "role",
      label: "Roles",
      options: [
        { value: "admin", label: "Administrador" },
        { value: "user", label: "Usuario" },
      ],
    },
  ];

  const actions: TableAction<typeof data[0]>[] = [
    {
      label: "Ver",
      icon: <Eye className={`w-4 h-4 ${actionsMode == "inline" ? "text-blue-500" : ""}`} />,
      onClick: (item) => {
        console.log("Ver item:", item);
      },
      show: (item, selectedCount) => selectedCount <= 1
    },
    {
      label: "Editar",
      icon: <Pencil className={`w-4 h-4 ${actionsMode == "inline" ? "text-yellow-500" : ""}`} />,
      onClick: (item) => {
        console.log("Editar item:", item);
      },
      show: (item, selectedCount) => selectedCount <= 1
    },
    {
      label: "Eliminar",
      icon: <Trash2 className={`w-4 h-4 ${actionsMode == "inline" ? "text-red-500" : ""}`} />,
      onClick: (items) => {
        if (Array.isArray(items)) {
          console.log("Eliminar items:", items);
        } else {
          console.log("Eliminar item:", items);
        }
      }
    },
  ];

  return (
    <div className="w-full min-h-screen py-10">
      <div className="container mx-auto space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setActionsMode(prev => prev === 'inline' ? 'dropdown' : 'inline')}
          >
            {actionsMode === 'inline' ? 'Modo Menú' : 'Modo Inline'}
          </Button>
        </div>
        <FullTable
          data={data}
          columns={columns}
          filters={filters}
          actions={actions}
          actionsMode={actionsMode}
          selectable={true}
        />
      </div>
    </div>
  );
}
