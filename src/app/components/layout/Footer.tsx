"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  return (
    <footer className="bg-white shadow-md sticky top-0 z-50">底部栏</footer>
  );
}
