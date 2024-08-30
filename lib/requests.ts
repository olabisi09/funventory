import { handleSupabaseError } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/client";

const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient();
export const tables = {
  products: "products",
  tags: "categories",
  salesProfitView: "sales_profit_view",
  sales: "sales",
};

export const getFileFromSupabase = (fileName: string) => {
  return `${projectId}/storage/v1/object/public/product-images/${fileName}`?.replace(
    "{}",
    ""
  );
};

export const getAllFilesFromBucket = async () => {
  const { data, error } = await supabase.storage
    .from("product-images")
    .list("", {
      limit: 100,
      offset: 0,
    });

  return { data, error };
};

export const deleteFilesThatStartWith = async (substring: string) => {
  const { data, error } = await getAllFilesFromBucket();
  if (error) {
    handleSupabaseError(error);
    return [];
  }

  const filesToDelete = data?.filter((x) => x?.name?.startsWith(substring));
  if (!filesToDelete || filesToDelete.length === 0) {
    return [];
  }

  const { error: deleteError } = await supabase.storage
    .from("product-images")
    .remove(filesToDelete.map((x) => x?.name));
  if (deleteError) {
    handleSupabaseError(deleteError);
    return [];
  }
};

export const saveFileToDb = async (file: File, productName: string) => {
  const fileName = `${productName}-${Date.now()}.${file?.name
    .split(".")
    .pop()}`;
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

export const updateFileInDb = async (file: File, existingFileName: string) => {
  let strippedFileName = existingFileName.replace("public/", "");
  const { data, error } = await supabase.storage
    .from("product-images")
    .update(strippedFileName, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    return "";
  }
  return data.path;
};

export const deleteFileFromDb = async (fileName: string) =>
  await supabase.storage.from("product-images").remove([fileName]);

export const downloadFileFromSupabase = (fileName: string) => {
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(`public/${fileName}`, {
      transform: {
        width: 64,
        height: 64,
        quality: 100,
      },
    });

  return data.publicUrl;
};

//Alba-1722199493984.JPG

export const addProduct = async (payload: Payload) => {
  const filePath = await saveFileToDb(
    payload.body.product_img,
    payload.body.product_name
  );
  if (filePath) {
    payload.body.product_img = filePath;
  } else throw new Error("Failed to upload image");
  return await addData(payload);
};
export const updateProduct = async (payload: Update) => {
  if (payload.body.product_img) {
    await deleteFilesThatStartWith(payload.body.product_name);
  let filePath = ''
  if (!payload.body.product_img && payload.existingImg) {
    filePath = await saveFileToDb(payload.body.product_img, payload.body.product_name);
    if (filePath) {
      payload.body.product_img = filePath;
    }
    else throw new Error('Failed to upload image');
  }
  else if (payload.body.product_img && payload.existingImg) {
    filePath = await saveFileToDb(payload.body.product_img, payload.body.product_name)
    if (filePath) {
      payload.body.product_img = filePath;
    }
    else throw new Error('Failed to upload image');
  }
  }

  const input: Update = {
    tableName: tables.products,
    body: payload.body,
    where: payload.where,
    equals: payload.equals,
  };

  return await updateData(input);
};

export const fetchData = async (tableName: string, ...queryOptions: QueryOptions[]) => {
  let query = supabase.from(tableName).select();
  if (queryOptions) {
    queryOptions.forEach(q => {
      if (q.comparison === 'eq') {
        query = query.eq(q.columnToQuery, q.valueToQuery);
      }
      if (q.comparison === 'gte') {
        query = query.gte(q.columnToQuery, q.valueToQuery);
      }
      if (q.comparison === 'lte') {
        query = query.lte(q.columnToQuery, q.valueToQuery);
      }
      if (q.comparison === 'gt') {
        query = query.gt(q.columnToQuery, q.valueToQuery);
      }
      if (q.comparison === 'lt') {
        query = query.lt(q.columnToQuery, q.valueToQuery);
      }
    });
  }
  return await query;
}

export const addData = async (payload: Payload) => {
  const { data, error } = await supabase
    .from(payload.tableName)
    .insert(payload.body);

  if (error) {
    handleSupabaseError(error);
  }
  return data;
};

export const updateData = async (payload: Update) => {
  const { data, error } = await supabase
    .from(payload.tableName)
    .update(payload.body)
    .eq(payload.where, payload.equals);

  if (error) {
    handleSupabaseError(error);
  }
  return data;
};

export const deleteData = async (payload: Delete) => {
  if (payload.file) {
    await deleteFileFromDb(payload.file);
  }
  const { data, error } = await supabase
    .from(payload.tableName)
    .delete()
    .eq("id", payload.id);
  if (error) {
    handleSupabaseError(error);
  }
  return data;
};

export const getTotalRevenue = async () => {
  const { data, error } = await supabase.rpc("get_dashboard");

  if (error) {
    handleSupabaseError(error);
  }
  return data;
};
