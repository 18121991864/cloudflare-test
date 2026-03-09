declare interface AccountListParams {
    maxBalance: number;
    minBalance: number;
    uid: string;
}
declare interface AccountListData {
    address: string;
    amlFrozen: string;
    balance: string;
    chainId: string;
    chainSymbol: string;
    coinId: string;
    coinSymbol: string;
    createTime: string;
    fee: string;
    id: string;
    status: number;
    uid: string;
    walletAddressId: string;
}

declare interface AMLListParams {
    coinSymbol: string;
    uid: string;
}

declare interface AMLListData {
    address: string;
    chainId: string;
    chainSymbol: string;
    coinId: string;
    coinSymbol: string;
    createTime: string;
    frozenAmount: string;
    uid: string;
    updateTime: string;
    walletAddressId: string;
}

declare interface AddressListParams {
    address: string;
    uid: string;
}

declare interface AddressListData {
    address: string;
    amlFrozen: string;
    balance: string;
    chainId: string;
    chainSymbol: string;
    coinId: string;
    coinSymbol: string;
    createTime: string;
    fee: string;
    id: string;
    status: number;
    uid: string;
    walletAddressId: string;
}
