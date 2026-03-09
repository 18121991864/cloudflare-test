declare interface QueryRiskCodeData {
    category: string;
    configParams: string;
    description: string;
    multiConfigSupport: boolean;
    riskCode: string;
    triggerCondition: string;
    configFileParams?: {
        key: string;
        value: string;
    }[];
}

declare interface RiskConfigParams {
    ditchCardId: number;
    method: number;
    riskCode: string;
    scope: number;
    state: number;
}

declare interface RiskConfigData {
    category: string;
    ditchCardId: number;
    ditchCardName: string;
    id: number;
    method: number;
    params: any;
    riskCode: string;
    scope: number;
    state: number;
    updateTime: string;
}

declare interface UpdateRiskParams {
    ditchCardId: number;
    method: number;
    params: string;
    riskCode: string;
    scope: number;
    state: number;
    id?: number;
}

declare interface RiskRecordListParams {
    accountCardId: string;
    accountId: string;
    cardNumber: string;
    ditchCardId: string;
    source: number;
    transactionId: string;
    uniqueCardId: string;
}
declare interface RiskRecordLabelList {
    color: string;
    id: string;
    name: string;
}
declare interface RiskRecordListData {
    accountCardId: string;
    accountId: string;
    accountLabelId: string;
    cardNumber: string;
    createTime: string;
    ditchCardId: string;
    ditchCardName: string;
    handleType: number;
    id: string;
    labelList: RiskRecordLabelList[];
    riskScenario: string;
    source: number;
    transactionId: string;
    uniqueCardId: string;
}
