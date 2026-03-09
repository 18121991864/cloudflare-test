export interface Coupon {
    discountCode: string;
    totalAvailableQuantity: number;
}
// 创建优惠码
export interface CreateDiscountType {
    amount: number;
    businessType: 1 | 2; // 业务类型 1、开卡 2、充值
    cardIds: any[];
    cardType: 1 | 2; // 卡类型 1、全部卡片可用 2、指定卡片可用
    coupons: Coupon[];
    discountName: string;
    discountType: 1 | 2 | 3; // 优惠码类型 1、通用码 2、批量码 3、定向码
    discountWay: 1 | 2 | 3; // 优惠方式内容 1、打折 2、减 3、送
    expirationBegin: string;
    expirationEnd: string;
    grantIds: any[];
    grantType: 1 | 2; // 发放对象 1、标签 2、用户
    id: number;
    orderReachAmount: number;
    receiveNum: number;
}
// 查询优惠码
export interface QueryDiscountType {
    discountName: string;
    discountType: number;
    id: number;
    startTime: string;
    endTime: string;
    state: 1 | 2 | 3 | 4; // 状态 1、审核中 2、进行中 3、审核拒绝（失败） 4、失效
}
// 优惠码列表
export interface CountListData extends Omit<QueryDiscountType, 'startTime' | 'endTime'> {
    createTime: string;
    discountCode: string;
    expirationBegin: string;
    expirationEnd: string;
    info: string;
    totalAvailableQuantity: number;
    totalGrantQuantity: number;
    updateTime: string;
    usdTotalQuantity: number;
}
// 卡片列表
export interface CardList {
    cardName: string;
    cardType: number;
    couponCodes: any[];
    depositCardFee: string;
    ditchCardId: string;
    openCardFee: string;
}

// 卡片详情
export interface CardListInfo {
    cardName: string;
    cardType: number;
    ditchCardId: string;
}

export interface DiscountCode {
    amount: string;
    businessType: number;
    couponCode: string;
    createTime: string;
    discountCode: string;
    discountName: string;
    discountType: number;
    discountWay: number;
    expirationBegin: string;
    expirationEnd: string;
    explainInfo: string;
    id: number;
    orderReachAmount: string;
    receiveNum: number;
    state: number;
    totalAvailableQuantity: number;
    updateTime: string;
    usdTotalQuantity: number;
}

export interface GrantList {
    color: string;
    grantType: number;
    labelId: number;
    name: string;
    userId: string;
}

export interface infolData {
    amount: string;
    businessType: number;
    cardList: CardListInfo[];
    cardType: number;
    checkInfo: string;
    createTime: string;
    discountCodes: DiscountCode[];
    discountName: string;
    discountType: number;
    discountWay: number;
    expirationBegin: number;
    expirationEnd: number;
    grantList: GrantList[];
    grantType: number;
    id: number;
    orderReachAmount: string;
    receiveNum: number;
    state: number;
}
// 优惠码核销列表 参数
export interface CouponWriteOffListParams {
    businessType: number | undefined; // 业务类型 1:开卡 2:充值
    cardId: string | undefined; // 卡片ID
    discountCode: string | undefined; // 优惠码
    endTime: string | undefined; // 结束时间
    orderNo: string | undefined; // 订单号
    orderState: number | undefined; // 订单状态 1:进行中 2:已完成
    startTime: string | undefined; // 开始时间
    uid: string | undefined; // 用户ID
}

// 优惠码核销列表
export interface CouponWriteOffList {
    businessType: number; // 业务类型
    cardName: string; // 卡名称
    cardNo: string; // 卡号
    couponType: number; // 优惠券类型
    discountAmount: string; // 优惠金额
    discountCode: string; // 优惠码
    fee: string; // 费用
    id: number; // ID
    info: string; // 信息
    orderNo: string; // 订单号
    orderState: number; // 订单状态
    payAmount: string; // 支付金额
    totalAmount: string; // 总金额
    uid: string; // 用户ID
    updateTime: string; // 更新时间
}

export interface discountUseListParams {
    discountInfoId: string;
    cardId: string;
    endTime: string;
    startTime: string;
    uid: string;
    labelId: string;
}

export interface discountUseListData {
    cardName: string;
    color: string;
    createTime: string;
    discountAmount: string;
    id: number;
    label: string;
    labelId: string;
    orderNo: string;
    totalAmount: string;
    uid: string;
}
export interface DiscountDxListParams {
    businessType: 1 | 2 | undefined;
    discountCode: string | undefined;
    discountName: string | undefined;
}

export interface DiscountDxList {
    amount: string; // 金额
    businessType: number; // 业务类型
    color: string; // 颜色
    discountCode: string; // 优惠码
    discountInfoId: number; // 优惠信息ID
    discountName: string; // 优惠名称
    discountType: number; // 优惠类型
    discountWay: number; // 优惠方式
    expirationBegin: string; // 开始时间
    expirationEnd: string; // 结束时间
    grantId: number; // 授权ID
    labelName: string; // 标签名称
    orderReachAmount: string; // 订单达到金额
    receiveNum: number; // 接收数量
    state: number; // 状态
    totalAvailableQuantity: number; // 总可用数量
    uid: string; // 用户ID
    usdTotalQuantity: number; // 总使用数量
}
