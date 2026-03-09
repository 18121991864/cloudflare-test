declare interface AssetMonitoringOverviewList {
    currentEarningsUsd: string;
    dailyAnnualizedReturnRate: string;
    monthlyAnnualizedReturnRate: string;
    numberOfMonitoredAccounts: number;
    numberOfProfitableAccounts: number;
    totalAssetsUsd: string;
    totalNumberOfAccounts: number;
    weeklyAnnualizedReturnRate: string;
    yesterdayEarningsUsd: string;
}
declare interface AssetMonitoringTrend {
    asset: string;
    date: string;
}

declare interface AssetTendsList {
    coinId: string;
    endTime: string;
    productId: string;
    startTime: string;
    state: number;
    subAccountSource: string;
    teamId: string;
    tendId: string;
    uid: string;
}

declare interface AssetTendsData {
    applyUserName: string;
    currentValue: string;
    endTime: string;
    id: string;
    productName: string;
    quantity: string;
    quantityDecimals: number;
    quantitySymbol: string;
    quantityValue: string;
    quantityValueSymbol: string;
    remark: string;
    startTime: string;
    state: number;
    stateName: string;
    subAccountSource: string;
    subAccountUid: string;
    teamName: string;
    tendId: string;
}

declare interface AssetproductsData {
    id: string;
    name: string;
    symbol: string;
}

declare interface AddMonitorTendsData {
    productId: string;
    quantity: string;
    remark: string;
    subAccountId: string;
    teamId: string;
}

declare interface AssetReturnListParams {
    endTime: string;
    productId: string;
    startTime: string;
    symbol: string;
    teamId: string;
    tendId: string;
}

declare interface AssetReturnListData {
    id: string;
    opUser: string;
    period: string;
    productName: string;
    quantity: string;
    quantityDecimals: number;
    quantitySymbol: string;
    quantityValue: string;
    quantityValueSymbol: string;
    remark: string;
    returnTime: string;
    tendId: string;
    yield: string;
}

declare interface AppendList {
    appendTime: string;
    id: string;
    quantity: string;
    quantitySymbol: string;
}

declare interface TendsAppendsDetail {
    appendList: AppendList[];
    applyTime: string;
    endTime: string;
    monitorTendsId: string;
    productName: string;
    quantity: string;
    quantityDecimals: number;
    quantitySymbol: string;
    remark: string;
    returnQuantity: string;
    returnSymbol: string;
    returnTime: string;
    startTime: string;
    subAccount: string;
    teamName: string;
}

declare interface FundList {
    quantity: string;
    quantityValue: string;
    quantityValueSymbol: string;
    symbol: string;
    updateTime: string;
}

declare interface TrendDetail {
    dates: any[];
    values: any[];
}

declare interface TendsMonitoDetail {
    fundList: FundList[];
    source: string;
    uid: string;
    principalValue: string;
    principalValueSymbol: string;
    totalValue: string;
    totalValueSymbol: string;
    trendDetail: TrendDetail;
}

declare interface AssetTeamListData {
    avgOperationCycle: number;
    createTime: string;
    currentManageFund: string;
    historyManageFund: string;
    historyReturnFund: string;
    historyReturnRate: string;
    id: string;
    name: string;
    remark: string;
    updateTime: string;
}

declare interface AccoutMonitoringData {
    amount: string;
    createTime: string;
    currency: string;
    currentFunds: string;
    id: number;
    injectValue: string;
    proName: string;
    productId: string;
    source: string;
    teamId: string;
    teamName: string;
    uid: string;
    updateTime: string;
}

declare interface getTeamFundList {
    productName: string;
    quantity: string;
    quantityValue: string;
    source: string;
    symbol: string;
    uid: string;
    updateTime: string;
}

declare interface getTeamFundData {
    list: getTeamFundList[];
    teamId: string;
    teamName: string;
    totalValue: string;
}

declare interface WarningListData {
    emails: string;
    id: string;
    state: number;
    tendIds: string;
    type: number;
    warningType: number;
    warningTypeName: string;
    warningValue: string;
}

