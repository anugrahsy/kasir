"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";
import type { Table } from "@/lib/types";

interface TableSelectorProps {
  orderType: "dinein" | "takeaway";
  floors: string[];
  tables: Table[];
  selectedFloor: string | null;
  selectedTable: string | null;
  onOrderTypeChange: (type: "dinein" | "takeaway") => void;
  onSelectFloor: (floor: string) => void;
  onSelectTable: (table: string) => void;
}

const statusConfig = {
  free: {
    label: "Free",
    bgColor: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    selectedColor: "bg-green-600",
  },
  dining: {
    label: "Dining",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    selectedColor: "bg-blue-600",
  },
  waiting: {
    label: "Waiting",
    bgColor: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    selectedColor: "bg-yellow-600",
  },
  payment: {
    label: "Payment",
    bgColor: "bg-red-500",
    hoverColor: "hover:bg-red-600",
    selectedColor: "bg-red-600",
  },
};

export function TableSelector({
  orderType,
  floors,
  tables,
  selectedFloor,
  selectedTable,
  onOrderTypeChange,
  onSelectFloor,
  onSelectTable,
}: TableSelectorProps) {
  const filteredTables = selectedFloor
    ? tables.filter((t) => t.floor === selectedFloor)
    : [];

  return (
    <div className="space-y-4">
      {/* Order Type Selection */}
      <div>
        <Label className="text-gray-600 mb-2 block">Order Type</Label>
        <div className="flex gap-2">
          <Button
            variant={orderType === "dinein" ? "default" : "outline"}
            onClick={() => {
              onOrderTypeChange("dinein");
              onSelectTable("");
              onSelectFloor("");
            }}
            className={
              orderType === "dinein"
                ? "bg-orange-500 hover:bg-orange-600 flex-1"
                : "flex-1"
            }
          >
            <UtensilsCrossed className="w-4 h-4 mr-2" />
            Dine In
          </Button>
          <Button
            variant={orderType === "takeaway" ? "default" : "outline"}
            onClick={() => {
              onOrderTypeChange("takeaway");
              onSelectTable("");
              onSelectFloor("");
            }}
            className={
              orderType === "takeaway"
                ? "bg-orange-500 hover:bg-orange-600 flex-1"
                : "flex-1"
            }
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Take Away
          </Button>
        </div>
      </div>

      {/* Floor and Table Selection for Dine In */}
      {orderType === "dinein" && (
        <>
          {/* Floor Selection */}
          <div>
            <Label className="text-gray-600 mb-2 block">Select Floor</Label>
            <div className="flex gap-2 flex-wrap">
              {floors.map((floor) => (
                <Button
                  key={floor}
                  variant={selectedFloor === floor ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onSelectFloor(floor);
                    onSelectTable(""); // Reset table when floor changes
                  }}
                  className={
                    selectedFloor === floor
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }
                >
                  {floor}
                </Button>
              ))}
            </div>
          </div>

          {/* Table Selection */}
          {selectedFloor && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-600">Select Table</Label>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Free</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>Dining</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span>Waiting</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>Payment</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {filteredTables.map((table) => {
                  const config = statusConfig[table.status];
                  const isSelected = selectedTable === table.id;

                  return (
                    <button
                      key={table.id}
                      onClick={() => onSelectTable(table.id)}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        isSelected
                          ? config.selectedColor
                          : `${config.bgColor} ${config.hoverColor}`
                      }`}
                    >
                      {table.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
