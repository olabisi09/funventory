import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/lib/providers";

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
    <html lang="en" className={GeistSans.className}>
      <body className="bg-white">
        <main className="min-h-screen flex flex-col justify-center items-center">
          <Providers>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <TooltipProvider>
                <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                  <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                      href="#"
                      className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                      <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                      <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/business-figures"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <Home className="h-5 w-5" />
                          <span className="sr-only">Dashboard</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          <span className="sr-only">Orders</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Orders</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <Package className="h-5 w-5" />
                          <span className="sr-only">Products</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Products</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <Users2 className="h-5 w-5" />
                          <span className="sr-only">Customers</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Customers</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <LineChart className="h-5 w-5" />
                          <span className="sr-only">Analytics</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Analytics</TooltipContent>
                    </Tooltip>
                  </nav>
                  <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <Settings className="h-5 w-5" />
                          <span className="sr-only">Settings</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                  </nav>
                </aside>
              </TooltipProvider>
              <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                  {children}
                </div>
              </div>
              <Toaster />
            </div>
          </Providers>
        </main>
      </body>
    </html>
  );
}
