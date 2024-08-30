"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Spin } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { fetchData, getTotalRevenue, tables } from "@/lib/requests";
import { useQueries } from "@tanstack/react-query";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Index() {
  const { toast } = useToast();

  const [dashboardMetrics, sales] = useQueries({
    queries: [
      { queryKey: ["get-dashboard-metrics"], queryFn: getTotalRevenue },
      {
        queryKey: ["get-dashboard-profit"],
        queryFn: () => fetchData(tables.salesProfitView),
      },
    ],
  });

  if (dashboardMetrics.isLoading) {
    return (
      <main className="grid justify-center items-center">
        <Spin />
      </main>
    );
  }

  if (dashboardMetrics.isError) {
    toast({
      title: "Error",
      description: dashboardMetrics.error?.message,
      variant: "destructive",
    });
  }

  const { total_revenue, total_sales, total_profit, packaging_transport_cost } =
    dashboardMetrics.data;
  const salesData = sales.data?.data as SalesView[];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&#8358;{total_revenue}</div>
            <p className="text-xs text-muted-foreground">
              You&apos;ve turned over this much so far
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&#8358;{total_profit}</div>
            <p className="text-xs text-muted-foreground">
              You&apos;ve made this much profit so far
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{total_sales}</div>
            <p className="text-xs text-muted-foreground">
              You&apos;ve sold this many products so far
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total P/T Cost on Products
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{packaging_transport_cost}
            </div>
            <p className="text-xs text-muted-foreground">
              You&apos;ve spent this much on packaging and transportation so far
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Sales Summary</CardTitle>
              <CardDescription>
                A breakdown of your recent sales.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/sales">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Total cost</TableHead>
                  <TableHead>Quantity sold</TableHead>
                  <TableHead>Amount sold</TableHead>
                  <TableHead>Profit per product</TableHead>
                  <TableHead>Total profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData?.slice(0, 10)?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>&#8358;{item.total_cost}</TableCell>
                    <TableCell>{item.qty_sold}</TableCell>
                    <TableCell>&#8358;{item.selling_price}</TableCell>
                    <TableCell>&#8358;{item.profit_per_item}</TableCell>
                    <TableCell>&#8358;{item.total_profit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  olivia.martin@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$1,999.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/02.png" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                <p className="text-sm text-muted-foreground">
                  jackson.lee@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/03.png" alt="Avatar" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p className="text-sm text-muted-foreground">
                  isabella.nguyen@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$299.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/04.png" alt="Avatar" />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">William Kim</p>
                <p className="text-sm text-muted-foreground">will@email.com</p>
              </div>
              <div className="ml-auto font-medium">+$99.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/05.png" alt="Avatar" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">
                  sofia.davis@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </main>
  );
}
