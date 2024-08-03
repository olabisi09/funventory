interface BaseInterface {
  id: number;
  created_at: string;
  active_status: string;
}

interface Response {
  data: any;
  error: any;
}

interface ResponseData {
  status: number;
  statusText: string;
}

interface Payload {
  tableName: string;
  body: any;
}

interface Update extends Payload {
  where: string;
  equals: string | number;
  existingImg?: string
}

interface Delete {
  tableName: string;
  id: number;
  file?: string;
}

interface Product extends BaseInterface {
  product_name: string;
  product_description?: string;
  product_img?: string;
  category_id?: number;
  cost_price: number;
  packaging_cost: number;
  transportation_cost: number;
  other_costs?: number;
  stock_qty: number;
  selling_price: number;
}

interface Category extends BaseInterface {
  category_name: string;
  category_description?: string;
}

interface ProfitView {
  id: number;
  product_name: string;
  cost_price: number;
  packaging_cost: number;
  transportation_cost: number;
  other_costs?: number;
  selling_price: number;
  total_cost: number;
  profit_per_item: number;
}

interface Sales extends BaseInterface {
  product_id: number;
  qty_sold: number;
  sale_date: string;
}

interface SalesView {
  id: number;
  product_name: string;
  cost_price: number;
  packaging_cost: number;
  transportation_cost: number;
  other_costs?: number;
  selling_price: number;
  qty_sold: number;
  total_cost: number;
  profit_per_item: number;
  total_profit: number;
}