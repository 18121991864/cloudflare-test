export interface CancelCardListResList {
  id: number; // "id"
  accountId: string; // "账户id"
  ditchName: string; // "渠道名称"
  ditchId: string; // "渠道id"
  cardType: number; // "卡类型 1-虚拟卡、2-实体卡"
  cardNo: string; // "卡号"
  cardCategory: string; // "卡类别"
  cardModel: string; // "卡模式"
  surname: string; // "姓氏"
  name: string; // "名字"
  status: number; // "状态 1-注销中-2注销成功、3-注销失败、4-已退款"
  statusName: string; // "状态名称"
  showBalance: number; // "显示余额"
  ditchBalance: number; // "渠道余额"
  applyTime: string; // "申请时间"
  isReturn?: number; // "是否退款"
  returnAmount?: string; // "退款金额"
}

export interface CancelCardCommons {
  // 卡号
  cardNo: string;
  // 账户id
  accountId: string;
  // 页面大小
  pageSize: number;
  // 页码
  pageNo: number;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  ditchName: string;
}
export interface CancelCardParams extends CancelCardCommons {
  // 卡类型 1-虚拟卡、2-实体卡
  cardType: 1 | 2;
  // 状态码
  status: 1 | 2 | 3 | 4;
}
export interface AddRefndList {
  cardNo: string;
  surname: string;
  name: string;
  refundSelf: boolean;
  refundAccountId: string;
  showBalance: string;
  isReturnRechargeFee: number;
  isReturn: number;
  returnAmount: string;
  accountId: string;
  firstCheckReason?: string;
  secondCheckReason?: string;
  cardRefundAmount?: string;
}
export interface RefndList {
  // 主键ID
  id: number;
  // 账户id
  accountId: string;
  // 卡号
  cardNo: string;
  // 渠道名称
  ditchName: string;
  // 显示余额
  showBalance: number; // TypeScript中没有BigDecimal，可以使用number或更精确的类型
  // 退款金额
  returnAmount: number; // 同上，根据需要选择类型
  // 类型：1.初审中 2.初审拒绝 3.复审中 4.复审拒绝 5.复审成功 6.退款成功
  type: number;
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  status: number; // 状态
  firstCheckReason: string; // 初审原因，可选字段
  secondCheckReason: string; // 复审原因，可选字段
  reason: string; // 原因，可选字段
}

export interface RefndParams extends CancelCardCommons {
  status: null | 1 | 2 | 3 | 4 | 5 | 6; // 1.初审中 2.初审拒绝 3.复审中 4.复审拒绝 5.复审成功 6.退款成功
}

export interface predictDitchAmount {
  cardNo: string;
  amount: string;
}

export interface RefndFirstCheck {
  firstCheckReason?: string;
  id: number;
  secondCheckReason?: string;
  status: number;
}
