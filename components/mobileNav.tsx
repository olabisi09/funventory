"use client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Tag,
} from "lucide-react";
import Link from "next/link";

const links = [
  {
    path: "/",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    path: "/products",
    label: "Products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    path: "/tags",
    label: "Tags",
    icon: <Tag className="h-5 w-5" />,
  },
  {
    path: "/sales",
    label: "Sales",
    icon: <LineChart className="h-5 w-5" />,
  },
];

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetClose asChild>
          <Nav />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

const Nav = ({ ...someProps }) => {
  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="/"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        {...someProps}
      >
        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      {links.map((link) => (
        <Link
          href={link.path}
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          {...someProps}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
