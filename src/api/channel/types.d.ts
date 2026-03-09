export interface ReturnDataParams {
    cardNumber?: string;
    accountId?: string;
    pageNo: number;
    pageSize: number;
}

export interface ReturnDataList {
    symbol: string;
    accountId: string;
    cardNumber: string;
    showBalance: number;
    openFee: number;
    depositFee: number;
    consumeFee: number;
    reductionFee: number;
    reductionDepositFee: number;
    amount: number;
    createTime: number;
}

export type TradeTypeList = Array<{
    code: string;
    desc: string;
}>;

export interface BalanceLedgerParams {
    pageNo: number;
    pageSize: number;
    tradeType: string;
    borrowLend: string;
    startPostingDate: string;
    endPostingDate: string;
    accountBalanceName: string;
    accountBalanceNo: string;
    ditchCode: string;
}
export interface BalanceLedgerList {
    accountBalanceName: string;
    accountBalanceNo: string;
    accountName: string;
    accountNo: string;
    borrowLend: string;
    changePrice: number;
    currency: string;
    id: string;
    postingDate: string;
    tradeType: string;
}

export interface CardTransaction {
    // 渠道卡片管理-新增
    id: string | null;
    area: string; // 发卡地区
    depositFee: string; // 充值手续费
    ditchId: string; // 代理商ID
    imageUri?: string; // 图片
    name: string; // 名称
    openFee: string; // 开卡手续费
    organizationId?: string; // 组织ID
    productId?: string; // 产品ID
    state: 1 | 2; // 状态：1=启用，2=禁用
    summary?: string; // 简介
    tradeFee: string; // 交易手续费
    surfaceRate?: string; // 浮动汇率
    maxAuthAmount: number | null; // 单次授权金额上限
    minAuthAmount: number | null; // 单次授权金额下限
    maxRechargeAmount: number | null; // 单次充值上限
    minRechargeAmount: number | null; // 单次充值下限
    explainTitle1?: string; // 说明标题1
    explainTitle2?: string; // 说明标题2
    explainTitle3?: string; // 说明标题3
    explain1?: string; // 说明备注1
    explain2?: string; // 说明备注2
    explain3?: string; // 说明备注3
    typeId: string; // 类型ID
    cardType: 1 | 2; // 卡类型： 1=虚拟卡， 2=实体卡
    info?: string; // 详情
    cardCurrencyId: string | null; // 卡币种ID
    currencyOfDepositId: string | null; // 充值币种ID
    crossBorderCommission: string; // 跨境手续费
    cardIssuerId: string | null; // 卡片发行方
    monthlyFee: number | null; // 月费
    isRestrictCountry: 1 | 2; // 是否限制国家及区域[1 未限制, 2 限制]
    restrictCountry: string | undefined | any[]; // 限制的国家及区域
    passportRestrictCountry: string | undefined | any[]; // 护照国家限制
    isRestrictAge: 1 | 2; // 是否限制年龄[1 未限制, 2 限制]
    restrictAge: number | null; // 限制的年龄段
    isBindPhone: 1 | 2; // 是否需要绑定手机号码[1 是, 2 否]
    isBindEmail: 1 | 2; // 是否需要绑定邮箱[1 是, 2 否]
    isSupportOpen: 1 | 2; // 是否支持开卡[1 是, 2 否]
    isSupportRecharge: 1 | 2; // 是否支持充值 [1 是，2 否]
    cardBaseUrl: string; // 底图
    cardSampleUrl: string; // 样图
    isSupportAtmDrawing: 1 | 2; // 是否支持ATM取现 [是，否]
    atmDrawingFee: number | null; // ATM提现手续费(%)
    makeNewCardFee: number | null; // 补卡费用
    kycLevel: 0 | 1 | 2;
    restrictedCallingCode: string[];
    global: boolean;
    checkArr: number[];
    labelIds: string | any[];
    fields: string;
    exposureRange?: number;
    accountIds: string;
    certificateType: number[];
    names: string[];
    photo: string[];
    incomeInfo: string[];
    addressType: any;
    cardApposeUrl: string;
    maxAge: number | string;
    supportCoinList: string[];
    cardReplaceable: 0 | 1;
    cardCancellable: 0 | 1;
    managementFee: string; // 管理费
    managementFeePlatform: 1 | 2 | null; // 渠道 / 平台
    managementFeeType: 1 | 2 | 3 | null; // 免费 / 年收 / 月收
    cardModel: number | string;
}

