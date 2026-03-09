export interface sinoDitchTransactionLIst {
    approveCode: string; // 授权码
    authId: string; // 交易唯一ID
    cardLogId: string; // 卡ID
    id: string;
    ditchId: string; // 渠道
    messageType: string; // 交易类型
    occurTime: string; // 交易发生时间
    respCode: string; // 交易响应码
    transCurrency: string; // 交易币种
    transCurrencyAmt: string; // 交易金额
    transactionId: string; // 交易ID
    receiveMsg: any; // 详情信息
    authAmount: string; // 授权金额
    authCurrency: string; // 授权币种
    cabin: string; // 卡片模式:Standard:标准卡,ShareBalance:共享卡
    cabinName: string; // 卡片模式:Standard:标准卡,ShareBalance:共享卡
    cardNo: string; // 卡号
    merchantName: string; // 商家
    settleTime: string; // 清算时间
    settledAmount: string; // 清算金额
    settledCurrency: string; // 清算币种
    status: 1 | 2 | 3 | 4 | 5; // 状态:1:处理中,2:已完成,3:处理失败,4-已退回,5-退回失败
    stateName: string; // 状态名称
}
export interface sinoDitchTransactionPrams {
    messageType: string; // 交易类型
    transactionId: string; // 交易ID
    txnId?: string; // 交易唯一ID
    authId?: string; // 交易唯一ID
    cardNo: string; // 卡号
    ditchId: string; // 渠道
    status?: 1 | 2 | 3 | 4 | 5 | ''; // 状态:1:处理中,2:已完成,3:处理失败,4-已退回,5-退回失败
    state?: 1 | 2 | 3 | 4 | 5 | ''; // 状态:1:处理中,2:已完成,3:处理失败,4-已退回,5-退回失败
    occurStartTime?: string; // 开始时间
    occurEndTime?: string; // 结束时间
    pageNo?: number;
    pageSize?: number;
    ditchCode: string;
}

export interface TotalAmout {
    postingAmountTotal: string; // 清算总金额
    transAmountTotal: string; // 交易总金额
}
export interface transferListPrams {
    hash: string;
    orderNo: string; // 订单号
    toAddress: string; // 目标地址
    coinOutStatus: 0 | 1 | 2 | ''; // 钱包提币审核 0待审核中 1可提币 2审核失败
    type: 1 | 2 | ''; // 交易类型 1、充 2、提
    state: 1 | 2 | 3 | 4 | 5 | 6 | 8 | ''; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单 8、充币风控退款
    walletStatus: string; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
    pageNo: number;
    pageSize: number;
    startTime: string;
    endTime: string;
    uid: string;
    riskCoinStatus: 0 | 1 | 2; // 冻结状态：0、全部 1、未冻结 2、冻结中
    riskLevel: 0 | 1 | 2 | 3 | 4; // 风控等级，0、全部 1、低 2、中 3、高 4、严重
    withdrawType?: string | null;
}

export interface transferList {
    amount: string; // 金额
    chainTag: string; // 链
    coinOutStatus: 0 | 1 | 2; // 钱包提币审核 0待审核中 1可提币 2审核失败
    createTime: string;
    ditchName: string; // 渠道
    agentName: string; // 代理商
    cardNo: string; // 卡号
    fromAddress: string; // 源地址
    id: string;
    orderNo: string; // 订单号
    symbol: string; // 币种
    toAddress: string; // 目标地址
    txHash: string;
    type: 1 | 2; // 1、充值 2、提币
    state: 1 | 2 | 3 | 4 | 5 | 6; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单
    walletState: 0; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
    accountId: string; // 用户ID
    agentType: 1 | 2; // 1、平台 2、其他
    depositOrder: string; // 充币订单号
}

