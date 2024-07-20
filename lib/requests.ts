import { createClient } from "@/utils/supabase/client";

const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient();
export const tables = {
  products: "products",
  tags: "categories",
  profitView: "product_profit_view",
}

export const getFileFromSupabase = (fileName: string) => {
  return `${projectId}/storage/v1/object/public/product-images/${fileName}`?.replace('{}', '')
}

export const saveFileToDb = async (file: File, productName: string) => {
  const fileName = `${productName}-${Date.now()}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    return "";
  }
  return data.path;
};

export const deleteFileFromDb = async (fileName: string) => await supabase.storage.from("product-images").remove([fileName]);

export const downloadFileFromSupabase = (fileName: string) => {
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(`public/${fileName}`, {
      transform: {
        width: 64,
        height: 64,
        quality: 100
      }
    });
  
  return data;
}

export const addProduct = async (payload: Payload) => {
  const filePath = await saveFileToDb(payload.body.productImg, payload.body.productName);
  if (filePath) {
    payload.body.productImg = filePath;
  }
  else throw new Error('Failed to upload image');
  return await addData(payload);
}

export const fetchData = async (tableName: string) => await supabase.from(tableName).select()

export const addData = async (payload: Payload) => {
  await supabase.from(payload.tableName).insert(payload.body);
}

export const deleteData = async (payload: Delete) => {
  if (payload.file) {
    await deleteFileFromDb(payload.file)
  }
  const { data, error } = await supabase.from(payload.tableName).delete().eq('id', payload.id);
  return { data, error };
}