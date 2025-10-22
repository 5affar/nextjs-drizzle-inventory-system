import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import LoadingButton from "./LoadingButton";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface OrderItem {
  productId: string;
  quantity: string;
}

interface OrderCreationProps {
  onClose: () => void;
  onSuccess: () => void;
  productList: Product[];
}

export default function OrderCreation({ onClose, onSuccess, productList }: OrderCreationProps) {
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{ productId: "", quantity: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const getSelectedProduct = (productId: string): Product | null => {
    return productList.find(p => p.id.toString() === productId) || null;
  };

  const calculateLineTotal = (productId: string, quantity: string): number => {
    const product = getSelectedProduct(productId);
    const qty = parseInt(quantity) || 0;
    return product ? product.price * qty : 0;
  };

  const calculateOrderTotal = (): number => {
    return items.reduce((total, item) => {
      return total + calculateLineTotal(item.productId, item.quantity);
    }, 0);
  };

  const validateForm = (): string | null => {
    if (!customerName.trim()) {
      return "Customer name is required";
    }

    if (items.length === 0) {
      return "At least one item is required";
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productId) {
        return `Please select a product for item ${i + 1}`;
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        return `Please enter a valid quantity for item ${i + 1}`;
      }

      const product = getSelectedProduct(item.productId);
      const requestedQty = parseInt(item.quantity);
      
      if (product && requestedQty > product.stock) {
        return `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${requestedQty}`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: customerName.trim(),
        notes: notes.trim() || undefined,
        items: items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create order");
      }
    } catch (err) {
      setError("Failed to create order");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 align-items-center">
          <h2 className="text-xl font-bold">Create New Order</h2>
          <button className="px-2 py-2 rounded-md hover:bg-gray-100" onClick={onClose}>
            <X className="text-red-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border border-gray-400 p-2 rounded-md w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border border-gray-400 p-2 rounded-md w-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, "productId", e.target.value)}
                      className="border border-gray-400 p-2 rounded-md w-full"
                      required
                    >
                      <option value="">Select a product</option>
                      {productList.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.price.toFixed(2)} (Stock: {product.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className="border border-gray-400 p-2 rounded-md w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Line Total
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      ${calculateLineTotal(item.productId, item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="text-xl font-bold">
                Order Total: ${calculateOrderTotal().toFixed(2)}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            {loading ? (
              <LoadingButton type="submit" text="Creating Order..." />
            ) : (
              <PrimaryButton name="Create Order" type="submit" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}