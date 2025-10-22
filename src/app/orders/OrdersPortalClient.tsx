"use client";

import { useState } from "react";
import PrimaryIconButton from "../../components/PrimaryIconButton";
import OrderCreation from "../../components/OrderCreation";
import OrdersTable from "../../components/OrdersTable";
import OrderDetail from "../../components/OrderDetail";
import { Plus } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  createdAt: Date | null;
};

type ModalState = null | "create" | "detail";

export default function OrdersPortalClient({ productList }: { productList: Product[] }) {
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateOrder = () => {
    setActiveModal("create");
  };

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setActiveModal("detail");
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedOrderId(null);
  };

  const handleOrderCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold">Orders Portal</div>
        <PrimaryIconButton 
          buttonIcon={Plus} 
          onClick={handleCreateOrder} 
        />
      </div>

      <div className="space-y-6">
        <OrdersTable 
          onViewOrder={handleViewOrder}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {activeModal === "create" && (
        <OrderCreation
          onClose={handleCloseModal}
          onSuccess={handleOrderCreated}
          productList={productList}
        />
      )}

      {activeModal === "detail" && selectedOrderId && (
        <OrderDetail
          orderId={selectedOrderId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}