import { Api } from '@/api/api';
const apis = new Api();
const api = apis.useHttp();

// 下载审批文件
export const downFile = (params: { id: number }): Promise<Blob> => api.get('/poboRemitterAccount/download', { params, responseType: 'blob' });

export const poboRemitDown = (params: { id: number }): Promise<Blob> => api.get('/poboRemit/download', { params, responseType: 'blob' });

export const poboPayeeAccountDown = (params: { id: number }): Promise<Blob> =>
    api.get('/PoboPayeeAccount/download', { params, responseType: 'blob' });

export const poboRemitExcel = (params: {
    // 汇款订单-导出excel
    accountId: string;
    orderNo: string;
    pageNo: number;
    pageSize: number;
    state: number | null;
}): Promise<Blob> => api.post('/poboRemit/excel', params, { responseType: 'blob' });

export const ditchRemitExcel = (params: {
    // 渠道汇款订单-导出excel
    orderNumber: string; // 渠道订单
    partnerOrderNumber: string; // 订单号
    receiverId: string; // 收款人ID
    remitterId: string; // 汇款人ID
    state: string | null; // 状态：AUDITING-审核中 REJECT-驳回 REMITTED-已汇出 REMITTING-汇款中 REFUND-已退款 CLOSED-已关闭 RECEIVE_ABNORMAL-收款异常
}): Promise<Blob> => api.post('/ditchRemit/excel', params, { responseType: 'blob' });

// koipy 账务明细导出
export const ditchFinanceKoipyExport = (params: {
    accountId: string; // 用户UID
    businessType: null | number; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
    cardNumber: string; // 卡号
    direction: null | number; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
    ditchCardId: string; // 渠道卡ID
    ditchSerialNo: string; // 渠道交易ID
    ditchTransactionId: string; // 交易关联ID
    entryBeginTime: string; // 入账开始时间
    entryEndTime: string; // 入账结束时间
    orderStatus: null | string; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
    orderType: null | string; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
    transactionAmount: string; // 交易金额
    transactionBeginTime: string; // 交易开始时间
    transactionEndTime: string; // 交易结束时间
    pageSize: number; // 每页条数
    pageNo: number; // 页数
}): Promise<Blob> => api.post('/ditchFinanceKoipy/export', params, { responseType: 'blob' });

// reap 账务明细导出
export const ditchFinanceReapExport = (params: {
    accountId: string; // 账户ID
    businessType: number; // 业务类型
    cardNumber: string; // 卡号
    direction: number; // 方向
    ditchCardId: string; // 丢弃卡ID
    ditchSerialNo: string; // 丢弃序列号
    ditchTransactionId: string; // 丢弃交易ID
    entryTimeBegin: string; // 进入时间开始
    entryTimeEnd: string; // 进入时间结束
    orderStatus: number; // 订单状态
    orderType: number; // 订单类型
    originalTransactionAmount: string; // 原始交易金额
    originalTransactionCurrency: string; // 原始交易货币
    pageNo: number; // 页码
    pageSize: number; // 每页大小
    transactionAmount: string; // 交易金额
    transactionCurrency: string; // 交易货币
    transactionTimeBegin: string; // 交易时间开始
    transactionTimeEnd: string; // 交易时间结束
    transactionUpdateTimeBegin: string; // 交易更新时间开始
    transactionUpdateTimeEnd: string; // 交易更新时间结束
}): Promise<Blob> => api.post('/ditchFinanceReap/export', params, { responseType: 'blob' });

// passto 账务明细导出
export const ditchFinancePasstoExport = (params: {
    accountId: string; // 用户UID
    businessType: null | number; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
    cardNumber: string; // 卡号
    direction: null | number; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
    ditchCardId: string; // 渠道卡ID
    ditchSerialNo: string; // 渠道交易ID
    ditchTransactionId: string; // 交易关联ID
    entryBeginTime: string; // 入账开始时间
    entryEndTime: string; // 入账结束时间
    orderStatus: null | string; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
    orderType: null | string; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
    transactionAmount: string; // 交易金额
    transactionBeginTime: string; // 交易开始时间
    transactionEndTime: string; // 交易结束时间
    customerNo: string; // 客户编号
    accountCardId: string;
    ditchOrderNo: string; // 渠道关联号
    pageSize: number; // 每页条数
    pageNo: number; // 页数
}): Promise<Blob> => api.post('/ditchFinancePassto/export', params, { responseType: 'blob' });

