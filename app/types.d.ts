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

interface Delete {
  tableName: string;
  id: number;
  file?: string;
}

interface Product extends BaseInterface {
  productName: string;
  productDescription?: string;
  productImg?: string;
  categoryId?: number;
  costPrice: number;
  packagingCost: number;
  transportationCost: number;
  otherCosts?: number;
  stockQty: number;
  sellingPrice: number;
}

interface Category extends BaseInterface {
  categoryName: string;
  categoryDescription?: string;
}

interface ProfitView {
  id: number;
  productName: string;
  costPrice: number;
  packagingCost: number;
  transportationCost: number;
  otherCosts?: number;
  sellingPrice: number;
  totalcost: number;
  profitperitem: number;
}