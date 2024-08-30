import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormInput, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductActions({
  productName,
  tags,
  setFieldValue,
}: {
  productName: string;
  tags: Category[];
  setFieldValue: (fieldName: string, val: any) => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit product: {productName}</DialogTitle>
        <DialogDescription>Update this product</DialogDescription>
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
            <Label htmlFor="pT">Packaging/Transportation cost</Label>
            <FormInput
              type="number"
              id="pT"
              name="pT"
              placeholder="Packaging/transport cost"
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
          <div className="grid gap-2">
            <Label htmlFor="productName">Product tag</Label>
            <Select
              onValueChange={(val) => setFieldValue("category", parseInt(val))}
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
        </section>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="picture">Change picture (optional)</Label>
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
    </>
  );
}