// paytrades 账务明细导出
export const ditchFinancePayExport = (params: {
    accountId: string; // 用户UID
    businessType: null | number; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
    cardNumber: string; // 卡号
    direction: null | number; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
    ditchCardId: string; // 渠道卡ID
    ditchSerialNo: string; // 渠道交易ID
    ditchTransactionId: string; // 交易关联ID
    entryBeginTime: string; // 入账开始时间
    entryEndTime: string; // 入账结束时间
    orderStatus: null | string; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
    orderType: null | string; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
    transactionAmount: string; // 交易金额
    transactionBeginTime: string; // 交易开始时间
    transactionEndTime: string; // 交易结束时间
    customerNo: string; // 客户编号
    accountCardId: string;
    ditchOrderNo: string; // 渠道关联号
    pageSize: number; // 每页条数
    pageNo: number; // 页数
}): Promise<Blob> => api.post('/ditchFinancePaytrades/export', params, { responseType: 'blob' });

// 导出paytrades结算
export const exportSettlementList = (params: {
    accountCardId: string; // 卡id
    authorizationStatus: null | '交易成功' | '交易失败'; // 预授权交易状态: 交易成功 交易失败
    cardNumber: string; // 卡号
    cardStatus: null | 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // 卡片状态,可用值:ACTIVE,INACTIVE,BLOCKED
    ditchCardId: string; // 渠道卡id
    endTime: string; // 结束时间
    id: string; // 主键ID
    internalCardId: string; // 内部卡id
    pageNo: number; // 页码
    pageSize: number; // 页面大小
    settlementStatus: null | '交易成功' | '交易处理中'; // 结算状态,可用值:交易成功,交易处理中
    startTime: string; // 开始时间
    status: null | 'PENDING' | 'SUCCESS' | 'FAILED'; // 结算交易状态,可用值:PENDING,SUCCESS,FAILED
    token?: string; // 卡片Token
    transactionId: string; // 交易关联ID
    type?: null | 'DEBIT' | 'CREDIT'; // 结算交易类型,可用值:DEBIT,CREDIT
    uuid?: string; // (渠道交易id)UUID
}): Promise<Blob> => api.post('/ditchFinancePaytrades/exportSettlementList', params, { responseType: 'blob' });

// 导出授权表
export const exportTransactionList = (params: {
    accountCardId: string; // 卡id
    authorizationStatus: null | '交易成功' | '交易失败'; // 预授权交易状态: 交易成功 交易失败
    cardNumber: string; // 卡号
    cardStatus: null | 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // 卡片状态,可用值:ACTIVE,INACTIVE,BLOCKED
    ditchCardId: string; // 渠道卡id
    endTime: string; // 结束时间
    id: string; // 主键ID
    internalCardId: string; // 内部卡id
    pageNo: number; // 页码
    pageSize: number; // 页面大小
    settlementStatus: null | '交易成功' | '交易处理中'; // 结算状态,可用值:交易成功,交易处理中
    startTime: string; // 开始时间
    status: null | 'PENDING' | 'SUCCESS' | 'FAILED'; // 结算交易状态,可用值:PENDING,SUCCESS,FAILED
    token?: string; // 卡片Token
    transactionId: string; // 交易关联ID
    type?: null | 'DEBIT' | 'CREDIT'; // 结算交易类型,可用值:DEBIT,CREDIT
    uuid?: string; // (渠道交易id)UUID
}): Promise<Blob> => api.post('/ditchFinancePaytrades/exportTransactionList', params, { responseType: 'blob' });


