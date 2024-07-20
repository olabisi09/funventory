import Link from "next/link";
import { Button } from "./ui/button";

export default function Grid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-6">
      <div className="bg-background rounded-lg overflow-hidden group">
        <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">View</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Product 1"
          width={400}
          height={300}
          className="object-cover w-full h-60"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">Wireless Headphones</h3>
          <p className="text-sm text-muted-foreground">
            Experience high-quality audio with our wireless headphones.
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-base font-semibold">$99.99</span>
            <Button size="sm">Add to Cart</Button>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-lg overflow-hidden group">
        <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">View</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Product 2"
          width={400}
          height={300}
          className="object-cover w-full h-60"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">Smart Watch</h3>
          <p className="text-sm text-muted-foreground">
            Stay connected with our feature-packed smart watch.
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-base font-semibold">$149.99</span>
            <Button size="sm">Add to Cart</Button>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-lg overflow-hidden group">
        <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">View</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Product 3"
          width={400}
          height={300}
          className="object-cover w-full h-60"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">Fitness Tracker</h3>
          <p className="text-sm text-muted-foreground">
            Monitor your fitness goals with our advanced tracker.
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-base font-semibold">$79.99</span>
            <Button size="sm">Add to Cart</Button>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-lg overflow-hidden group">
        <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">View</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Product 4"
          width={400}
          height={300}
          className="object-cover w-full h-60"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">Portable Charger</h3>
          <p className="text-sm text-muted-foreground">
            Keep your devices powered on the go with our portable charger.
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-base font-semibold">$29.99</span>
            <Button size="sm">Add to Cart</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