declare type AddWarningListData = Omit<WarningListData, 'state'> & {
    operator: string;
};

declare interface WarningCommonLog {
    endTime: string;
    pageNo: number;
    pageSize: number;
    startTime: string;
    tendIds: string;
}

declare interface FlowCommonParams {
    coinId: string;
    earnAccountId: string;
    endTime: string;
    productName: string;
    productType: number;
    startTime: string;
    tendId: string;
}

declare interface FlowCommonListData {
    afterBalance: string;
    amount: string;
    beforeBalance: string;
    createTime: string;
    direct: string;
    earnAccountId: string;
    flowType: number;
    flowTypeName: string;
    id: string;
    productName: string;
    productType: number;
    productTypeName: string;
    symbol: string;
    tendId: string;
}

declare interface InvestmentCommonParams {
    coinId: string;
    id: string;
    proName: string;
    endTime: string;
    startTime: string;
}

declare interface InvestmentCommonData {
    coinId: string;
    createTime: string;
    currency: string;
    id: string;
    income: string;
    principal: string;
    proName: string;
    quantity: string;
    totalCount: number;
    totalQuantity: string;
    updateTime: string;
}

declare type AccountCommonParams = Omit<InvestmentCommonParams, 'proName'>;
declare interface AccountCommonData {
    coinId: string;
    createTime: string;
    currency: string;
    id: string;
    income: string;
    principal: string;
    proName: string;
    quantity: string;
    totalCount: number;
    totalQuantity: string;
    updateTime: string;
}

declare interface AssetSnapCommonParams {
    coinId: string;
    endTime: string;
    id: string;

    proName: string;
    productId: string;
    startTime: string;
    type: number;
}
declare interface AssetSnapCommonParams {
    coinId: string;
    endTime: string;
    id: string;
    proName: string;
    productId: string;
    startTime: string;
    type: number;
}

declare interface AssetSnapCommonData {
    coinId: string;
    currency: string;
    id: string;
    income: string;
    principal: string;
    proName: string;
    productId: string;
    snapshotDate: string;
    snapshotTime: string;
    total: string;
    type: number;
    typeName: string;
}

declare interface SubSnapAccountParams {
    endTime: string;
    source: string;
    startTime: string;
    uid: string;
}
declare interface SubSnapAccountData {
    amount: string;
    id: string;
    snapshotDate: string;
    snapshotTime: string;
    source: string;
    type: number;
    typeName: string;
    uid: string;
}

declare interface AccountCutCommonParams {
    coinId: string;
    endTime: string;
    platformAccountId: string;
    proName: string;
    productId: string;
    startTime: string;
}
declare interface AccountCutCommonData {
    afterAmount: string;
    afterIncome: string;
    afterTotalAmount: string;
    beforeAmount: string;
    beforeIncome: string;
    beforeTotalAmount: string;
    coinId: string;
    createTime: string;
    currency: string;
    cutDate: string;
    id: string;
    platformAccountId: string;
    proName: string;
    productId: string;
    totalAmount: string;
}

declare interface TendsMonitoPullParams {
    applyTime: string;
    applyUserName: string;
    currentValue: string;
    endTime: string;
    id: string;
    productName: string;
    quantity: string;
    quantityDecimals: number;
    quantitySymbol: string;
    quantityValue: string;
    quantityValueSymbol: string;
    remark: string;
    startTime: string;
    state: number;
    stateName: string;
    subAccountSource: string;
    subAccountUid: string;
    teamName: string;
    tendId: string;
}

declare interface TendsFundList {
    quantity: string;
    quantityValue: string;
    quantityValueSymbol: string;
    symbol: string;
    updateTime: string;
}

declare interface TrendDetail {
    dates: any[];
    values: any[];
}

declare interface TendsRestutionAmountList {
    fundList: TendsFundList[];
    principalValue: string;
    principalValueSymbol: string;
    source: string;
    totalValue: string;
    totalValueSymbol: string;
    trendDetail: TrendDetail;
    uid: string;
}

declare interface TendsAmoutInfo {
    createTime: string;
    quantity: string;
    quantitySymbol: string;
    quantityValue: string;
}
