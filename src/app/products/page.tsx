import { products } from "@/db/schema";
import { db } from "@/lib/db";
import ProductsPortalClient from "./ProductsPortalClient";

export default async function ProductsPortal() {
  const productList = await db.select().from(products);
  return <ProductsPortalClient productList={productList} />;
}
