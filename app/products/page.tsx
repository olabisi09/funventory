"use client";
import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  addProduct,
  deleteData,
  fetchData,
  getFileFromSupabase,
  tables,
  updateData,
  updateProduct,
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
import { Text } from "@/components/ui/text";
import Link from "next/link";
import ProductDetails from "./product-details";

export default function Products() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [product, setProduct] = useState<Product>({} as Product);
  const { toast } = useToast();

  const addProductMutation = useMutation({ mutationFn: addProduct });
  const updateProductMutation = useMutation({ mutationFn: updateProduct });
  const deleteProductMutation = useMutation({ mutationFn: deleteData });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-products"],
    queryFn: async () => fetchData(tables.products),
  });

  const view = useQuery({
    queryKey: ["get-view-product"],
    queryFn: async () => fetchData(tables.salesProfitView),
  });

  const tagQuery = useQuery({
    queryKey: ["get-tags"],
    queryFn: async () => fetchData(tables.tags),
  });

  const handleAddProduct = async (values: FormikValues) => {
    try {
      let payload: Payload = {
        tableName: "products",
        body: {
          product_name: values.productName,
          product_description: values.productDescription,
          product_img: values.picture,
          cost_price: values.costPrice,
          packaging_cost: values.packaging,
          transportation_cost: values.transport,
          other_costs: values.otherCosts,
          stock_qty: values.stockQty,
          selling_price: values.sellingPrice,
        },
      };

      if (values.category) {
        payload.body.category_id = values.category;
      }

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

  const handleUpdateProduct = (values: FormikValues, resetForm: () => void) => {
    let payload: Update = {
      tableName: tables.products,
      body: {
        product_name: values.productName,
        product_description: values.productDescription,
        category_id: values.category,
        cost_price: values.costPrice,
        packaging_cost: values.packaging,
        transportation_cost: values.transport,
        other_costs: values.otherCosts,
        stock_qty: values.stockQty,
        selling_price: values.sellingPrice,
      } as Partial<Product>,
      existingImg: product?.product_img,
      where: "id",
      equals: product?.id,
    };

    if (values.picture) {
      payload.body.product_img = values.picture;
    }

    updateProductMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
        setOpenEdit(false);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        resetForm();
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

  const handleDeleteProduct = (product: Product) => {
    deleteProductMutation.mutate(
      { tableName: "products", id: product.id, file: product.product_img },
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
  const findCategory = (categoryId: number) =>
    tags?.find((x) => x.id === categoryId) as Category;

  const findView = (id: number) => viewData?.find((x) => x.id === id);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
      <div className="flex items-center">
        <Text type="h3">Products</Text>
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
                                  {tag.category_name}
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
      {products && products.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-background rounded-lg overflow-hidden group shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
            >
              <Link href="#" className="inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                alt="Product image"
                className="object-cover w-full h-60"
                width={400}
                height={300}
                src={
                  item.product_img
                    ? getFileFromSupabase(item.product_img)
                    : "/placeholder.svg"
                }
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product_description}
                    </p>
                  </div>
                  <Badge variant="outline">{isInStock(item.stock_qty)}</Badge>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-base font-semibold">
                    N{item.selling_price}
                  </span>
                  {/* <Button size="sm">Add to Cart</Button> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Details
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <ProductDetails
                          product={item}
                          category={
                            findCategory(item?.category_id || 0)?.category_name
                          }
                          analytics={findView(item.id)}
                        />
                      </Dialog>
                      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setProduct(item);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
                          <Formik
                            initialValues={{
                              productName: item.product_name,
                              productDescription: item.product_description,
                              stockQty: item.stock_qty,
                              costPrice: item.cost_price,
                              sellingPrice: item.selling_price,
                              packaging: item.packaging_cost,
                              transport: item.transportation_cost,
                              otherCosts: item.other_costs,
                              picture: null,
                              category: findCategory(item.category_id!)?.id,
                            }}
                            onSubmit={(values, { resetForm }) => {
                              handleUpdateProduct(values, resetForm);
                            }}
                            enableReinitialize
                          >
                            {({ setFieldValue }) => (
                              <Form>
                                <DialogHeader>
                                  <DialogTitle>
                                    Edit product: {item.product_name}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Update this product
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="productName">
                                      Product name
                                    </Label>
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
                                      <Label htmlFor="stockQty">
                                        Quantity in stock
                                      </Label>
                                      <FormInput
                                        type="number"
                                        id="stockQty"
                                        name="stockQty"
                                        placeholder="Quantity in stock"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="costPrice">
                                        Cost price
                                      </Label>
                                      <FormInput
                                        type="number"
                                        id="costPrice"
                                        name="costPrice"
                                        placeholder="Cost price"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="sellingPrice">
                                        Selling price
                                      </Label>
                                      <FormInput
                                        type="number"
                                        id="sellingPrice"
                                        name="sellingPrice"
                                        placeholder="Selling price"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="packaging">
                                        Packaging cost
                                      </Label>
                                      <FormInput
                                        type="number"
                                        id="packaging"
                                        name="packaging"
                                        placeholder="Packaging cost"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="transport">
                                        Transport cost
                                      </Label>
                                      <FormInput
                                        type="number"
                                        id="transport"
                                        name="transport"
                                        placeholder="Transport cost"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="otherCost">
                                        Other costs
                                      </Label>
                                      <FormInput
                                        type="number"
                                        id="otherCost"
                                        name="otherCost"
                                        placeholder="Other costs"
                                      />
                                    </div>
                                  </section>
                                  <div className="grid gap-2">
                                    <Label htmlFor="productName">
                                      Product tag
                                    </Label>
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
                                            <SelectItem
                                              key={tag.id}
                                              value={`${tag.id}`}
                                            >
                                              {tag.category_name}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="picture">
                                      Change picture (optional)
                                    </Label>
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
                                    isLoading={updateProductMutation.isPending}
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
                        onClick={() => handleDeleteProduct(item)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <Empty heading="No products yet" />
      )}
    </main>
  );
}
