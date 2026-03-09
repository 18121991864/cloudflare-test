declare interface AccountListParams {
    email: string;
    status: number;
}
declare interface AccountListData {
    createTime: string;
    id: string;
    inviteCode: string;
    nickName: string;
    status: number;
    uid: string;
    updateTime: string;
    category: string;
}

declare interface AccountKeyListParams {
    accountId: string;
    uid: string;
}
declare interface AccountKeyListData {
    accountId: string;
    apiKey: string;
    createTime: string;
    id: string;
    status: number;
    uid: string;
    mutualState: any
}
