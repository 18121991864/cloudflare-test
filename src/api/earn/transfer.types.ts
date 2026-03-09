declare interface TransferAddressConfigParams {
    address?: string;
    source?: '1' | '2' | '3';
    chainId: string;
    state: 1 | 2;
}
declare interface TransferAddressConfigData {
    apiState: number;
    brokerState: number;
    caasState: number;
    id: string;
    iframeState: number;
    walletState: number;
    address: string;
}
declare type AddTransAddressList = TransferAddressConfigParams & {
    coinId: string;
    chainId: string;
};
