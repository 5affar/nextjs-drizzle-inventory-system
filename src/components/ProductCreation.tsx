import { useState } from "react";
import { X } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import LoadingButton from "./LoadingButton";
import { CreateProductSchema } from "../lib/validations";
import { showSuccessAlert, showErrorAlert } from "../lib/alert";

interface ProductCreationProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductCreation({ onClose, onSuccess }: ProductCreationProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return "Product name is required";
    }
    if (!sku.trim()) {
      return "SKU is required";
    }
    if (!price || parseFloat(price) <= 0) {
      return "Valid price is required";
    }
    if (!stock || parseInt(stock) < 0) {
      return "Valid stock quantity is required";
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
      const formValues = {
        name: name.trim(),
        sku: sku.trim(),
        price: parseFloat(price),
        stock: parseInt(stock)
      };

      const validationResult = CreateProductSchema.safeParse(formValues);

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        setError(firstError.message);
        return;
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        showSuccessAlert('Success!', 'Product added successfully!');
      } else {
        const errorData = await response.json();
        if (errorData.details && Array.isArray(errorData.details)) {
          const errorMessages = errorData.details.map((detail: any) => `${detail.field}: ${detail.message}`).join('\n');
          setError(errorMessages);
        } else {
          setError(errorData.error || "Failed to add product");
        }
      }
    } catch (err) {
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col w-96">
        <div className="flex justify-between items-center mb-4 align-items-center">
          <h2 className="text-xl font-bold">Add Product</h2>
          <button className="px-2 py-2 rounded-md hover:bg-gray-100" onClick={onClose}>
            <X className="text-red-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 p-2 rounded-md w-full"
              placeholder="Product Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="border border-gray-400 p-2 rounded-md w-full"
              placeholder="SKU"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-400 p-2 rounded-md w-full"
              placeholder="Price"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border border-gray-400 p-2 rounded-md w-full"
              placeholder="Quantity"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Form Actions */}
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
              <LoadingButton text="Adding..." type="submit" />
            ) : (
              <PrimaryButton name="Add Product" type="submit" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}