// 卡片资金流水导出
export const accountCardAssetLogExport = (params: {
    accountId: string; // 用户ID
    amount: string; // 动账金额
    assetType: null | number; // 资金流水类型
    businessType: null | number; // 业务类型
    cardNumber: string; // 卡号
    childOrderNo: string; // 子订单号
    currency: string; // 币种
    ditchCode: string; // 渠道编码
    endTime: string; // 处理结束,2000-01-02 00:00:00
    mainOrderNo: string; // 主订单号
    orderNo: string; // 流水号
    startTime: string; // 处理开始,2000-01-02 00:00:00
    transactionEndTime: string; // 交易结束时间,2000-01-02 00:00:00
    transactionStartTime: string; // 交易开始时间,2000-01-01 00:00:00
    transactionState: null | number; // 交易状态
    pageSize: number; // 每页条数
    pageNo: number; // 页数
}): Promise<Blob> => api.post('/accountCardAssetLog/export', params, { responseType: 'blob' });

// koipy 授权表导出
export const transactionExport = (params: {
    approvalCode: string; // 授权码
    cardLogId: string; // 内部卡ID
    ditchCardId: string; // 渠道卡ID
    endTime: string; // 结束时间
    orderNo: string; // 订单号
    requestId: string; // 渠道交易ID
    startTime: string; // 开始时间
    state: 1 | 2; // 交易结果:1=完成,2=未完成
    transactionCode: string; // 业务类型
    transactionId: string; // 交易关联ID
    pageNo: number; // 页码
    pageSize: number; // 页面大小
}): Promise<Blob> => api.post('/ditchTransactionKoipy/transactionExport', params, { responseType: 'blob' });

// reap 授权表导出
export const transactionReapExport = (params: {
    authId: string; // Unique identifier for the authorization
    billCurrency: string; // Currency used for billing
    cardId: string; // Identifier for the payment card
    channel: string; // Channel through which the payment was made (e.g., Online)
    endClearedAt: string; // Timestamp when the transaction ended
    endClearedDate: string; // Date when the transaction ended
    endCreatedAt: string; // Timestamp when the transaction was created
    eventName: string; // Name of the event associated with the transaction
    eventType: string; // Type of the event (e.g., Sale)
    lifecycleEventId: string; // Identifier for the lifecycle event
    pageNo: number; // Page number (for pagination)
    pageSize: number; // Size of items per page (for pagination)
    startClearedAt: string; // Timestamp when the transaction started
    startClearedDate: string; // Date when the transaction started
    startCreatedAt: string; // Timestamp when the transaction was created
    status: string; // Status of the transaction (e.g., Completed)
    transactionCurrency: string; // Currency of the transaction
}): Promise<Blob> => api.post('/reap/export', params, { responseType: 'blob' });

// koipy 结算表导出
export const settlementList = (params: {
    approvalCode: string; // 授权码
    cardLogId: string; // 内部卡ID
    ditchCardId: string; // 渠道卡ID
    isCredit: null | 'DEBT' | 'CRED'; // 借贷记 DEBT：借记，CRED：贷记
    occurEndTime: string; // (交易发送)结束时间
    occurStartTime: string; // (交易发生)开始时间
    pageNo: number; // 页码
    pageSize: number; // 页面大小
    postingEndTime: string; // (入账处理)结束时间
    postingStartTime: string; // (入账处理)开始时间
    serialNo: string; // 渠道交易ID
    state: 1 | 2; // 交易结果:1=完成,2=未完成
    sysEndTime: string; // (渠道入账)结束时间
    sysStartTime: string; // (渠道入账)开始时间
    transactionCode: string; // 业务类型
    transactionId: string; // 交易关联ID
}): Promise<Blob> => api.post('/ditchTransactionKoipy/settlementExport', params, { responseType: 'blob' });

