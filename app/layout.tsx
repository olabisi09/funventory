import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Link from "next/link";
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  Tag,
  Users,
} from "lucide-react";
import Providers from "@/lib/providers";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/modeToggle";
import MobileNav from "@/components/mobileNav";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Funventory",
  description: "For keeping track of inventory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col justify-center items-center dark:bg-slate-950 dark:border-slate-950">
            <Providers>
              <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                  <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                      <Link
                        href="/"
                        className="flex items-center gap-2 font-semibold"
                      >
                        <Package2 className="h-6 w-6" />
                        <span className="">Aurea Inc</span>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto h-8 w-8"
                      >
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                      </Button>
                    </div>
                    <div className="flex-1">
                      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                          href="/"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                          <Home className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/products"
                          className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                          <Package className="h-4 w-4" />
                          Products{" "}
                        </Link>
                        <Link
                          href="/tags"
                          className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                          <Tag className="h-4 w-4" />
                          Tags
                        </Link>
                        <Link
                          href="/sales"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                          <LineChart className="h-4 w-4" />
                          Sales
                        </Link>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="flex min-h-screen w-full flex-col">
                  <header className="sticky bg-white dark:bg-slate-950 top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <MobileNav />
                    <Breadcrumb className="hidden md:flex">
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link href="#">Dashboard</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link href="#">Products</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>All Products</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                    <ModeToggle />
                  </header>
                  <div className="flex flex-col sm:gap-4 sm:py-4">
                    {children}
                  </div>
                </div>
              </div>
            </Providers>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
