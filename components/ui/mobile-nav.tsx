"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Package2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import Link from "next/link";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { navItems } from "./sidebar";

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="">EON</span>
          </Link>
          {navItems.map((navItem) => (
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
      </SheetContent>
    </Sheet>
  );
}
