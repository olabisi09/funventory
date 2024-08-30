import { PostgrestError } from "@supabase/supabase-js";

export const isInStock = (qty: number): string => {
  if (qty === 0) return 'Out of stock';
  if (qty >= 1 && qty <= 3) {
    return `Low in stock, ${qty} left`
  } 
  return `${qty} in stock`;
}

export const handleSupabaseError = (error: PostgrestError | Error) => {
  throw new Error(`${error.message}`);
}