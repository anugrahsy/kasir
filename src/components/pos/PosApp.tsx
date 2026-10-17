"use client";

import { useState } from "react";
import { MenuGrid } from "./MenuGrid";
import { OrderCart } from "./OrderCart";
import { CategoryNav } from "./CategoryNav";
import { TableSelector } from "./TableSelector";
import { OrderHistory } from "./OrderHistory";
import { PaymentModal } from "./PaymentModal";
import { UtensilsCrossed, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuItem, CartItem, Table, Order } from "@/lib/types";

export function PosApp() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderType, setOrderType] = useState<"dinein" | "takeaway">("dinein");
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [holdOrders, setHoldOrders] = useState<Order[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customerType, setCustomerType] = useState<"loyalty" | "walkin">(
    "walkin",
  );
  const [customerName, setCustomerName] = useState("");
  const [billDiscount, setBillDiscount] = useState(0);
  const [billDiscountType, setBillDiscountType] = useState<
    "percentage" | "amount"
  >("percentage");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock tables with statuses and floors
  const [tables] = useState<Table[]>([
    { id: "T1", name: "T1", status: "free", floor: "Ground Floor" },
    { id: "T2", name: "T2", status: "dining", floor: "Ground Floor" },
    { id: "T3", name: "T3", status: "free", floor: "Ground Floor" },
    { id: "T4", name: "T4", status: "waiting", floor: "Ground Floor" },
    { id: "T5", name: "T5", status: "payment", floor: "Ground Floor" },
    { id: "T6", name: "T6", status: "free", floor: "First Floor" },
    { id: "T7", name: "T7", status: "dining", floor: "First Floor" },
    { id: "T8", name: "T8", status: "free", floor: "First Floor" },
    { id: "T9", name: "T9", status: "free", floor: "Second Floor" },
    { id: "T10", name: "T10", status: "free", floor: "Second Floor" },
  ]);

  const floors = ["Ground Floor", "First Floor", "Second Floor"];

  const addToCart = (item: MenuItem, portion: "medium" | "large") => {
    const portionMultiplier = portion === "large" ? 1.5 : 1;
    const portionPrice = item.price * portionMultiplier;

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.portion === portion,
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.portion === portion
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...prev,
        {
          ...item,
          quantity: 1,
          portion,
          portionPrice,
        },
      ];
    });
  };

  const updateQuantity = (
    id: string,
    portion: "medium" | "large",
    quantity: number,
  ) => {
    if (quantity === 0) {
      setCart((prev) =>
        prev.filter(
          (item) => !(item.id === id && item.portion === portion),
        ),
      );
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.portion === portion
            ? { ...item, quantity }
            : item,
        ),
      );
    }
  };

  const updateItemDiscount = (
    id: string,
    portion: "medium" | "large",
    discount: number,
    type: "percentage" | "amount",
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.portion === portion
          ? {
              ...item,
              itemDiscount: discount,
              itemDiscountType: type,
            }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    setBillDiscount(0);
    setCustomerName("");
    setBillDiscountType("percentage");
  };

  const newBill = () => {
    clearCart();
    setSelectedTable(null);
    setSelectedFloor(null);
    setCustomerType("walkin");
    setOrderType("dinein");
  };

  const holdBill = () => {
    if (cart.length === 0) return;
    if (orderType === "dinein" && (!selectedTable || !selectedFloor)) return;

    const total = calculateTotal();
    const holdOrder: Order = {
      id: `HOLD-${Date.now()}`,
      items: [...cart],
      total,
      orderType,
      table: orderType === "dinein" ? selectedTable || undefined : undefined,
      floor: orderType === "dinein" ? selectedFloor || undefined : undefined,
      timestamp: new Date(),
      status: "hold",
      customerType,
      customerName: customerName || undefined,
      billDiscount: billDiscount || undefined,
      billDiscountType,
    };

    setHoldOrders((prev) => [holdOrder, ...prev]);
    clearCart();
    setSelectedTable(null);
    setSelectedFloor(null);
  };

  const resumeBill = (order: Order) => {
    setCart(order.items);
    setOrderType(order.orderType);
    setSelectedTable(order.table || null);
    setSelectedFloor(order.floor || null);
    setCustomerType(order.customerType);
    setCustomerName(order.customerName || "");
    setBillDiscount(order.billDiscount || 0);
    setBillDiscountType(order.billDiscountType || "percentage");
    setHoldOrders((prev) => prev.filter((o) => o.id !== order.id));
    setShowHistory(false);
  };

  const deleteBill = (orderId: string) => {
    setHoldOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      const itemPrice = item.portionPrice * item.quantity;
      let discountAmount = 0;

      if (item.itemDiscount) {
        if (item.itemDiscountType === "percentage") {
          discountAmount = (itemPrice * item.itemDiscount) / 100;
        } else {
          discountAmount = item.itemDiscount;
        }
      }

      return sum + (itemPrice - discountAmount);
    }, 0);

    let billDiscountAmount = 0;
    if (billDiscount) {
      if (billDiscountType === "percentage") {
        billDiscountAmount = (subtotal * billDiscount) / 100;
      } else {
        billDiscountAmount = billDiscount;
      }
    }

    return subtotal - billDiscountAmount;
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const completeOrder = () => {
    const total = calculateTotal();
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total,
      orderType,
      table: orderType === "dinein" ? selectedTable || undefined : undefined,
      floor: orderType === "dinein" ? selectedFloor || undefined : undefined,
      timestamp: new Date(),
      status: "completed",
      customerType,
      customerName: customerName || undefined,
      billDiscount: billDiscount || undefined,
      billDiscountType,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedTable(null);
    setSelectedFloor(null);
    setCustomerType("walkin");
    setShowPayment(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Menu */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1>Restaurant POS</h1>
                <p className="text-gray-500">Point of Sale System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant={showHistory ? "default" : "outline"}
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="w-4 h-4 mr-2" />
                  Orders
                </Button>
              </div>
              {/* Cashier Profile */}
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                  <span>JD</span>
                </div>
                <div>
                  <p className="text-sm">John Doe</p>
                  <p className="text-xs text-gray-500">Cashier</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Selection */}
          <TableSelector
            orderType={orderType}
            floors={floors}
            tables={tables}
            selectedFloor={selectedFloor}
            selectedTable={selectedTable}
            onOrderTypeChange={setOrderType}
            onSelectFloor={setSelectedFloor}
            onSelectTable={setSelectedTable}
          />
        </div>

        {/* Category Navigation */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Menu Grid */}
        <div className="flex-1 overflow-auto">
          <MenuGrid
            selectedCategory={selectedCategory}
            onAddToCart={addToCart}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Right Panel - Cart or Order History */}
      <div className="w-[420px] border-l bg-white">
        {showHistory ? (
          <OrderHistory
            orders={orders}
            holdOrders={holdOrders}
            onResumeBill={resumeBill}
            onDeleteBill={deleteBill}
          />
        ) : (
          <OrderCart
            cart={cart}
            orderType={orderType}
            selectedTable={selectedTable}
            selectedFloor={selectedFloor}
            customerType={customerType}
            customerName={customerName}
            billDiscount={billDiscount}
            billDiscountType={billDiscountType}
            onUpdateQuantity={updateQuantity}
            onUpdateItemDiscount={updateItemDiscount}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
            onNewBill={newBill}
            onHoldBill={holdBill}
            onCustomerTypeChange={setCustomerType}
            onCustomerNameChange={setCustomerName}
            onBillDiscountChange={setBillDiscount}
            onBillDiscountTypeChange={setBillDiscountType}
            calculateTotal={calculateTotal}
          />
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onComplete={completeOrder}
        total={calculateTotal()}
      />
    </div>
  );
}