export interface withdrawListPrams {
    endTime: string; // 结束时间
    startTime: string; // 开始时间
    orderNo: string; // hash
    hash: string; // 订单号
    state: 0 | 1 | 2 | 3 | 4 | 5 | null; // 状态 1、成功 2、钱包处理中 3、失败 4、审核中 5、审核拒绝
    pageNo: number;
    pageSize: number;
    withdrawType: any;
}
export interface withdrawManualRemark {
    id: string;
    manualRemark: string;
}
export interface withdrawList {
    accountId: string; // 用户ID
    agentType: string; // 1、平台 2、其他
    amount: string; // 总金额
    id: string;
    chainTag: string; // 链
    coinOutStatus: string; // 钱包提币审核状态： 0待审核中 1可提币 2审核失败
    createTime: string; // 创建时间
    state: 1 | 2 | 3 | 4 | 5;
    feeAmount: string; // 平台手续费
    walletFeeAmount: string; // 钱包手续费
    fromAddress: string; // 源地址
    orderNo: string; // 订单号
    symbol: string; // 币种
    check: 1 | 2; // 是否可审核 1、是 2、否
    toAddress: string; // 目标地址
    toAmount: string; // 到账金额
    txHash: string; // hash
    type: string; // 2、提币
    walletState: string; // 钱包状态： waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
    checkState: null | number;
}

export interface withdrawAmountTotal {
    toAmountTotal: string; // 到账总金额
    withdrawAmountTotal: string; // 提现总金额
}

export interface newUserAssetParams {
    /**
     * 资产类型：币种id
     */
    coinId?: string;
    /**
     * 结束金额
     */
    endBalance?: string;
    /**
     * 结束提现冻结金额
     */
    endFrozenBalance?: string;
    /**
     * 结束风控冻结金额
     */
    endManualFrozenBalance?: string;
    /**
     * pageNo.默认值:1
     */
    pageNo: number;
    /**
     * pageSize.默认值:10
     */
    pageSize: number;
    /**
     * 开始金额
     */
    startBalance?: string;
    /**
     * 开始提现冻结金额
     */
    startFrozenBalance?: string;
    /**
     * 开始风控冻结金额
     */
    startManualFrozenBalance?: string;
    /**
     * 用户ID
     */
    userId?: string;
    startRiskFrozenBalance: any;
    endRiskFrozenBalance: any;
}

export interface newUserAssetList {
    userId: string; // 用户ID
    balance: string; // 可用资产
    frozenBalance: string; // 冻结数量
    id: string;
    remarks: string; // 备注
    symbol: string; // 资产类型
}

export interface newUserAmountTotal {
    availableAmountTotal: string; // 可用总金额
    riskAmountTotal: string; // 风控冻结总金额
    withdrawalAmountTotal: string; // 提现冻结金额
    manualAmountTotal: string; // 手工冻结总金额：
    riskFrozenBalance: string; // 风控冻结总金额：
    swapFrozenBalance: string; //闪兑冻结金额
    remitFrozenBalance: string; //汇款业务冻结总金额
}

export interface assetSnapshotParams {
    snapshotType?: null | 0 | 1 | 2; // 快照类型 0、全部 1、自动 2、手动
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    pageNo: number;
    pageSize: number;
    coinId: string;
}
export interface assetSnapshotLIst {
    id: string;
    balance: string; // 可用资产
    createTime: string; // 链id
    chainTag: string; // 链
    coinName: string; // 币种
    snapshotType: 0 | 1 | 2; // 1、自动 2、手动
}

export interface userAssetSnapshotParams {
    type?: null | 1 | 2; //
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    userId?: string; //
    pageNo: number;
    pageSize: number;
}
export interface userAssetSnapshotList {
    id: string;
    balance: string; // 可用资产
    createTime: string; // 快照时间
    frozenBalance: string; // 冻结数量
    remarks: string; // 备注
    symbol: string; // 资产类型
    type: 1 | 2; // 类型:1=自动，2=手动
    typeName: string; // 类型:1=自动，2=手动
    userId: string; // 用户ID
}

export interface AssetSnapshotAmountTotal {
    availableAmountTotal: string; // 可用总金额
    freezeAmountTotal: string; // 冻结金额
}

export interface agentAssetSnapshotListParams {
    type?: null | 1 | 2; //
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    agentId?: string; // 资产人代理商ID
    pageNo: number;
    pageSize: number;
}
export interface agentAssetSnapshotList {
    id: string;
    balance: string; // 可用资产
    createTime: string; // 快照时间
    frozenBalance: string; // 冻结数量
    remarks: string; // 备注
    symbol: string; // 资产类型
    type: 1 | 2; // 类型:1=自动，2=手动
    typeName: string; // 类型:1=自动，2=手动
    userId: string; // 用户ID
}

