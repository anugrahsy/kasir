"use client";

import type { MenuItem } from "@/lib/types";
import { menuItems } from "@/lib/menu-data";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Search, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface MenuGridProps {
  selectedCategory: string;
  onAddToCart: (item: MenuItem, portion: "medium" | "large") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MenuGrid({
  selectedCategory,
  onAddToCart,
  searchQuery,
  onSearchChange,
}: MenuGridProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showPortionDialog, setShowPortionDialog] = useState(false);

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    const searchMatch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode?.includes(searchQuery);

    return categoryMatch && searchMatch;
  });

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setShowPortionDialog(true);
  };

  const handleAddWithPortion = (portion: "medium" | "large") => {
    if (selectedItem) {
      onAddToCart(selectedItem, portion);
      setShowPortionDialog(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name, code, or barcode..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <ScanBarcode className="w-5 h-5 mr-2" />
          Scan Barcode
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative h-28 overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3">
              <h3 className="mb-1">{item.name}</h3>
              <p className="text-gray-400 text-xs">Code: {item.code}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Portion Selection Dialog */}
      <Dialog open={showPortionDialog} onOpenChange={setShowPortionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Portion Size</DialogTitle>
            <DialogDescription>
              Choose the portion size for your order
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="mb-2">{selectedItem.name}</h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleAddWithPortion("medium")}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <div>Medium Portion</div>
                      <p className="text-gray-500 text-sm">Regular size</p>
                    </div>
                    <div className="text-orange-500">
                      Rs. {selectedItem.price.toFixed(2)}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAddWithPortion("large")}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <div>Large Portion</div>
                      <p className="text-gray-500 text-sm">1.5x size</p>
                    </div>
                    <div className="text-orange-500">
                      Rs. {(selectedItem.price * 1.5).toFixed(2)}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
