"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addData, fetchData, tables } from "@/lib/requests";
import { Spin } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Empty } from "@/components/ui/empty";
import {
  CalendarIcon,
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ErrorMessage, Form, Formik, FormikValues } from "formik";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { validateSale } from "@/lib/validations";

export default function Sales() {
  const { toast } = useToast();
  const [openAdd, setOpenAdd] = useState(false);
  const [date, setDate] = useState<Date>();

  const addSaleMutation = useMutation({
    mutationKey: ["add-sale"],
    mutationFn: addData,
  });
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-sales"],
    queryFn: async () => fetchData(tables.sales),
  });

  const productsQuery = useQuery({
    queryKey: ["get-products"],
    queryFn: async () => fetchData(tables.products),
  });

  const handleAddSale = (values: FormikValues) => {
    const payload: Payload = {
      tableName: tables.sales,
      body: {
        product_id: values.product,
        qty_sold: values.qtySold,
        sale_date: values.saleDate,
      } as Partial<Sales>,
    };

    addSaleMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
        setOpenAdd(false);
        toast({
          title: "Success",
          description: "Sale added successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error?.message,
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <main className="grid justify-center items-center">
        <Spin />
      </main>
    );
  }

  if (isError) {
    toast({
      title: "Error",
      description: error?.message,
      variant: "destructive",
    });
  }

  const sales = data?.data as Sales[];
  const products = productsQuery.data?.data as Product[];
  const findProductName = (id: number) =>
    products?.find((x) => x.id === id)?.product_name;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Sale
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
                <Formik
                  initialValues={{
                    product: 0,
                    qtySold: "",
                    saleDate: "",
                  }}
                  onSubmit={(values) => {
                    handleAddSale(values);
                  }}
                  validationSchema={validateSale}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      <DialogHeader>
                        <DialogTitle>Add sale</DialogTitle>
                        <DialogDescription>Record a sale!</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="productName">Product</Label>
                          <Select
                            onValueChange={(val) =>
                              setFieldValue("product", parseInt(val))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Which product did you sell?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Product</SelectLabel>
                                {products?.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={`${item.id}`}
                                  >
                                    {item.product_name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <ErrorMessage name="product">
                            {(msg) => (
                              <small className="text-error">{msg}</small>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="qtySold">Quantity sold</Label>
                          <FormInput
                            id="qtySold"
                            type="number"
                            name="qtySold"
                            placeholder="Quantity sold"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="saleDate">Sale date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(e) => {
                                  setDate(e);
                                  setFieldValue("saleDate", e?.toISOString());
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <ErrorMessage name="saleDate">
                            {(msg) => (
                              <small className="text-error">{msg}</small>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          isLoading={addSaleMutation.isPending}
                          loadingText="Adding sale..."
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
              <CardDescription>Keep track of your inventory.</CardDescription>
            </CardHeader>
            <CardContent>
              {sales && sales.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity Sold</TableHead>
                      <TableHead>Date Sold</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {findProductName(item.product_id)}
                        </TableCell>
                        <TableCell>{item.qty_sold}</TableCell>
                        <TableCell>
                          {format(item.sale_date, "dd MMM yyy, h:mma")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Empty heading="No sales yet." />
              )}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