export interface snapshotListParams {
    type?: null | 1 | 2; //
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    id?: string; //
    pageNo: number;
    pageSize: number;
}
export interface snapshotList {
    id: string;
    accountBalance: string; // 账户余额
    accountCurrency: string; // 账户余额币种
    amount: string; // 余额
    createTime: string; // 快照时间
    ditchId: string; // 渠道ID
    type: 1 | 2; // 类型:1=自动，2=手动
    typeName: string; // 类型:1=自动，2=手动
    name: string; // 名称
}

export interface snapshotListTotalAmount {
    accountBalanceTotal: string; //  	卡账户余额  显示卡余额总数
    balanceTotal: string; // 账户余额   渠道卡余额总数
}

export interface accountCardsnapshotParams {
    type?: null | 1 | 2; //
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    accountId?: string; // 用户ID
    pageNo: number;
    pageSize: number;
}
export interface accountCardsnapshotList {
    id: string;
    accountId: string; // 用户ID
    balance: string; // 余额
    cardNumber: string; // 卡号
    createTime: string; // 快照时间
    symbol: string; // 资产类型
    type: 1 | 2; // 类型:1=自动，2=手动
    typeName: string; // 类型:1=自动，2=手动
}

export interface withdrawLimitList {
    accountId: string; // 用户ID
    coinId: string; // 币id
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
    day: string; // 每天最大限额
    hour: string; // 每笔最大限额
    id: string; // id
    range: string; // 1、全局 2、用户
    singleMax: string; // 每笔最大限额
    singleMin: string; // 每笔最小限额
    state: 1 | 2; // 状态：状态：1=启用，2=禁用
    symbol: string; // 资产类型
}
// 用户新充值记录
export interface newDepositParams {
    accountId: string; //
    agentId: string; //
    amount: number;
    txHash: string;
    fromAddress: string;
    toAddress: string;
    type: number;
    state: number;
    freeze: number | null;
    riskControlLevel: number | null;
    endTimeStamp: string;
    beginTimeStamp: string;
    uid: string;
    pageNo: number;
    pageSize: number;
}

export interface newDepositList {
    accountId: string; // uid
    agentId: string; // 代理商Id
    amount: string; // 金额
}

export interface MarkeParams {
    symbol: '' | 'USDT' | 'BTC'; // "" 全部 USDT.泰达币, BTC.比特币
}
// 使用映射类型来剔除特定的属性
type ExcludeProperties<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: P extends 'id' ? T[P] | undefined : T[P];
};
type IncludeProperties<T, K extends keyof T> = {
    [P in Include<keyof T, K>]: P extends 'id' ? T[P] | undefined : T[P];
};
export interface MarkeParamsList {
    aboutEn: string;
    aboutZh: string;
    createTime: string;
    descriptionEn: string;
    descriptionZh: string;
    descriptionAr: string;
    descriptionRu: string;
    descriptionTw: string;
    id: number;
    logo: string;
    name: string;
    position: number;
    state: number;
    symbol: null | string;
    updateTime: string;
}

export type MarkeParamsListWithoutAdd = ExcludeProperties<
    MarkeParamsList,
    'updateTime' | 'createTime' | 'position' | 'state' | 'aboutEn' | 'aboutZh'
> & {
    sort?: number;
};
export type fiatMarkeParamsListWithoutAdd = IncludeProperties<MarkeParamsList, 'id' | 'logo' | 'name' | 'symbol'>;
export interface Symbols {
    name: string;
    symbol: string;
}

export interface CoinParamsList {
    balance: string; // 钱包余额
    chainTag: string; // 链
    decimals: number; // 小数位
    id: string;
    inStatus: 1 | 0; // 转入状态 1正常 0禁止
    name: string; // 币种全名称
    outStatus: 1 | 0; // 转出状态 1正常 0禁止
    symbol: string; // 币种
    status: 1 | 0; // 状态：状态 1正常 0禁用
    disabled: boolean;
}

