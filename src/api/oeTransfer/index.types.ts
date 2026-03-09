declare interface IAdjustmentOrderList {
    adjustmentState: number;
    channelName: string;
    channelOrderNo: string;
    channelType: number;
    createTime: string;
    email: string;
    id: number;
    labelColor: string;
    labelId: number;
    labelName: string;
    orderNo: string;
    state: string;
    updateTime: string;
    userId: string;
    userSubmit: number;
}

declare interface IAdjustmentOrderDetail {
    acquisitionModel: string;
    adjustmentState: number;
    benFirstName: string;
    benLastName: string;
    businessModel: string;
    businessTransactions: any[];
    companyName: string;
    confirmationLetter: any[];
    createTime: string;
    description: string;
    documentsProvingSource: any[];
    email: string;
    historicalOrder: any[];
    id: number;
    nationality: string;
    oeOrderNo: string;
    orderNo: string;
    payeeName: string;
    payeeNationality: string;
    payerBirthday: string;
    payerIdentityDocument: any[];
    paymentStatement: any[];
    profitModel: string;
    remainingMaterials: any[];
    state: string;
    transactionDetails: any[];
    transactionProof: any[];
    updateTime: string;
    userId: string;
    userSubmit: number;
    website: string;
    withPayers: any[];
}


declare interface IOeTransferAccount {
    channelName: string;
    channelType: number;
    checkState: number;
    createTime: string;
    email: string;
    id: string;
    labelColor: string;
    labelId: number;
    labelName: string;
    payerAccountId: string;
    updateTime: string;
    userId: string;
    userName: string;
  }


  declare interface IOeTransferAccountDetail {
    checkState: number;
    createTime: string;
    id: number;
    mobileAreaCode: string;
    payerAddress: string;
    payerBirthday: string;
    payerCityCode: string;
    payerCountryCode: string;
    payerFirstName: string;
    payerIdCountry: string;
    payerIdNo: string;
    payerIdNoType: string;
    payerLastName: string;
    payerMobile: string;
    payerNationalityCountry: string;
    payerOccupation: string;
    payerPostCode: string;
    payerType: string;
    updateTime: string;
    userId: string;
  }


  declare interface IOePayeeApply {
    bankAddress: string;
    bankName: string;
    benAccountNum: string;
    benBankCode: string;
    channelName: string;
    channelType: number;
    checkState: number;
    createTime: string;
    id: string;
    payeeAccountId: string;
    payerType: string;
    updateTime: string;
    userId: string;
    userName: string;
  }

  declare interface IOePayeeApplyDetail {
    bankName: string;
    benAccountName: string;
    benAccountNum: string;
    benAddress: string;
    benBankAccountType: string;
    benBankCode: string;
    benBirthday: string;
    benCityCode: string;
    benCountryCode: string;
    benFirstName: string;
    benIdExpirationDate: string;
    benIdNo: string;
    benIdNoType: string;
    benLastName: string;
    benMobile: string;
    benMobileCode: string;
    benNationalityCountry: string;
    benPostCode: string;
    benTransBankSwift: string;
    checkState: number;
    country: string;
    createTime: string;
    delState: number;
    id: number;
    payeeType: string;
    relationship: string;
    updateTime: string;
    userId: string;
  }


  declare interface IOeOrder {
    channelName: string;
    channelOrderNo: string;
    channelType: number;
    createTime: string;
    fee: string;
    feeSymbol: string;
    id: string;
    orderNo: string;
    orderState: number;
    payAmount: string;
    payAmountSymbol: string;
    rate: string;
    rateSymbol: string;
    refundAmount: string;
    refundAmountSymbol: string;
    remitAmount: string;
    remitAmountSymbol: string;
    showState: number;
    status: string;
    totalAmount: string;
    totalAmountSymbol: string;
    updateTime: string;
    userId: string;
  }



  declare interface IOeOrderDetail {
    amount: string;
    createTime: string;
    fee: string;
    feeSymbol: string;
    id: number;
    oeOrderNo: string;
    orderNo: string;
    orderState: number;
    payAccountNum: string;
    payAmount: string;
    payAmountSymbol: string;
    payPurpose: string;
    payeeInfo: PayeeInfo;
    payerInfo: PayerInfo;
    paymentCurrency: string;
    paymentFee: string;
    postscript: string;
    rate: string;
    rateSymbol: string;
    receivedAccountName: string;
    receivedAccountNum: string;
    receivedAmount: string;
    receivedCurrency: string;
    refundAmount: string;
    refundAmountSymbol: string;
    relationship: string;
    remitAmount: string;
    remitAmountSymbol: string;
    resultMsg: string;
    showState: number;
    sourceFunds: string;
    status: string;
    toAmount: string;
    toAmountSymbol: string;
    totalAmount: string;
    transferOrderDesc: string;
    transferOrderFile: string;
    transferOrderInfo: string;
    uniqueId: string;
    updateTime: string;
    userId: string;
  }
  interface PayerInfo {
    checkState: number;
    createTime: string;
    id: number;
    mobileAreaCode: string;
    payerAddress: string;
    payerBirthday: string;
    payerCityCode: string;
    payerCountryCode: string;
    payerFirstName: string;
    payerIdCountry: string;
    payerIdNo: string;
    payerIdNoType: string;
    payerLastName: string;
    payerMobile: string;
    payerNationalityCountry: string;
    payerOccupation: string;
    payerPostCode: string;
    payerType: string;
    updateTime: string;
    userId: string;
  }
  interface PayeeInfo {
    bankName: string;
    benAccountName: string;
    benAccountNum: string;
    benAddress: string;
    benBankAccountType: string;
    benBankCode: string;
    benBirthday: string;
    benCityCode: string;
    benCountryCode: string;
    benFirstName: string;
    benIdExpirationDate: string;
    benIdNo: string;
    benIdNoType: string;
    benLastName: string;
    benMobile: string;
    benMobileCode: string;
    benNationalityCountry: string;
    benPostCode: string;
    benTransBankSwift: string;
    checkState: number;
    country: string;
    createTime: string;
    delState: number;
    id: number;
    payeeType: string;
    relationship: string;
    updateTime: string;
    userId: string;
  }