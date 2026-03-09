export interface Pagination {
    pageNo: number;
    pageSize: number;
    totalPages: number;
    totalSize: number;
}

export interface PaginationParams {
    pageSize: number;
    pageNo: number;
}

// 注销请求申请列表
export interface CancellationApplicationType {
    accountId?: string;
    checkCloseState?: number | '';
    endTime?: string;
    pageNo?: number;
    pageSize?: number;
    startTime?: string;
    userEmail?: string;
    state: number | '';
}

export interface List {
    advancedAuthState: number;
    agentName: string;
    authState: number;
    closeAccountCheck: number;
    createTime: string;
    email: string;
    id: string;
    invitationCode: string;
    name: string;
    parentInvitationCode: string;
    state: number;
    surname: string;
    updateTime: string;
}

export interface ListData {
    list: List[];
}

export interface ChangeCard {
    beforeCardNo?: string;
    newCardNo?: string;
    ditchId?: string;
    ditchName?: string;
    accountId?: string;
    pageNo?: number;
    pageSize?: number;
}

export interface ChangeCardList {
    accountId?: string;
    beforeCardNumber?: string;
    beforeDitchName?: string;
    beforeShowCardBalance?: string;
    beforeDitchCardBalance?: string;
    returnAmount?: string;
    newCardNumber?: string;
    newDitchName?: string;
    newShowCardBalance?: string;
    nowDitchCardBalance?: string;
    type?: string;
    status?: string;
    createTime?: string;
    updateTime?: string;
}

// 开卡/充值退款
export interface rechargeType {
    // accountId: string;
    id: string;
}
