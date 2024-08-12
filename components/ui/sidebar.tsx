"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Bell,
  Book,
  CircleUser,
  Home,
  LineChart,
  Package2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "./button";

export const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <Home className="h-4 w-4" />,
    roles: ["Administrator"], // Peran yang dapat melihat menu ini
  },
  {
    label: "Karyawan",
    href: "/admin/karyawan",
    icon: <Users className="h-4 w-4" />,
    roles: ["Administrator"], // Peran yang dapat melihat menu ini
  },
  {
    label: "Employee Self Service",
    href: "/admin/employee-self-service",
    icon: <Book className="h-4 w-4" />,
    roles: ["User", "Administrator"], // Peran yang dapat melihat menu ini
  },
  {
    label: "Hiring Tracking",
    href: "/admin/hiring-tracking",
    icon: <TrendingUp className="h-4 w-4" />,
    roles: ["Administrator"], // Peran yang dapat melihat menu ini
  },
  {
    label: "Performance Review",
    href: "/admin/performance-review",
    icon: <LineChart className="h-4 w-4" />,
    roles: ["Superior", "Supersuperior", "Administrator"], // Peran yang dapat melihat menu ini
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <CircleUser className="h-4 w-4" />,
    roles: ["Administrator"], // Peran yang dapat melihat menu ini
  },
];

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    console.log("User role from localStorage:", userRole); // Debug log
    setRole(userRole);
  }, []);

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">EON</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems
              .filter((navItem) => {
                console.log(
                  `Checking roles for ${navItem.label}:`,
                  navItem.roles
                ); // Debug log
                return navItem.roles.includes(role as string);
              })
              .map((navItem) => (
                <Link
                  key={navItem.label}
                  href={navItem.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    pathname === navItem.href ? "bg-muted text-primary" : ""
                  }`}
                >
                  {navItem.icon}
                  {navItem.label}
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