export interface getDitchAcctAssetType {
    ditchAccountId: string;
    ditchCode: string;
    pageNo: number;
    pageSize: number;
    currency: string;
}
export interface DitchAcctAssetData {
    accountStatus: number;
    accountStatusName: string;
    amount: string;
    amountType: number;
    amountTypeName: string;
    createTime: string;
    currency: string;
    ditchAccountId: string;
    ditchAccountName: string;
    ditchAccountStatus: number;
    ditchAccountStatusName: string;
    ditchAccountType: number;
    ditchAccountTypeName: string;
    ditchCode: string;
    ditchId: string;
    ditchName: string;
    id: string;
    lineData: string;
    updateTime: string;
}

export interface KoipyParams {
    accountingTimeBegin: string;
    accountingTimeEnd: string;
    action: string;
    pageNo: number;
    pageSize: number;
}

export interface KoipyData {
    accountingTime: string;
    action: string;
    actionName: string;
    afterAmount: string;
    amount: string;
    beforeAmount: string;
    createTime: string;
    id: number;
    taskId: number;
    updateTime: string;
}

export interface getActionList {
    label: string;
    value: string;
}

export interface PaytradesParams {
    assetNo: string;
    cardNumber: string;
    cardToken: string;
    createdAtBegin: string;
    createdAtEnd: string;
    pageNo: number;
    pageSize: number;
    statementNo: string;
    transNo: string;
    type: string;
}

export interface PaytradesData {
    amount: string;
    assetNo: string;
    balanceId: number;
    cardNumber: string;
    cardToken: string;
    createTime: string;
    createdAt: string;
    currencyCode: string;
    frozenAmount: string;
    id: number;
    newAmount: string;
    newFrozenAmount: string;
    note: string;
    recordId: number;
    statementNo: string;
    transNo: string;
    type: string;
    updateTime: string;
}

export interface SinoParams {
    accountBalanceNo: string;
    accountNo: string;
    accountingTimeBegin: string;
    accountingTimeEnd: string;
    borrowLend: string;
    orderNo: string;
    pageNo: number;
    pageSize: number;
    serialNo: string;
    tradeType: string;
}

export interface SinoData {
    accountBalanceNo: string;
    accountName: string;
    accountNo: string;
    accountingTime: string;
    borrowLend: string;
    borrowLendName: string;
    changePrice: string;
    createTime: string;
    currency: string;
    endAmount: string;
    freezeAmount: string;
    id: number;
    orderNo: string;
    serialNo: string;
    taskId: number;
    tradeType: string;
    tradeTypeName: string;
    unsettleAmount: string;
    updateTime: string;
}

export interface SkyeeParams {
    fundChangeType: string;
    pageNo: number;
    pageSize: number;
    tradeRecordId: string;
    tradeTimeBegin: string;
    tradeTimeEnd: string;
    txnDirect: string;
}

export interface SkyeeData {
    balanceAfterTrade: string;
    createTime: string;
    fundChangeType: string;
    fundChangeTypeName: string;
    id: number;
    recordId: string;
    subBizType: string;
    subFundChangeType: string;
    taskId: number;
    tradeAmt: string;
    tradeCurrency: string;
    tradeRecordId: string;
    tradeTime: string;
    txnDirect: string;
    txnDirectName: string;
    updateTime: string;
}

export interface ChannelSnapshot {
    beginTime: string;
    currency: string;
    ditchAccountId: string;
    ditchCode: string;
    endTime: string;
    pageNo: number;
    pageSize: number;
    snapshotType: number;
}

export interface ChannelSnapshotData {
    accountStatus: number;
    accountStatusName: string;
    amount: string;
    amountType: number;
    amountTypeName: string;
    batchNo: string;
    createTime: string;
    currency: string;
    ditchAccountId: string;
    ditchAccountName: string;
    ditchAccountStatus: number;
    ditchAccountStatusName: string;
    ditchAccountType: number;
    ditchAccountTypeName: string;
    ditchCode: string;
    ditchId: string;
    ditchName: string;
    id: string;
    lineData: string;
    snapshotTime: string;
    snapshotType: number;
    snapshotTypeName: string;
    updateTime: string;
}

export interface channdelCardAmout {
    amountTotal: string;
    currency: string;
}
