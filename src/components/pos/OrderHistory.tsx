"use client";

import type { Order } from "@/lib/types";
import {
  Clock,
  CheckCircle2,
  Receipt,
  Play,
  Trash2,
  Pause,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface OrderHistoryProps {
  orders: Order[];
  holdOrders: Order[];
  onResumeBill: (order: Order) => void;
  onDeleteBill: (orderId: string) => void;
}

export function OrderHistory({
  orders,
  holdOrders,
  onResumeBill,
  onDeleteBill,
}: OrderHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2>Orders</h2>
        <p className="text-gray-500">Manage orders and bills</p>
      </div>

      <Tabs defaultValue="completed" className="flex-1 flex flex-col">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="completed">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="hold">
              <Pause className="w-4 h-4 mr-2" />
              On Hold ({holdOrders.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="completed" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Receipt className="w-16 h-16 mb-4" />
                  <p>No completed orders yet</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{order.id}</h3>
                          <Badge variant="default">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {order.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500 text-sm">
                            {order.orderType === "dinein" ? (
                              <>
                                {order.floor} - Table: {order.table}
                              </>
                            ) : (
                              <span className="text-blue-600">Take Away</span>
                            )}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {order.customerType === "loyalty" ? (
                              <span className="text-orange-600">
                                Loyalty Customer
                              </span>
                            ) : (
                              <span>Walk-in Customer</span>
                            )}
                            {order.customerName && ` - ${order.customerName}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-500">
                          Rs. {order.total.toFixed(2)}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {order.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.quantity}x {item.name} ({item.portion})
                            {item.itemDiscount && item.itemDiscount > 0 && (
                              <span className="text-green-600 ml-1">
                                -{item.itemDiscount}%
                              </span>
                            )}
                          </span>
                          <span className="text-gray-900">
                            Rs.{" "}
                            {(
                              item.portionPrice *
                              item.quantity *
                              (1 - (item.itemDiscount || 0) / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {order.billDiscount && order.billDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 pt-2 border-t">
                          <span>Bill Discount ({order.billDiscount}%)</span>
                          <span>Applied</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="hold" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              {holdOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Pause className="w-16 h-16 mb-4" />
                  <p>No bills on hold</p>
                </div>
              ) : (
                holdOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{order.id}</h3>
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            On Hold
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500 text-sm">
                            {order.orderType === "dinein" ? (
                              <>
                                {order.floor} - Table: {order.table}
                              </>
                            ) : (
                              <span className="text-blue-600">Take Away</span>
                            )}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {order.customerType === "loyalty" ? (
                              <span className="text-orange-600">
                                Loyalty Customer
                              </span>
                            ) : (
                              <span>Walk-in Customer</span>
                            )}
                            {order.customerName && ` - ${order.customerName}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-500">
                          Rs. {order.total.toFixed(2)}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {order.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-amber-200 pt-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.quantity}x {item.name} ({item.portion})
                          </span>
                          <span className="text-gray-900">
                            Rs. {(item.portionPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onResumeBill(order)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteBill(order.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
