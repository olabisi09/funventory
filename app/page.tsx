"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const FILE_NAME = "product1.png";

export default async function Index() {
  const supabase = createClient();

  const uploadFile = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(FILE_NAME, file!, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.log(error);
      return null;
    }
    return data.path;
  };

  const saveFileToDb = async (file: File) => {
    const filePath = await uploadFile(file);

    if (filePath) {
      const { data, error } = await supabase
        .from("products")
        .insert<Partial<Product>>({
          productName: "Aurea jewel",
          productDescription: "Aurea jewel",
          productImg: filePath!,
          // productPrice: 10000,
          // productQuantity: 10,
          // productCategory: "jewel",
          // productQuantity: 10,
          // productCategory: "jewel",
        });

      if (error) {
        alert(error.message);
        return null;
      }
      alert("Success");
      return data;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <h1>Funventory Supabase!</h1>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files;
          if (file) {
            saveFileToDb(file[0]);
          }
        }}
      />

      {/* {data && <div>Success!</div>} */}
    </div>
  );
}
