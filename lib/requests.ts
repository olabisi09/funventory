import { createClient } from "@/utils/supabase/client";

const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient();

export const getFileFromSupabase = (bucketName: string, fileName: string) => {
  return `${projectId}/storage/v1/object/public/${bucketName || 'product-images'}/${fileName}`?.replace('{}', '')
}

export const saveFileToDb = async (file: File) => {
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(`${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    return error?.message;
  }
  return data.path;
};

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

export const deleteData = async (payload: CrudPayload) => {
  const { data, error } = await supabase.from(payload.tableName).delete().eq('id', payload.id);
  return { data, error };
}