"use client";

import { useState } from "react";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import PrimaryIconButton from "../../components/PrimaryIconButton";
import ProductTable from "../../components/ProductTable";
import ProductCreation from "../../components/ProductCreation";
import ProductEdit from "../../components/ProductEdit";
import ProductDelete from "../../components/ProductDelete";
import { useRouter } from "next/navigation";

type Product = { 
    id: string; 
    name: string; 
    sku: string; 
    price: number; 
    stock: number;
    createdAt: Date;
};

type ModalState = null | "create" | "edit" | "delete";

export default function ProductsPortalClient({ productList }: { productList: Product[] }) {
    const [activeModal, setActiveModal] = useState<ModalState>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const router = useRouter();

    const handleCreateProduct = () => {
        setActiveModal("create");
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setActiveModal("edit");
    };

    const handleDeleteProduct = (product: Product) => {
        setSelectedProduct(product);
        setActiveModal("delete");
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        setSelectedProduct(null);
    };

    const handleProductChanged = () => {
        setRefreshTrigger(prev => prev + 1);
        router.refresh();
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold">Products Portal</div>
                <PrimaryIconButton 
                    buttonIcon={Plus} 
                    onClick={handleCreateProduct} 
                />
            </div>

            <div className="space-y-6">
                <ProductTable
                    headers={["Product Name", "SKU", "Price", "Stock","Date Added", "Action"]}
                    rows={productList.map((product) => [
                    <span key={`name-${product.id}`} className="font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</span>,
                        product.sku,
                        product.price,
                        product.stock,
                        product.createdAt.toLocaleDateString(),
                    <span key={`actions-${product.id}`} className="flex gap-1 align-items-center justify-center">
                            <PrimaryIconButton buttonIcon={PencilLine} onClick={() => handleEditProduct(product)} />

                            <span className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline hover:bg-gray-100 p-3 rounded-lg" onClick={() => handleDeleteProduct(product)}>
                                <Trash2 className="h-4 w-4" />
                            </span>
                    </span>
                    ])}
                />
            </div>

            {activeModal === "create" && (
                <ProductCreation
                    onClose={handleCloseModal}
                    onSuccess={handleProductChanged}
                />
            )}

            {activeModal === "edit" && selectedProduct && (
                <ProductEdit
                    onClose={handleCloseModal}
                    onSuccess={handleProductChanged}
                    product={selectedProduct}
                />
            )}

            {activeModal === "delete" && selectedProduct && (
                <ProductDelete
                    onClose={handleCloseModal}
                    onSuccess={handleProductChanged}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}
