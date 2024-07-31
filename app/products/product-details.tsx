import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProductDetails({
  product,
  category,
  analytics,
}: {
  product: Product;
  category: string;
  analytics: any;
}) {
  return (
    <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Product Details: {product.product_name}</DialogTitle>
        <DialogDescription>Tag: {category || "N/A"}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label>How much you've spent to get this product</Label>
          <p>&#8358;{analytics?.total_cost}</p>
        </div>
        <div className="flex items-center justify-between">
          <Label>Profit on this product per item</Label>
          <p>&#8358;{analytics?.profit_per_item}</p>
        </div>
        <div className="flex items-center justify-between">
          <Label>Total profit on this product</Label>
          <p>&#8358;{analytics?.total_profit}</p>
        </div>
      </div>
    </DialogContent>
  );
}
