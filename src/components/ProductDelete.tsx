import { useState } from "react";
import { X } from "lucide-react";
import LoadingButton from "./LoadingButton";
import { showSuccessAlert, showErrorAlert } from "../lib/alert";

type Product = { 
  id: string; 
  name: string; 
  sku: string; 
  price: number; 
  stock: number;
  createdAt: Date;
};

interface ProductDeleteProps {
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

export default function ProductDelete({ onClose, onSuccess, product }: ProductDeleteProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: product.id }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        showSuccessAlert('Success!', 'Product deleted successfully!');
      } else {
        const errorData = await response.json();
        showErrorAlert('Whooooops!', errorData.error || 'Failed to delete product');
      }
    } catch (err) {
      showErrorAlert('Whooooops!', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delete Product</h2>
          <button className="px-2 py-2 rounded-md hover:bg-gray-100" onClick={onClose}>
            <X className="text-red-400" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Are you sure you want to delete this product?</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            <p className="text-sm text-gray-600">Price: ${product.price}</p>
          </div>
          <p className="text-red-600 text-sm mt-2">This action cannot be undone.</p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          {loading ? (
            <LoadingButton text="Deleting..." />
          ) : (
            <button
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}