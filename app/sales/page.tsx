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
import {
  addData,
  deleteData,
  fetchData,
  tables,
  updateData,
} from "@/lib/requests";
import { Spin } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Empty } from "@/components/ui/empty";
import { CalendarIcon, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
  const [openEdit, setOpenEdit] = useState(false);
  const [date, setDate] = useState<Date>();
  const [saleId, setSalesId] = useState<number>(0);

  const addSaleMutation = useMutation({ mutationFn: addData });
  const updateSaleMutation = useMutation({ mutationFn: updateData });
  const deleteSaleMutation = useMutation({ mutationFn: deleteData });

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

  const handleUpdateSale = (values: FormikValues) => {
    const payload: Update = {
      tableName: tables.sales,
      body: {
        product_id: values.product,
        qty_sold: values.qtySold,
        sale_date: values.saleDate,
      } as Partial<Sales>,
      where: "id",
      equals: saleId,
    };

    updateSaleMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
        setOpenEdit(false);
        toast({
          title: "Success",
          description: "Sale updated successfully",
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

  const handleDeleteSale = (sale: Sales) => {
    deleteSaleMutation.mutate(
      { tableName: tables.sales, id: sale.id },
      {
        onSuccess: () => {
          refetch();
          toast({
            title: "Success",
            description: "Sale record deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error?.message,
            variant: "destructive",
          });
        },
      }
    );
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
    products?.find((x) => x.id === id) as Product;
  const isEnoughInStock = (id: number, qty: number) => {
    const product = products?.find((x) => x.id === id) as Product;
    return product?.stock_qty >= qty;
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
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
                      <TableHead>Date Sold</TableHead>
                      <TableHead>Quantity Sold</TableHead>
                      <TableHead>Amount Made</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {findProductName(item.product_id)?.product_name}
                        </TableCell>
                        <TableCell>
                          {format(item.sale_date, "dd MMM yyy, h:mma")}
                        </TableCell>
                        <TableCell>{item.qty_sold}</TableCell>
                        <TableCell>
                          {findProductName(item.product_id)?.selling_price *
                            item.qty_sold}
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
                              <Dialog
                                open={openEdit}
                                onOpenChange={setOpenEdit}
                              >
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setSalesId(item.id);
                                      setDate(new Date(item.sale_date));
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
                                  <Formik
                                    initialValues={{
                                      product: item.product_id,
                                      qtySold: item.qty_sold,
                                      saleDate: item.sale_date,
                                    }}
                                    onSubmit={(values) => {
                                      if (
                                        isEnoughInStock(
                                          values.product,
                                          values.qtySold
                                        )
                                      ) {
                                        handleUpdateSale(values);
                                      } else {
                                        toast({
                                          title: "Error",
                                          description: "Not enough in stock",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                    validationSchema={validateSale}
                                    enableReinitialize
                                  >
                                    {({ setFieldValue }) => (
                                      <Form>
                                        <DialogHeader>
                                          <DialogTitle>Edit sale</DialogTitle>
                                          <DialogDescription>
                                            Update this sale!
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                          <div className="grid gap-2">
                                            <Label htmlFor="product">
                                              Product
                                            </Label>
                                            <FormInput
                                              id="product"
                                              name="Product"
                                              placeholder="Product"
                                              disabled
                                              value={
                                                findProductName(item.product_id)
                                                  ?.product_name
                                              }
                                            />
                                            <ErrorMessage name="product">
                                              {(msg) => (
                                                <small className="text-error">
                                                  {msg}
                                                </small>
                                              )}
                                            </ErrorMessage>
                                          </div>
                                          <div className="grid gap-2">
                                            <Label htmlFor="qtySold">
                                              Quantity sold
                                            </Label>
                                            <FormInput
                                              id="qtySold"
                                              type="number"
                                              name="qtySold"
                                              placeholder="Quantity sold"
                                            />
                                          </div>
                                          <div className="grid gap-2">
                                            <Label htmlFor="saleDate">
                                              Sale date
                                            </Label>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button
                                                  variant={"outline"}
                                                  className={cn(
                                                    "justify-start text-left font-normal",
                                                    !date &&
                                                      "text-muted-foreground"
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
                                                  onSelect={setDate}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <ErrorMessage name="saleDate">
                                              {(msg) => (
                                                <small className="text-error">
                                                  {msg}
                                                </small>
                                              )}
                                            </ErrorMessage>
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button
                                            type="submit"
                                            isLoading={
                                              updateSaleMutation.isPending
                                            }
                                            loadingText="Saving..."
                                          >
                                            Save changes
                                          </Button>
                                        </DialogFooter>
                                      </Form>
                                    )}
                                  </Formik>
                                </DialogContent>
                              </Dialog>

                              <DropdownMenuItem
                                onClick={() => handleDeleteSale(item)}
                              >
                                Delete
                              </DropdownMenuItem>
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
            {/* <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