// passto 入参
export interface PasstoTransactionParams {
    /** 交易发起时间(开始) */
    tradingStartTime: string;
    /** 交易发起时间(结束) */
    tradingEndTime: string;
    /** 卡号 */
    cardNo: string;
    /** 内部卡id(cardLog ID) */
    internalCardId: string;
    /** 交易唯一ID */
    trace: string;
    /** 交易类型 (1-客户消费；2-消费退款；8-其他；9-开卡费；12-充卡费；16-行政费用) */
    type: number | null;
    /** 出入账方向 交易操作类型(1-入账2-出账) */
    operateType: number | null;
    /** 清算时间(开始) */
    cleanStartTime: string;
    /** 清算时间(结束) */
    cleanEndTime: string;
    // 用户ID
    accountId: string;
    /** 入账时间(开始) */
    inAccountStartTime: string;
    /** 出入账时间(结束) */
    inAccountEndTime: string;
    /** 交易状态 状态(1-待定；2-已发布；3-已拒绝；4-无效) */
    status: number | null;
    /** 页面大小 */
    pageSize: number;
    /** 页码 */
    pageNo: number;
}

export interface PasstoTransactionList {
    /** id */
    id: string;
    /** 用户ID */
    accountId: string;
    /** 商户名称 */
    merchantName: string;
    /** 卡号 */
    cardNumber: string;
    /** 内部卡id */
    intervalCardId: string;
    /** 渠道卡ID */
    ditchCardId: string;
    /** 交易唯一ID */
    uniqueCode: string;
    /** 交易类型 (1-客户消费；2-消费退款；8-其他；9-开卡费；12-充卡费；16-行政费用) */
    type: number;
    /** 出入账方向 交易操作类型(1-入账2-出账) */
    operateType: number;
    /** 原始金额 */
    sourceAmount: string | number; // TypeScript中没有BigDecimal类型，所以使用string或number代替
    /** 原始币种 */
    sourceCurrency: string | number; // 同上，使用string或number代替
    /** 清算金额 */
    amount: string | number; // 同上
    /** 清算币种 */
    currency: string;
    /** 交易发起时间(passto创建时间) */
    ptCreateTime: string;
    /** 清算时间(detail表的创建时间) */
    createTime: string;
    /** 入账时间(trade表的 创建时间) */
    inAccountTime: string;
    /** 交易状态 状态(1-待定；2-已发布；3-已拒绝；4-无效) */
    status: number;
}
export interface AssetsJournaParams {
    accountId?: string;
    coinId?: string;
    endTime?: string;
    pageNo?: number;
    pageSize?: number;
    sourceOrderNo?: string;
    sourceType?: number | null; // 1、已上账 2、失败 3、待上账 4、链异常
    startTime?: string;
    state?: number | null;
    sysUserId?: number;
}
export interface AssetsJournaData {
    accountId: number;
    afterBalance: number;
    afterFrozenBalance: number;
    afterManualFrozenBalance: number;
    amount: number;
    assetId: number;
    beforeBalance: number;
    beforeFrozenBalance: number;
    beforeManualFrozenBalance: number;
    coinId: number;
    createTime: string;
    id: number;
    reason: string;
    remarks: string;
    sourceOrderNo: string;
    sourceType: number;
    state: number;
    stateName: string;
    sysUserId: number;
    updateTime: string;
    version: number;
}

export interface TypeList {
    code: number;
    name: string;
}
export interface AssetFrozenParams {
    pageNo: number | string;
    pageSize: number | string;
    coinId?: string;
    orderNo?: string;
    userId?: string;
    startTime?: string;
    endTime?: string;
}
export interface AssetFrozenListType {
    createTime: string;
    frozenAmount: string;
    frozenType: string;
    id: number;
    opState: number;
    orderNo: string;
    reason: string;
    symbol: string;
    sysUser: string;
    thawAmount: string;
    userId: string;
    type?: 1 | 2;
}

export interface PlatformAssetListType {
    accountType: number;
    balance: string;
    createTime: string;
    frozenBalance: string;
    hash: string;
    id: number;
    manualFrozenBalance: string;
    riskFrozenBalance: string;
    symbol: string;
    updateTime: string;
    version: number;
}

export interface PlatformAssetParams {
    pageNo: number | string;
    pageSize: number | string;
    coinId?: string;
}
export interface WalletAssetListType extends PlatformAssetParams {
    endTime?: string;
    startTime?: string;
}

