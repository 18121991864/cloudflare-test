export interface ParameterList {
    agentAccountId: string;
    pageNo: number;
    pageSize: number;
}
export interface ParameterData {
    agentAccountId: string;
    cardType: string;
    createTime: string;
    ditchName: string;
    email: string;
    id: string;
    openFee: string;
    updateTime: string;
}

export interface ParameterEdit {
    accountId: string;
    agentAccountId: string;
    id?: string;
    openFee: string;
}

export interface KOLList {
    accountId: string;
    advancedAuthState: string;
    advancedAuthStateName: string;
    authState: string;
    authStateName: string;
    country: string;
    createTime: string;
    email: string;
    globalCode: string;
    id: string;
    invitationCode: string;
    labelColor: string;
    labelId: string;
    labelName: string;
    name: string;
    phone: string;
    reviewComment: string;
    state: number;
    stateName: string;
    surname: string;
    userType: number;
    userTypeName: string;
}
export interface ParamsKOLList {
    accountId?: string;
    country?: string;
    email?: string;
    endTime?: string;
    invitationCode?: string;
    labelId?: string;
    pageNo?: number;
    pageSize?: number;
    phone?: string;
    startTime?: string;
    state?: number | null;
    userType?: number;
}

export interface KolRebateConfListParams {
    bizType?: string; // 业务类型 1:开卡 2:充值
    cardName?: string | null; // 卡名称
    cardType?: string; // 卡类型 1:虚拟卡 2:实体卡
    ditchName?: string | null; // 渠道
    id?: string; // ID
    startTime?: Date; // 开始时间
    accountId?: string; // kol用户id
    endTime?: Date; // 结束时间
    pageNo: number; // 页码
    pageSize: number; // 每页条数
}

export interface KolRebateConfList {
    bizType: number; // 业务类型
    bizTypeName: string; // 业务类型名称
    cardName: string; // 卡名称
    cardType: number; // 卡类型
    cardTypeName: string; // 卡类型名称
    ditchName: string; // 渠道名称
    endTime: string; // 结束时间
    id: string; // ID
    rebateRange: number; // 返利范围
    rebateRangeName: string; // 返利范围名称
    rebateRangeValue: string; // 返利范围值
    rebateRatio: number; // 返利比例
    startTime: string; // 开始时间
    state: number; // 状态
    stateName: string; // 状态名称
    updateTime: string; // 更新时间
}

export interface AddOrUpdateKolRebateConfListParams {
    bizType: string | undefined; // 业务类型 1:开卡 2:充值
    id: string | undefined; // ID
    rebateRange: string | undefined; // 返佣范围 1.全局，2.标签，3.用户
    rebateRatio: string | undefined; // 返佣比例，单位为 100%
    state: string | undefined; // 状态 1:开启 2:关闭
    ditchCardId: string | undefined; // 渠道卡id
    endTime: string | undefined; // 结束时间
    rebateRangeValue: string | undefined; // 返佣值 多个,隔开
    startTime: string | undefined; // 开始时间
}

export interface KOLInvitationList {
    accountId: string;
    cardType: string;
    createTime: string;
    ditchName: string;
    email: string;
    id: string;
    openFee: string;
    updateTime: string;
}
