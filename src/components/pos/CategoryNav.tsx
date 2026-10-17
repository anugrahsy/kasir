"use client";

import { Button } from "@/components/ui/button";
import { Utensils, Coffee, Pizza, IceCream } from "lucide-react";

const categories = [
  { id: "all", label: "All Items", icon: Utensils },
  { id: "appetizers", label: "Appetizers", icon: Pizza },
  { id: "mains", label: "Main Course", icon: Utensils },
  { id: "drinks", label: "Drinks", icon: Coffee },
  { id: "desserts", label: "Desserts", icon: IceCream },
];

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelectCategory(category.id)}
              className={isSelected ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
