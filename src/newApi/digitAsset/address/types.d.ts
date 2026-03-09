declare interface AddressListParams {
    address: string;
    agentNo: string;
    aml: string;
    chainId: string;
    coinSymbol: string;
    status: string;
    uid: string;
}
declare interface AddressListData {
    address: string;
    agentNo: string;
    aml: number;
    chainNames: string;
    coinSymbol: string;
    discontinueReason: string;
    id: string;
    remarks: string;
    status: number;
    uid: string;
    walletName: string;
    walletType: number;
    walletTypeName: string;
}

declare interface AddressCoinListParams {
    id: string;
}
declare interface AddressCoinListData {
    chainId: string;
    chainName: string;
    chainSymbol: string;
    coinId: string;
    coinStatus: number;
    coinSymbol: string;
    id: string;
    isAdd: boolean;
    isState: boolean;
}