// passto-列表导出
export const passtoExport = (params: {
    cardNumber: '';
    customerNo: '';
    ditchCardId: '';
    recordId: ''; // 交易关联ID
    uniqueCode: ''; // 渠道交易ID
    type: null; // 业务类型
    activeType: null; // 交易类型
    status: null; // 交易状态
    operateType: null; // 收支类型
    beginTime: [];
    tradeTime: [];
    updateTime: [];
}): Promise<Blob> => api.post('/passto/export', params, { responseType: 'blob' });

// va用户资金账户列表导出
export const userAssetExcelWriter = (params: {
    currency: string; // 账户币种类型
    endTime: string; // 结束时间
    externalAccount: string; // 外部账户（账户号）
    internalAccount: string; // 内部账户
    labelId: null | string; // 用户标签ID
    startTime: string; // 开始时间
    state: null | 1 | 2 | 3; // 状态 1、正常 2、冻结 3、销户
    userId: string; // 用户ID
}): Promise<Blob> => api.get('/va/bill/vaUserAssetList/excelWriter', { params, responseType: 'blob' });

// va 用户资金流水表导出
export const vaUserAssetLogListExport = (params: {
    pageNo: number; // 页数
    pageSize: number; // 条数
    currency: string; // 账户币种类型
    endTime: string; // 结束时间
    opType: null | string; // 动账类型
    internalAccount: string; // 内部账户
    orderNo: string; // 用户标签ID
    startTime: string; // 开始时间
    state: null | 1 | 2 | 3; // 状态 1、正常 2、冻结 3、销户
    userId: string; // 用户ID
    toCurrency: string; // 到账币种
}): Promise<Blob> => api.get('/va/bill/vaUserAssetLogList/excelWriter', { params, responseType: 'blob' });

// VA 平台资金账户表导出
export const vaPlatformAssetListExport = (params: {
    pageNo: number; // 页数
    pageSize: number; // 条数
    accountType: string; // 账户类型
    channelAccountId: string; // 渠道账户ID
    currency: string; // 账户币种
    endTime: string; // 结束时间
    internalAccount: string; // 账户ID
    startTime: string; // 开始时间
}): Promise<Blob> => api.get('/va/bill/vaPlatformAssetList/excelWriter', { params, responseType: 'blob' });

// va用户资金账户快照导出
export const vaUserAssetSnapshotExport = (params: {
    pageNo: number; // 页数
    pageSize: number; // 条数
    currency: string; // 账户币种类型
    endTime: string; // 结束时间
    externalAccount: string; // 外部账户（账户号）
    internalAccount: string; // 内部账户
    labelId: string; // 用户标签ID
    startTime: string; // 开始时间
    state: 1 | 2 | 3; // 状态 1、正常 2、冻结 3、销户
    userId: string; // 用户ID
}): Promise<Blob> => api.get('/va/bill/vaUserAssetSnapshot/excelWriter', { params, responseType: 'blob' });

// va平台资金账户表导出
export const vaPlatformAssetSnapshotExport = (params: {
    pageNo: string; // 页数
    pageSize: number; // 条数
    accountType: string | null; // 账户类型
    channelAccountId: string; // 渠道账户ID
    currency: string | null; // 账户币种
    endTime: string; // 结束时间
    internalAccount: string; // 账户ID
    startTime: string; // 开始时间
}): Promise<Blob> => api.get('/va/bill/vaPlatformAssetSnapshot/excelWriter', { params, responseType: 'blob' });

// va渠道资金账户快照导出
export const vaChannelAssetSnapshot = (params: {
    pageNo: string; // 页数
    pageSize: number; // 条数
    accountType: string | null; // 账户类型
    channelAccountId: string; // 渠道账户ID
    currency: string | null; // 账户币种
    endTime: string; // 结束时间
    internalAccount: string; // 账户ID
    startTime: string; // 开始时间
}): Promise<Blob> => api.get('/va/bill/vaChannelAssetSnapshot/excelWriter', { params, responseType: 'blob' });

