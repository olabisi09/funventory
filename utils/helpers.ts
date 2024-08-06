import { PostgrestError } from "@supabase/supabase-js";

export const isInStock = (qty: number): string => {
  switch (qty) {
    case 0:
      return "Out of stock";
    case 3:
      return "Low in stock";
    default:
      return `${qty} in stock`;
  }
}

export const handleSupabaseError = (error: PostgrestError | Error) => {
  throw new Error(`${error.message}`);
}