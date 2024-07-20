export const isInStock = (qty: number): string => {
  switch (qty) {
    case 0:
      return "Out of stock";
    case 3:
      return "Low in stock";
    default:
      return "In stock";
  }
}