// va用户资金日切表导出
export const vaUserAssetLogCutListExport = (params: {
    pageNo: number; // 页数
    pageSize: number; // 条数
    currency: string; // 账户币种
    endTime: string; // 结束时间
    internalAccount: string; // 内部账户
    opType: string; // 动账类型
    orderNo: string; // 订单号
    startTime: string; // 开始时间
    toCurrency: string; // 到账户币种
    userId: string; // 用户ID
}): Promise<Blob> => api.get('/va/bill/vaUserAssetLogCutList/excelWriter', { params, responseType: 'blob' });

// va用户平台自己账户表日切导出
export const vaPlatformAssetCutListExport = (params: {
    pageNo: number; // 页数
    pageSize: number; // 条数
    currency: string; // 账户币种
    endTime: string; // 结束时间
    internalAccount: string; // 内部账户
    orderNo: string; // 订单号
    startTime: string; // 开始时间
    toCurrency: string; // 到账户币种
}): Promise<Blob> => api.get('/va/bill/vaPlatformAssetCutList/excelWriter', { params, responseType: 'blob' });

// oe账务明细-导出
export const oeExport = (params: {
    pageNo: number; // 页数
    pageSize: number; // 条数
    accountId: string; // 用户UID
    businessType: number | null; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
    cardNumber: string; // 卡号
    direction: number | null; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
    ditchCardId: string; // 渠道卡ID
    ditchSerialNo: string; // 渠道交易ID
    ditchTransactionId: string; // 交易关联ID
    entryTimeBegin: string; // 入账时间(开始)[时间戳]
    entryTimeEnd: string; // 交易更新时间(结束)[时间戳]
    orderStatus: number; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
    orderType: number | null; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
    originalTransactionAmount: string; // 原始交易金额(参考接口:/v1/ditchFinanceOe/getOriginalTransactionCurrency)
    originalTransactionCurrency: string; // 原始交易币种
    transactionAmount: string; // 交易金额
    transactionCurrency: string; // 交易币种(参考接口:/v1/ditchFinanceOe/getTransactionCurrency)
    transactionTimeBegin: string; // 交易时间(开始)[时间戳]
    transactionTimeEnd: string; // 交易结束时间(结束)[时间戳]
    transactionUpdateTimeBegin: string; // 交易更新时间(开始)[时间戳]
    transactionUpdateTimeEnd: string; // 交易更新时间(结束)[时间戳]
}): Promise<Blob> => api.post('/ditchFinanceOe/export', params, { responseType: 'blob' });

// oe渠道原始数据-列表导出
export const ditchFinanceOeExport = (params: {
    cardNumber: string; // 卡号
    currency: string; // 交易币种
    pageNo: number; // 页码
    pageSize: number; // 页面大小
    status: string; // 交易状态,可用值:交易成功,交易失败
    tradeId: string; // 渠道交易 ID
    type: string; // 交易类型 :消费授权,消费授权冲正,退款授权,退款授权冲正,授权查询
    businessDateBegin: string;
    businessDateEnd: string;
    transactionTimeBegin: string;
    transactionTimeEnd: string;
}): Promise<Blob> => api.post('/ditchFinanceOe/transactionList/export', params, { responseType: 'blob' });

// paytrades赎回列表
export const exportRedemptionListExport = (params: {
    accountNo: string; // 账户号
    currencyCode: string; // 交易币种
    ditchCardId: string; // 渠道卡id
    endTime: string; // 结束时间
    internalCardId: string; // 内部卡id
    pageNo: number; // 页码
    pageSize: number; // 页面大小
    startTime: string; // 开始时间
    transactionId: string; // (交易关联) ID
    type: 1 | 2 | null; // 业务类型,可用值:充值赎回 赎回手续费
    uuid: string; // UUID(渠道交易id)
}) => api.post('/ditchFinancePaytrades/exportRedemptionList', params, { responseType: 'blob' });

export const uploadFile = (params: { file: string; fileType: number }): Promise<any> => {
    return api.post('/file/upload', params, {
        headers: { Accept: 'application/json, ext/plain' },
    });
};
