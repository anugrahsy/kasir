export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  barcode?: string;
  code?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  portion: "medium" | "large";
  portionPrice: number;
  itemDiscount?: number;
  itemDiscountType?: "percentage" | "amount";
}

export interface Table {
  id: string;
  name: string;
  status: "free" | "dining" | "waiting" | "payment";
  floor: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  orderType: "dinein" | "takeaway";
  table?: string;
  floor?: string;
  timestamp: Date;
  status: "pending" | "completed" | "hold";
  customerType: "loyalty" | "walkin";
  customerName?: string;
  billDiscount?: number;
  billDiscountType?: "percentage" | "amount";
}
