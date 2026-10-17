"use client";

import { Card } from "@/components/ui/card";
import type { CartItem } from "@/lib/types";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  AlertCircle,
  FilePlus,
  Pause,
  Users,
  UserCircle,
  Percent,
  DollarSign,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface OrderCartProps {
  cart: CartItem[];
  selectedTable: string | null;
  selectedFloor: string | null;
  orderType: "dinein" | "takeaway";
  customerType: "loyalty" | "walkin";
  customerName: string;
  billDiscount: number;
  billDiscountType: "percentage" | "amount";
  onUpdateQuantity: (
    id: string,
    portion: "medium" | "large",
    quantity: number,
  ) => void;
  onUpdateItemDiscount: (
    id: string,
    portion: "medium" | "large",
    discount: number,
    type: "percentage" | "amount",
  ) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onNewBill: () => void;
  onHoldBill: () => void;
  onCustomerTypeChange: (type: "loyalty" | "walkin") => void;
  onCustomerNameChange: (name: string) => void;
  onBillDiscountChange: (discount: number) => void;
  onBillDiscountTypeChange: (type: "percentage" | "amount") => void;
  calculateTotal: () => number;
}

export function OrderCart({
  cart,
  selectedTable,
  selectedFloor,
  orderType,
  customerType,
  customerName,
  billDiscount,
  billDiscountType,
  onUpdateQuantity,
  onUpdateItemDiscount,
  onCheckout,
  onNewBill,
  onHoldBill,
  onCustomerTypeChange,
  onCustomerNameChange,
  onBillDiscountChange,
  onBillDiscountTypeChange,
  calculateTotal,
}: OrderCartProps) {
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [discountItemId, setDiscountItemId] = useState<string | null>(null);
  const [discountItemPortion, setDiscountItemPortion] = useState<
    "medium" | "large"
  >("medium");
  const [itemDiscountValue, setItemDiscountValue] = useState(0);
  const [itemDiscountType, setItemDiscountType] = useState<
    "percentage" | "amount"
  >("percentage");

  const openDiscountDialog = (id: string, portion: "medium" | "large") => {
    const item = cart.find((i) => i.id === id && i.portion === portion);
    if (item) {
      setDiscountItemId(id);
      setDiscountItemPortion(portion);
      setItemDiscountValue(item.itemDiscount || 0);
      setItemDiscountType(item.itemDiscountType || "percentage");
      setShowDiscountDialog(true);
    }
  };

  const applyItemDiscount = () => {
    if (discountItemId) {
      onUpdateItemDiscount(
        discountItemId,
        discountItemPortion,
        itemDiscountValue,
        itemDiscountType,
      );
      setShowDiscountDialog(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.portionPrice * item.quantity;
  }, 0);

  const itemDiscounts = cart.reduce((sum, item) => {
    if (item.itemDiscount) {
      const itemTotal = item.portionPrice * item.quantity;
      if (item.itemDiscountType === "percentage") {
        return sum + (itemTotal * item.itemDiscount) / 100;
      } else {
        return sum + item.itemDiscount;
      }
    }
    return sum;
  }, 0);

  const afterItemDiscounts = subtotal - itemDiscounts;

  let billDiscountAmount = 0;
  if (billDiscount) {
    if (billDiscountType === "percentage") {
      billDiscountAmount = (afterItemDiscounts * billDiscount) / 100;
    } else {
      billDiscountAmount = billDiscount;
    }
  }

  const total = calculateTotal();

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-900 text-lg font-semibold">
            Current Order
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onNewBill}
              className="h-8"
            >
              <FilePlus className="size-3 mr-1" />
              New
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onHoldBill}
              disabled={cart.length === 0}
              className="h-8"
            >
              <Pause className="size-3 mr-1" />
              Hold
            </Button>
          </div>
        </div>

        {/* Customer Type Selection */}
        <div className="mb-3">
          <Label className="text-slate-600 text-sm mb-1 block">
            Customer Type
          </Label>
          <div className="flex gap-2">
            <Button
              variant={customerType === "walkin" ? "default" : "outline"}
              size="sm"
              onClick={() => onCustomerTypeChange("walkin")}
              className={
                customerType === "walkin"
                  ? "bg-orange-500 hover:bg-orange-600 flex-1 h-8"
                  : "flex-1 h-8"
              }
            >
              <Users className="size-3 mr-2" />
              Walk-in
            </Button>
            <Button
              variant={customerType === "loyalty" ? "default" : "outline"}
              size="sm"
              onClick={() => onCustomerTypeChange("loyalty")}
              className={
                customerType === "loyalty"
                  ? "bg-orange-500 hover:bg-orange-600 flex-1 h-8"
                  : "flex-1 h-8"
              }
            >
              <UserCircle className="size-3 mr-2" />
              Loyalty
            </Button>
          </div>
        </div>

        {/* Customer Name Input */}
        {customerType === "loyalty" && (
          <div className="mb-3">
            <Label
              htmlFor="customerName"
              className="text-slate-600 text-sm mb-1 block"
            >
              Customer Name
            </Label>
            <Input
              id="customerName"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="h-8"
            />
          </div>
        )}

        {selectedTable && selectedFloor && orderType === "dinein" && (
          <div className="bg-orange-50 text-orange-700 text-sm px-3 py-2 rounded-lg border border-orange-100">
            {selectedFloor} - Table: {selectedTable}
          </div>
        )}

        {orderType === "takeaway" && (
          <div className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg border border-blue-100">
            Take Away Order
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4 bg-slate-50">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <ShoppingCart className="size-16 mb-4" />
            <p className="text-slate-500">No items in order</p>
            <p className="text-slate-400 text-sm">Add items from the menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item, index) => {
              const itemTotal = item.portionPrice * item.quantity;
              let itemDiscountAmount = 0;

              if (item.itemDiscount) {
                if (item.itemDiscountType === "percentage") {
                  itemDiscountAmount = (itemTotal * item.itemDiscount) / 100;
                } else {
                  itemDiscountAmount = item.itemDiscount;
                }
              }

              const itemFinalPrice = itemTotal - itemDiscountAmount;

              return (
                <Card
                  key={`${item.id}-${item.portion}-${index}`}
                  className="p-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-slate-900 text-sm truncate">
                            {item.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {item.portion}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-sm">
                          Rs. {item.portionPrice.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        {item.itemDiscount && item.itemDiscount > 0 ? (
                          <>
                            <div className="text-slate-900 text-sm">
                              Rs. {itemFinalPrice.toFixed(2)}
                            </div>
                            <div className="text-green-600 text-xs">
                              -Rs. {itemDiscountAmount.toFixed(2)}
                            </div>
                          </>
                        ) : (
                          <div className="text-slate-900 text-sm">
                            Rs. {itemFinalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              item.portion,
                              item.quantity - 1,
                            )
                          }
                          className="size-8 p-0"
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              item.portion,
                              item.quantity + 1,
                            )
                          }
                          className="size-8 p-0"
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>

                      <Button
                        variant={
                          item.itemDiscount && item.itemDiscount > 0
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          openDiscountDialog(item.id, item.portion)
                        }
                        className="h-8"
                      >
                        <Tag className="size-3 mr-1" />
                        {item.itemDiscount && item.itemDiscount > 0
                          ? `Disc: ${
                              item.itemDiscountType === "percentage"
                                ? `${item.itemDiscount}%`
                                : `Rs. ${item.itemDiscount}`
                            }`
                          : "Disc"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.portion, 0)
                        }
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      {cart.length > 0 && (
        <div className="border-t border-slate-200 bg-white p-4 space-y-4">
          {/* Bill Discount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-slate-600 text-sm">Bill Discount</Label>
              <Tabs
                value={billDiscountType}
                onValueChange={(v) =>
                  onBillDiscountTypeChange(v as "percentage" | "amount")
                }
              >
                <TabsList className="h-7">
                  <TabsTrigger value="percentage" className="text-xs h-6 px-3">
                    %
                  </TabsTrigger>
                  <TabsTrigger value="amount" className="text-xs h-6 px-3">
                    Rs.
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Input
              type="number"
              min="0"
              placeholder={billDiscountType === "percentage" ? "0" : "0.00"}
              value={billDiscount || ""}
              onChange={(e) => onBillDiscountChange(Number(e.target.value))}
              className="h-8"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            {itemDiscounts > 0 && (
              <div className="flex justify-between text-green-600 text-sm">
                <span>Item Discounts</span>
                <span>-Rs. {itemDiscounts.toFixed(2)}</span>
              </div>
            )}
            {billDiscount > 0 && (
              <div className="flex justify-between text-green-600 text-sm">
                <span>
                  Bill Discount{" "}
                  {billDiscountType === "percentage" ? `(${billDiscount}%)` : ""}
                </span>
                <span>-Rs. {billDiscountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200 text-slate-900 font-medium">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          {!selectedTable && orderType === "dinein" ? (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="size-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                Please select a floor and table to proceed
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="sm"
              onClick={onCheckout}
            >
              Proceed to Payment
            </Button>
          )}
        </div>
      )}

      {/* Item Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Item Discount</DialogTitle>
            <DialogDescription className="text-slate-600">
              Apply discount to this item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700 text-sm mb-2 block">
                Discount Type
              </Label>
              <Tabs
                value={itemDiscountType}
                onValueChange={(v) =>
                  setItemDiscountType(v as "percentage" | "amount")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="percentage" className="text-sm">
                    <Percent className="size-3 mr-2" />
                    Percentage
                  </TabsTrigger>
                  <TabsTrigger value="amount" className="text-sm">
                    <DollarSign className="size-3 mr-2" />
                    Amount (Rs.)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <Label
                htmlFor="discountValue"
                className="text-slate-700 text-sm mb-2 block"
              >
                Discount{" "}
                {itemDiscountType === "percentage" ? "Percentage" : "Amount"}
              </Label>
              <Input
                id="discountValue"
                type="number"
                min="0"
                placeholder={
                  itemDiscountType === "percentage"
                    ? "Enter percentage"
                    : "Enter amount"
                }
                value={itemDiscountValue || ""}
                onChange={(e) => setItemDiscountValue(Number(e.target.value))}
                className="h-8"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDiscountDialog(false)}
                className="flex-1 h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={applyItemDiscount}
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-8"
              >
                Apply Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
