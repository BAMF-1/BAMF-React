import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface OrderHistoryProps {
  orders: any[];
  isLoading?: boolean;
}

const OrderHistory = ({ orders, isLoading = false }: OrderHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(1);

  // Update items to show based on screen size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(3); // lg: 3 columns
      } else if (window.innerWidth >= 768) {
        setItemsToShow(2); // md: 2 columns
      } else {
        setItemsToShow(1); // mobile: 1 column
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

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

  // Determine if we need to show the expand button
  const showExpandButton = orders.length > itemsToShow;

  // Get orders to display based on expanded state
  const displayedOrders = isExpanded ? orders : orders.slice(0, itemsToShow);
  const hiddenOrders = orders.slice(itemsToShow);

  return (
    <div className="p-4 md:p-10 bg-[#2B2B2B] border border-[#423F3E]">
      <div className="flex justify-between items-center gap-2 md:gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <Package
            className="w-6 h-6 md:w-7 md:h-7 text-gray-300"
            strokeWidth={2}
          />
          <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
            Order History
          </h2>
        </div>
        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-[#171010] hover:bg-[#423F3E] text-gray-300 hover:text-white border border-[#423F3E] hover:border-[#8B4513] transition-all font-bold uppercase tracking-widest text-xs"
          >
            {isExpanded ? (
              <>
                View Less
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                View More
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
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
          {/* Always visible orders */}
          {orders.slice(0, itemsToShow).map((order) => (
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

          {/* Expandable orders with animation */}
          <div
            className={`col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 transition-all duration-500 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {hiddenOrders.map((order) => (
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
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
