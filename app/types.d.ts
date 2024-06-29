interface BaseInterface {
  id: number;
  created_at: string;
}

interface Product extends BaseInterface {
  productName: string;
  productDescription?: string;
  productImg?: string;
}

interface Response {
  data: any;
  error: any;
}

interface ResponseData {
  status: number;
  statusText: string;
}

interface CrudPayload {
  tableName: string;
  id: number;
}