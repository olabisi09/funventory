"use client";
import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { FormInput, Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addProduct,
  deleteData,
  fetchData,
  getFileFromSupabase,
  tables,
} from "@/lib/requests";
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
import { Spin } from "@/components/ui/spinner";
import { Form, Formik, FormikValues } from "formik";
import { isInStock } from "@/utils/helpers";
import Grid from "@/components/gridView";
import { Text } from "@/components/ui/text";
import Link from "next/link";

export default function Products() {
  const [openAdd, setOpenAdd] = useState(false);
  const { toast } = useToast();

  const addProductMutation = useMutation({
    mutationKey: ["add-product"],
    mutationFn: addProduct,
  });
  const deleteProductMutation = useMutation({
    mutationFn: deleteData,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-products"],
    queryFn: async () => fetchData(tables.products),
  });

  const view = useQuery({
    queryKey: ["get-view-product"],
    queryFn: async () => fetchData(tables.profitView),
  });

  const tagQuery = useQuery({
    queryKey: ["get-tags"],
    queryFn: async () => fetchData(tables.tags),
  });

  const handleAddProduct = async (values: FormikValues) => {
    try {
      const payload: Payload = {
        tableName: "products",
        body: {
          productName: values.productName,
          productDescription: values.productDescription,
          productImg: values.picture,
          categoryId: values.category,
          costPrice: values.costPrice,
          packagingCost: values.packaging,
          transportationCost: values.transport,
          otherCosts: values.otherCosts,
          stockQty: values.stockQty,
          sellingPrice: values.sellingPrice,
        },
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
  };

  const handleDeleteProduct = (product: Product) => {
    deleteProductMutation.mutate(
      { tableName: "products", id: product.id, file: product.productImg },
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

  const products = data?.data as Product[];
  const tags = tagQuery?.data?.data as Category[];
  const viewData = view?.data?.data;

  const findView = (id: number) => viewData?.find((x) => x.productid === id);
  console.log(findView(16));

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
                    Add Product
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
                <Formik
                  initialValues={{
                    productName: "",
                    productDescription: "",
                    stockQty: 0,
                    costPrice: 0,
                    sellingPrice: "",
                    packaging: 0,
                    transport: 0,
                    otherCosts: 0,
                    picture: null,
                    category: 0,
                  }}
                  onSubmit={(values) => {
                    handleAddProduct(values);
                  }}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      <DialogHeader>
                        <DialogTitle>Add product</DialogTitle>
                        <DialogDescription>
                          Add a product to your store
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="productName">Product name</Label>
                          <FormInput
                            id="productName"
                            name="productName"
                            placeholder="Product name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="productDescription">
                            Product description (optional)
                          </Label>
                          <FormInput
                            id="productDescription"
                            name="productDescription"
                            placeholder="Product description"
                          />
                        </div>
                        <section className="grid grid-cols-2 gap-x-2 gap-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="stockQty">Quantity in stock</Label>
                            <FormInput
                              type="number"
                              id="stockQty"
                              name="stockQty"
                              placeholder="Quantity in stock"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="costPrice">Cost price</Label>
                            <FormInput
                              type="number"
                              id="costPrice"
                              name="costPrice"
                              placeholder="Cost price"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="sellingPrice">Selling price</Label>
                            <FormInput
                              type="number"
                              id="sellingPrice"
                              name="sellingPrice"
                              placeholder="Selling price"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="packaging">Packaging cost</Label>
                            <FormInput
                              type="number"
                              id="packaging"
                              name="packaging"
                              placeholder="Packaging cost"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="transport">Transport cost</Label>
                            <FormInput
                              type="number"
                              id="transport"
                              name="transport"
                              placeholder="Transport cost"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="otherCost">Other costs</Label>
                            <FormInput
                              type="number"
                              id="otherCost"
                              name="otherCost"
                              placeholder="Other costs"
                            />
                          </div>
                        </section>
                        <div className="grid gap-2">
                          <Label htmlFor="productName">Product tag</Label>
                          <Select
                            onValueChange={(val) =>
                              setFieldValue("category", parseInt(val))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tag for this product" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Tags</SelectLabel>
                                {tags?.map((tag) => (
                                  <SelectItem key={tag.id} value={`${tag.id}`}>
                                    {tag.categoryName}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid w-full items-center gap-2">
                          <Label htmlFor="picture">Picture (optional)</Label>
                          <Input
                            id="picture"
                            name="picture"
                            type="file"
                            onChange={(e) => {
                              const file = e?.target?.files;
                              if (file) {
                                setFieldValue("picture", file[0]);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          isLoading={addProductMutation.isPending}
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
          </div>
        </div>
        {/* <TabsContent value="all">
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
                      <TableHead>Category</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
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
                                ? getFileFromSupabase(item.productImg)
                                : "/placeholder.svg"
                            }
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {tags?.find((tag) => tag.id === item.categoryId)
                            ?.categoryName || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {isInStock(item.stockQty)}
                          </Badge>
                        </TableCell>
                        <TableCell>N{item.sellingPrice}</TableCell>
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
                                onClick={() => handleDeleteProduct(item)}
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
                <Empty heading="No products available" />
              )}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent> */}
        <div>
          <Text type="h3">Products</Text>
          <Text>Manage your products and view their sales performance</Text>
          <br />
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-6">
            {products &&
              products.length > 0 &&
              products.map((item) => (
                <div
                  key={item.id}
                  className="bg-background rounded-lg overflow-hidden group"
                >
                  <Link
                    href="#"
                    className="absolute inset-0 z-10"
                    prefetch={false}
                  >
                    <span className="sr-only">View</span>
                  </Link>
                  <Image
                    alt="Product image"
                    className="object-cover w-full h-60"
                    width={400}
                    height={300}
                    src={
                      item.productImg
                        ? getFileFromSupabase(item.productImg)
                        : "/placeholder.svg"
                    }
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.productDescription}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-base font-semibold">
                        N{item.sellingPrice}
                      </span>
                      <Button size="sm">Add to Cart</Button>
                    </div>
                  </div>
                </div>
              ))}
          </section>
        </div>
      </Tabs>
    </main>
  );
}
