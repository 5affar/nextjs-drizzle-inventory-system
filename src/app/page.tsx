import { db } from "@/lib/db";
import { products, orders, orderItems } from "@/db/schema";
import { count, sum, sql, lt } from "drizzle-orm";
import Link from "next/link";
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

async function getDashboardStats() {
  const [totalProducts] = await db.select({ count: count() }).from(products);
  
  const [totalOrders] = await db.select({ count: count() }).from(orders);
  
  const [revenue] = await db
    .select({ 
      total: sql<number>`COALESCE(SUM(quantity * unit_price), 0)`
    })
    .from(orderItems);
  
  const lowStockProducts = await db
    .select()
    .from(products)
    .where(lt(products.stock, 5))
    .orderBy(products.stock);

  return {
    totalProducts: totalProducts.count,
    totalOrders: totalOrders.count,
    totalRevenue: revenue.total,
    lowStockProducts
  };
}

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory & Orders Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your shop&apos;s key metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Products →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/orders" className="text-green-600 hover:text-green-800 text-sm font-medium">
                View Orders →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.lowStockProducts.length}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              {stats.lowStockProducts.length > 0 && (
                <p className="text-red-600 text-sm font-medium">Needs attention</p>
              )}
            </div>
          </div>
        </div>

        {stats.lowStockProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Low Stock Products (Stock &lt; 5)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`${
                          product.stock === 0 
                            ? 'text-red-600' 
                            : product.stock < 3 
                            ? 'text-orange-600' 
                            : 'text-yellow-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-800' 
                            : product.stock < 3 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50">
              <p className="text-sm text-gray-600">
                Consider restocking these items to avoid running out of inventory.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/products" 
                className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add New Product
              </Link>
              <Link 
                href="/orders" 
                className="block w-full text-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Create New Order
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">• {stats.totalProducts} products in inventory</p>
              <p className="text-sm text-gray-600">• {stats.totalOrders} orders processed</p>
              <p className="text-sm text-gray-600">• ${stats.totalRevenue.toFixed(2)} total revenue</p>
              {stats.lowStockProducts.length > 0 && (
                <p className="text-sm text-red-600">• {stats.lowStockProducts.length} products need restocking</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