export interface WalletAssetListData {
    accountType: number;
    balance: string;
    createTime: string;
    frozenBalance: string;
    id: number;
    symbol: string;
    walletId: string;
    walletUserId: string;
}

export interface FrozenBalanceParams {
    amount: string;
    id: string;
    reason: string;
}

export interface ParamsTransferLog {
    pageNo: number | string;
    pageSize: number | string;
    chainId?: string;
    coinId?: string;
    startTime?: string;
    endTime?: string;
    userId?: string;
    type?: 1 | 2 | 3;
    hash?: string;
    toAddress?: string;
    orderNo?: string;
}

export interface TransferLogData {
    amount: string;
    chainTag: string;
    createTime: string;
    fee: string;
    fromAddress: string;
    hash: string;
    id: number;
    orderNo: string;
    symbol: string;
    toAddress: string;
    type: number;
    userId: string;
}

export interface CommonPlatParams {
    beginTime: string;
    ditchCode: string;
    endTime: string;
    pageNo: number;
    pageSize: number;
}

export interface GetPagePlatParams {
    ditchCode: string;
    pageNo: number | string;
    pageSize: number | string;
    currency: string;
}

export interface GetPagePlatData {
    availableAmount: string;
    cardAcctId: string;
    consumeFeeAmount: string;
    createTime: string;
    currency: string;
    ditchCardId: string;
    ditchCardName: string;
    ditchCode: string;
    ditchId: string;
    ditchName: string;
    frozenAmount: string;
    hash: string;
    id: string;
    updateTime: string;
    version: number;
}

export interface getPagePlatformPrams extends CommonPlatParams {
    accountCardId: string;
    accountId: string;
    businessType: number | '';
    currency: string;
}

export interface getPagePlatformCardData {
    accountCardId: string;
    accountId: string;
    availableAmount: string;
    businessNo: string;
    businessType: number;
    businessTypeName: string;
    consumeFeeAmount: string;
    createTime: string;
    currency: string;
    ditchCardId: string;
    ditchCardName: string;
    ditchCode: string;
    ditchId: string;
    ditchName: string;
    frozenAmount: string;
    id: string;
}

export interface PlatformSnapshotParams extends CommonPlatParams {
    snapshotType: number;
}

export interface PlatformSnapshotData {
    availableAmount: string;
    batchNo: string;
    cardAcctId: string;
    consumeFeeAmount: string;
    createTime: string;
    currency: string;
    ditchCardId: string;
    ditchCardName: string;
    ditchCode: string;
    ditchId: string;
    ditchName: string;
    frozenAmount: string;
    hash: string;
    id: string;
    snapshotTime: string;
    snapshotType: number;
    snapshotTypeName: string;
    updateTime: string;
    version: number;
}

export interface CardCutPlatformParams extends CommonPlatParams {
    cardAcctId: string;
}

export interface CardCutPlatformData {
    afterAvailableAmount: string;
    afterConsumeFeeAmount: string;
    afterFrozenAmount: string;
    availableAmount: string;
    batchNo: string;
    beforeAvailableAmount: string;
    beforeConsumeFeeAmount: string;
    beforeFrozenAmount: string;
    cardAcctId: string;
    consumeFeeAmount: string;
    createTime: string;
    currency: string;
    cutTime: string;
    ditchCardId: string;
    ditchCardName: string;
    ditchCode: string;
    ditchId: string;
    ditchName: string;
    frozenAmount: string;
    id: string;
    updateTime: string;
}

export interface UserCutParams extends CommonPlatParams {
    currency: string;
    accountId: string;
}

export interface PlatformCardAmout {
    availableAmountTotal: string;
    consumeFeeAmountTotal: string;
    frozenAmountTotal: string;
}

export interface PlatformCardCurreny<T> {
    curreny: string;
    item: T;
}

export interface CardCutStatistics {
    afterAvailableAmountTotal: string;
    afterConsumeFeeAmountTotal: string;
    afterFrozenAmountTotal: string;
    availableAmountTotal: string;
    beforeAvailableAmountTotal: string;
    beforeConsumeFeeAmountTotal: string;
    beforeFrozenAmountTotal: string;
    consumeFeeAmountTotal: string;
    frozenAmountTotal: string;
}
