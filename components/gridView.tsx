import { MoreHorizontal } from "lucide-react";
import { Text } from "./ui/text";
import Image from "next/image";
import { Button } from "./ui/button";

export default function List() {
  return (
    <section className="flex gap-4 items-center justify-between w-full">
      <div className="flex items-center justify-between gap-4">
        <Image
          src={"/placeholder.svg"}
          alt="placeholder"
          width={50}
          height={50}
        />
        <div>
          <Text type="h4">Bella</Text>
          <p className="text-sm text-muted-foreground">Earrings</p>
          <p>N4000 | 4 in stock</p>
        </div>
      </div>
      <Button aria-haspopup="true" size="icon" variant="ghost">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </section>
  );
}
