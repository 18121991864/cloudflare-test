import type { Ref } from 'vue';

// 新增/修改分类
export interface AddOrUpdateCategory {
  id?: number | '';
  deleted?: number;
  name?: string;
  sort?: number | string;
  state?: number;
}
// 获取商品
export interface ProductList {
  categoryId: string | undefined;
  country?: string;
  ditch?: string;
  ditchProductId?: string;
  ditchSku?: string;
  inputNo?: string;
  pageNo: number;
  pageSize: number;
  productName?: string;
  productNo?: string;
  status?: number | null;
}
export interface Category {
  categoryId: string;
  categoryName: string;
}

export interface ProductListData {
  actualPrice: number;
  categorys: Category[];
  categoryName?: string[];
  categoryId?: string[];
  countryCodes: string;
  countrys: string;
  deliveryMethod: string;
  deliveryMethodPrice: number;
  ditch: string;
  ditchProductId: string;
  ditchSku: string;
  id: string;
  inputNo: string;
  productName: string;
  productNo: string;
  sales: number;
  status: number;
}

export interface ShopOrderParams {
  accountId: string;
  endTime: string;
  orderNo: string;
  pageNo: number;
  pageSize: number;
  productId: string;
  productName: string;
  startTime: string;
  status?: number | '';
}

export interface OrderListData {
  accountId: string;
  createTime: string;
  exchangeRate: string;
  id: string;
  orderInfoList: OrderInfoList[];
  orderNo: string;
  otherOrderId: string;
  otherPublicOrderId: string;
  status: number;
  symbol: string;
  totalPrice: number;
  updateTime: string;
}

export interface OrderInfoList {
  actualAmount: number;
  createAt: string;
  discountAmount: number;
  expiresAt: string;
  facePrice: number;
  giftCardUri: string;
  id: string;
  pinCode: string;
  productId: string;
  productName: string;
  quantity: number;
  sendEmailStatus: string;
  taxAmount: number;
  unitPrice: number;
  showPingCode: Ref<boolean>;
}

export interface CategoryData {
  id: string;
  categoryId: string;
  categoryName: string;
  ditch: string;
  ditchProductId: string;
  ditchSku: string;
  inputNo: string;
  productName: string;
  productNo: string;
}

export interface OrderFlowParams {
  accountId: string;
  endTime: string;
  pageNo: number;
  pageSize: number;
  startTime: string;
}
export interface OrderFlowData {
  accountId: string;
  createTime: string;
  id: string;
  order: string;
  otherPublicOrderId: string;
  symbol: string;
  totalPrice: string;
  transactionDetail: string;
  userLabel: string;
}
