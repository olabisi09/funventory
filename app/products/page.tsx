"use client";
import Image from "next/image";
import Link from "next/link";
import placeholder from "../placeholder.svg";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { deleteData, getFileFromSupabase, saveFileToDb } from "@/lib/requests";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Empty } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormValues {
  productName: string;
  productDescription: string;
  productImg: File | null;
}

export default function Products() {
  const supabase = createClient();
  const [openAdd, setOpenAdd] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState<FormValues>({
    productName: "",
    productDescription: "",
    productImg: null,
  });

  const addProductMutation = useMutation({
    mutationKey: ["add-product"],
    mutationFn: async (form: Partial<Product>) => {
      await supabase.from("products").insert({
        productName: form.productName,
        productDescription: form.productDescription,
        productImg: form.productImg,
      });
    },
  });
  const deleteProductMutation = useMutation({
    mutationFn: deleteData,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-products"],
    queryFn: async () => await supabase.from("products").select(),
  });

  const handleAddProduct = async () => {
    try {
      const filePath = await saveFileToDb(form?.productImg!);

      const payload: Omit<Product, "id" | "created_at"> = {
        productName: form?.productName,
        productDescription: form?.productDescription,
        productImg: filePath,
      };

      await addProductMutation.mutateAsync(payload, {
        onSuccess: () => {
          refetch();
          setOpenAdd(false);
          toast({
            title: "Success",
            description: "Product added successfully",
          });
        },
      });
    } catch (error: any) {
      console.log(error);
    }
    setForm({
      productName: "",
      productDescription: "",
      productImg: null,
    });
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(
      { tableName: "products", id: id },
      {
        onSuccess: () => {
          refetch();
          toast({
            title: "Success",
            description: "Product deleted successfully",
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
    return <div>Loading...</div>;
  }

  if (isError) {
    toast({
      title: "Error",
      description: error?.message,
      variant: "destructive",
    });
  }

  const products = data?.data as Product[];

  return (
    <div>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-foreground"
              >
                <Package className="h-5 w-5" />
                Products
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Users2 className="h-5 w-5" />
                Customers
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <LineChart className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
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
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </header>
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
                      Add Product
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add product</DialogTitle>
                    <DialogDescription>
                      Add a product to your store
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="productName">Product name</Label>
                      <Input
                        id="productName"
                        name="productName"
                        placeholder="Product name"
                        onChange={(e) =>
                          setForm({ ...form, productName: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="productName">Quantity</Label>
                      <Input
                        type="number"
                        id="productName"
                        name="productName"
                        placeholder="How many do you have in stock?"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="productName">Product tag</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tag for this product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tags</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="productDescription">
                        Product description (optional)
                      </Label>
                      <Input
                        id="productDescription"
                        name="productDescription"
                        placeholder="Product description"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            productDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="picture">Picture (optional)</Label>
                      <Input
                        id="picture"
                        name="picture"
                        type="file"
                        onChange={(e) => {
                          const file = e?.target?.files;
                          if (file) {
                            setForm({ ...form, productImg: file[0] });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={handleAddProduct}
                      isLoading={addProductMutation.isPending}
                      loadingText="Saving..."
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products && products.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Total Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created at
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={
                                item.productImg
                                  ? getFileFromSupabase(
                                      "product-images",
                                      item.productImg
                                    )
                                  : placeholder
                              }
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Draft</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            $499.99
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            25
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {item.created_at}
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
                                <DropdownMenuItem
                                  onClick={() => handleDeleteProduct(item.id)}
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
                  <Empty />
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
    </div>
  );
}
