import { Api } from '@/api/api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    // 结算列表
    settlementList(params: {
        approvalCode: string; // 授权码
        cardLogId: string; // 内部卡ID
        ditchCardId: string; // 渠道卡ID
        isCredit: null | 'DEBT' | 'CRED'; // 借贷记 DEBT：借记，CRED：贷记
        occurEndTime: string; // (交易发送)结束时间
        occurStartTime: string; // (交易发生)开始时间
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        postingEndTime: string; // (入账处理)结束时间
        postingStartTime: string; // (入账处理)开始时间
        serialNo: string; // 渠道交易ID
        state: 1 | 2; // 交易结果:1=完成,2=未完成
        sysEndTime: string; // (渠道入账)结束时间
        sysStartTime: string; // (渠道入账)开始时间
        transactionCode: string; // 业务类型
        transactionId: string; // 交易关联ID
    }): Promise<{
        list: {
            accountCardId: string; // 用户卡ID
            approvalCode: string; // 授权码
            billAccountAmount: string; // 交易金额
            cardLogId: string; // 内部卡ID
            createTime: string; // 创建时间
            ditchCardId: string; // 渠道卡ID
            id: string; // ID
            isCredit: string; // 借贷记 DEBT：借记，CRED：贷记
            isCreditName: string; //
            isoMerchantCountryCode: string; // 商户国家代码
            occurDateTime: string; // 交易发生时间
            posAcquirerId: string; // 收单行ID
            posMerchantCity: string; // 商户城市
            posMerchantClassCode: string; // 商户名称MCC
            posMerchantId: string; // 商户id
            posMerchantName: string; // 商户名称
            postingDateTime: string; // 入账处理时间
            postingSysTime: string; // 渠道入账时间
            serialNo: string; // 渠道交易ID
            state: 1 | 2; // 交易结果:1=完成,2=未完成
            stateName: string; //
            symbol: string; // 交易币种
            transactionCode: string; // 业务类型
            transactionCodeName: string; // 业务类型名称
            transactionId: string; // 交易关联ID
        }[]
    } & TableResultType> {
        return this.api.post('/ditchTransactionKoipy/settlementList', params);
    }

    // 结算表交易下拉列表
    settlementMessageTypeList(): Promise<{ code: string; name: string }[]> {
        return this.api.get('/ditchTransactionKoipy/settlementMessageTypeList');
    }

    // Reap渠道资金明细列表 原始数据列表
    transactionList(params: {  
        authId: string;                 // Unique identifier for the authorization  
        billCurrency: string;           // Currency used for billing  
        cardId: string;                 // Identifier for the payment card  
        channel: string;                // Channel through which the payment was made (e.g., Online)  
        endClearedAt: string;           // Timestamp when the transaction ended  
        endClearedDate: string;         // Date when the transaction ended  
        endCreatedAt: string;           // Timestamp when the transaction was created  
        eventName: string;              // Name of the event associated with the transaction  
        eventType: string;              // Type of the event (e.g., Sale)  
        lifecycleEventId: string;       // Identifier for the lifecycle event  
        pageNo: number;                 // Page number (for pagination)  
        pageSize: number;               // Size of items per page (for pagination)  
        startClearedAt: string;         // Timestamp when the transaction started  
        startClearedDate: string;       // Date when the transaction started  
        startCreatedAt: string;         // Timestamp when the transaction was created  
        status: string;                 // Status of the transaction (e.g., Completed)  
        transactionCurrency: string;    // Currency of the transaction  
    }): Promise<{
        list: {  
            atmFees: number;                          // Fees associated with ATM transactions  
            authId: string;                            // Unique identifier for the authorization  
            billAmount: number;                        // Amount billed  
            billCurrency: string;                      // Currency used for billing  
            cardId: string;                            // Identifier for the payment card  
            channel: string;                           // Channel through which the payment was made (e.g., Online)  
            clearedAt: string;                         // Timestamp when the transaction was cleared  
            clearedDate: string;                       // Date when the transaction was cleared  
            conversionRate: number;                    // Rate used to convert the currency  
            createdAt: string;                         // Timestamp when the transaction was created  
            description: string;                       // Description of the transaction  
            eventName: string;                         // Name of the event associated with the transaction  
            eventType: string;                         // Type of the event (e.g., Sale)  
            fxFees: number;                            // Foreign exchange fees associated with the transaction  
            id: number;                                // Unique identifier for the transaction  
            lifecycleEventId: string;                  // Identifier for the lifecycle event  
            merchantDataMccCode: number;              // Merchant category code  
            merchantDataMerchantCity: string;         // Merchant's city  
            merchantDataMerchantCountry: string;      // Merchant's country  
            merchantDataMerchantId: number;           // Merchant ID  
            merchantDataMerchantName: string;         // Name of the merchant  
            merchantDataMerchantPostCode: number;     // Merchant's postal code  
            merchantDataMerchantState: string;        // Merchant's state  
            responseCode: string;                      // Response code of the transaction  
            status: string;                            // Status of the transaction (e.g., Completed)  
            transactionAmount: number;                 // Amount of the transaction  
            transactionCurrency: string;               // Currency of the transaction  
            wallet: string;                            // Identifier for the wallet used  
        }[]
    } & TableResultType> {
        return this.api.post('/reap/list', params);
    }

    // Reap渠道资金明细事件类型列表
    transactionMessageTypeList(): Promise<{ code: string; name: string }[]> {
        return this.api.get('/reap/evenTypeList');
    }
    
    // Reap 交易状态列表
    transactionMessageStatusList(): Promise<{ code: string; name: string }[]> {
        return this.api.get('/reap/statusList');
    }
    // Reap Reap 账单币种列表
    transactionMessagebillCurrencyList(): Promise<{ code: string; name: string }[]> {
        return this.api.get('/reap/billCurrencyList');
    }
    // Reap 原始币种列表
    transactionMessagebillTransactionCoinArr(): Promise<{ value: string; label: string }[]> {
        return this.api.get('/ditchFinanceReap/getCurrency');
    }
    // Reap 渠道列表
    transactionMessagebillChannelList(): Promise<{ code: string; name: string }[]> {
        return this.api.get('/reap/channelList');
    }
}

export default new FetchTest();
