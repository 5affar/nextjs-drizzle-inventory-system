import { products } from "@/db/schema";
import { db } from "@/lib/db";
import OrdersPortalClient from "./OrdersPortalClient";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  createdAt: Date | null;
};

export default async function OrdersPortal() {
  const productList: Product[] = await db.select().from(products);
  return <OrdersPortalClient productList={productList} />;
}
