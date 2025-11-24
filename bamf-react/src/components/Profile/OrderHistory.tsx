import { Package, ChevronRight } from "lucide-react";

interface OrderHistoryProps {
  orders: any[];
  isLoading?: boolean;
}

const OrderHistory = ({ orders, isLoading = false }: OrderHistoryProps) => {
  // Calculate total items in an order
  const getTotalItems = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl p-10 bg-[#2B2B2B] border border-[#3a3a3a]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Package className="w-7 h-7 text-gray-300" strokeWidth={2.5} />
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Order History
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No orders found</div>
      ) : (
        <div className="overflow-x-auto -mx-10 px-10">
          <div className="flex gap-5 pb-4 min-w-max">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-5 cursor-pointer bg-[#362222] hover:scale-105 hover:shadow-xl transition-all min-w-[280px] max-w-[280px] border border-[#4a3535]"
              >
                <div className="w-full h-40 bg-[#423F3E] rounded-lg mb-4 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-bold text-lg">
                        {order.orderNo}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-400 text-sm font-medium">
                          {formatDate(order.createdUtc)}
                        </p>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                            order.status === "Pending"
                              ? "bg-[#4a3d2a] text-[#f5d695]"
                              : order.status === "Delivered"
                              ? "bg-[#2d4a2a] text-[#a0d995]"
                              : "bg-[#3a3a3a] text-gray-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-[#423F3E]">
                    <span className="text-gray-400 text-sm font-medium">
                      {getTotalItems(order.items)} items
                    </span>
                    <span className="text-white font-bold text-lg">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
