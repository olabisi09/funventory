"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
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
  addData,
  deleteData,
  fetchData,
  tables,
  updateData,
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
import { Spin } from "@/components/ui/spinner";
import { Form, Formik, FormikValues } from "formik";

export default function Tags() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [tag, setTag] = useState<Category>({} as Category);
  const { toast } = useToast();

  const addTagMutation = useMutation({ mutationFn: addData });
  const editTagMutation = useMutation({ mutationFn: updateData });
  const deleteTagMutation = useMutation({ mutationFn: deleteData });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-tags"],
    queryFn: async () => fetchData(tables.tags),
  });

  const handleAddTag = async (values: FormikValues) => {
    try {
      const payload: Payload = {
        tableName: tables.tags,
        body: {
          category_name: values.categoryName,
          category_description: values.categoryDescription,
        },
      };

      await addTagMutation.mutateAsync(payload, {
        onSuccess: () => {
          refetch();
          setOpenAdd(false);
          toast({
            title: "Success",
            description: "Tag added successfully",
          });
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleEditTag = async (values: FormikValues, resetForm: () => void) => {
    try {
      const payload: Update = {
        tableName: tables.tags,
        body: {
          category_name: values.categoryName,
          category_description: values.categoryDescription,
        },
        where: "id",
        equals: tag?.id,
      };

      await editTagMutation.mutateAsync(payload, {
        onSuccess: () => {
          refetch();
          setOpenEdit(false);
          resetForm();
          toast({
            title: "Success",
            description: "Tag updated successfully",
          });
        },
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = (id: number) => {
    deleteTagMutation.mutate(
      { tableName: tables.tags, id: id },
      {
        onSuccess: () => {
          refetch();
          toast({
            title: "Success",
            description: "Tag deleted successfully",
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

  const tags = data?.data as Category[];

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
                    Add Tag
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <Formik
                  initialValues={{
                    categoryName: "",
                    categoryDescription: "",
                  }}
                  onSubmit={(values) => handleAddTag(values)}
                >
                  <Form>
                    <DialogHeader>
                      <DialogTitle>Add tag</DialogTitle>
                      <DialogDescription>
                        Add a tag to your store
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="categoryName">Tag name</Label>
                        <FormInput
                          id="categoryName"
                          name="categoryName"
                          placeholder="Tag name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="categoryDescription">
                          Tag description (optional)
                        </Label>
                        <FormInput
                          id="categoryDescription"
                          name="categoryDescription"
                          placeholder="Tag description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        isLoading={addTagMutation.isPending}
                        loadingText="Saving..."
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </Form>
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Manage your product groups.</CardDescription>
            </CardHeader>
            <CardContent>
              {tags && tags.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created at
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.category_name}
                        </TableCell>
                        <TableCell>{item.category_description}</TableCell>
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
                              <Dialog
                                open={openEdit}
                                onOpenChange={setOpenEdit}
                              >
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setTag(item);
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
                                  <Formik
                                    initialValues={{
                                      categoryName: item?.category_name,
                                      categoryDescription:
                                        item?.category_description,
                                    }}
                                    onSubmit={(values, { resetForm }) => {
                                      handleEditTag(values, resetForm);
                                    }}
                                    enableReinitialize
                                  >
                                    <Form>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit tag: {item.category_name}
                                        </DialogTitle>
                                        <DialogDescription>
                                          Update this tag
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-6 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="categoryName">
                                            Tag name
                                          </Label>
                                          <FormInput
                                            id="categoryName"
                                            name="categoryName"
                                            placeholder="Tag name"
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="categoryDescription">
                                            Tag description
                                          </Label>
                                          <FormInput
                                            id="categoryDescription"
                                            name="categoryDescription"
                                            placeholder="Tag description"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button
                                          type="submit"
                                          isLoading={editTagMutation.isPending}
                                          loadingText="Saving..."
                                        >
                                          Save changes
                                        </Button>
                                      </DialogFooter>
                                    </Form>
                                  </Formik>
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuItem
                                onClick={() => handleDeleteTag(item.id)}
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
                Showing <strong>1-10</strong> of <strong>{tags?.length}</strong>{" "}
                {tags?.length > 1 ? "tags" : "tag"}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
