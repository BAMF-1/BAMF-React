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
    <div className="p-4 md:p-10 bg-[#2B2B2B] border border-[#423F3E]">
      <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
        <Package className="w-6 h-6 md:w-7 md:h-7 text-gray-300" strokeWidth={2} />
        <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
          Order History
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400 font-mono">
          LOADING ORDER HISTORY...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-2xl font-bold mb-2">NO ORDERS FOUND</p>
          <p>Your past orders will appear here once you've made a purchase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group p-4 md:p-5 cursor-pointer bg-[#171010] hover:-translate-y-2 transition-transform duration-300 border border-[#423F3E] hover:border-[#8B4513]"
            >
              <div className="w-full h-40 bg-[#2B2B2B] border border-[#423F3E] mb-4 flex items-center justify-center group-hover:border-[#8B4513] transition-colors">
                <Package className="w-16 h-16 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold text-lg uppercase tracking-wider">
                      {order.orderNo}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-gray-400 text-sm font-medium">
                        {formatDate(order.createdUtc)}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs font-bold uppercase tracking-widest ${
                          order.status === "Pending"
                            ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700/50"
                            : order.status === "Delivered"
                            ? "bg-green-900/50 text-green-300 border border-green-700/50"
                            : "bg-gray-700/50 text-gray-300 border border-gray-600/50"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-[#423F3E]">
                  <span className="text-gray-400 text-sm font-medium uppercase">
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
      )}
    </div>
  );
};

export default OrderHistory;
