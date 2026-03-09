import { Api } from '@/api/api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    getPage(params: {
        accountId: string;                       // 账户ID
        businessType: number;                    // 业务类型
        cardNumber: string;                      // 卡号
        direction: number;                       // 方向
        ditchCardId: string;                     // 丢弃卡ID
        ditchSerialNo: string;                   // 丢弃序列号
        ditchTransactionId: string;              // 丢弃交易ID
        entryTimeBegin: string;                  // 进入时间开始
        entryTimeEnd: string;                    // 进入时间结束
        orderStatus: number;                     // 订单状态
        orderType: number;                       // 订单类型
        originalTransactionAmount: string;       // 原始交易金额
        originalTransactionCurrency: string;     // 原始交易货币
        pageNo: number;                          // 页码
        pageSize: number;                        // 每页大小
        transactionAmount: string;               // 交易金额
        transactionCurrency: string;             // 交易货币
        transactionTimeBegin: string;            // 交易时间开始
        transactionTimeEnd: string;              // 交易时间结束
        transactionUpdateTimeBegin: string;      // 交易更新时间开始
        transactionUpdateTimeEnd: string;        // 交易更新时间结束
    }): Promise<{
        list: {
            accountId: string;                        // 账户ID
            atmFees: string;                          // ATM费用
            batchNo: string;                          // 批次号
            businessType: number;                     // 业务类型
            businessTypeName: string;                 // 业务类型名称
            cardNumber: string;                       // 卡号
            childId: string;                          // 子ID
            createTime: string;                       // 创建时间
            direction: number;                        // 方向
            directionName: string;                    // 方向名称
            ditchCardId: string;                      // 丢弃卡ID
            ditchSerialNo: string;                    // 丢弃序列号
            ditchTransactionId: string;               // 丢弃交易ID
            feeCurrency: string;                      // 费用货币
            feeCurrencyName: string;                  // 费用货币名称
            fxFees: string;                           // 外汇费用
            id: number;                               // ID
            mainId: string;                           // 主ID
            merchantCategory: string;                 // 商户类别
            merchantCity: string;                     // 商户城市
            merchantCountry: string;                  // 商户国家
            merchantId: string;                       // 商户ID
            merchantMcc: string;                      // 商户MCC
            merchantName: string;                     // 商户名称
            merchantPostCode: string;                 // 商户邮政编码
            merchantState: string;                    // 商户州
            orderNo: string;                          // 订单号
            orderStatus: number;                      // 订单状态
            orderStatusName: string;                  // 订单状态名称
            orderType: number;                        // 订单类型
            orderTypeName: string;                    // 订单类型名称
            originalTransactionAmount: string;        // 原始交易金额
            originalTransactionCurrency: string;      // 原始交易货币
            originalTransactionCurrencyName: string;  // 原始交易货币名称
            transactionAmount: string;                // 交易金额
            transactionCurrency: string;              // 交易货币
            transactionCurrencyName: string;          // 交易货币名称
            transactionTime: string;                  // 交易时间
            transactionUpdateTime: string;            // 交易更新时间
        }[]
    } & TableResultType> {
        return this.api.post('/ditchFinanceReap/getPage', params);
    }

    // 获取业务类型
    getBusinessType(): Promise<{
        label: string;
        value: string;
    }[]> {
        return this.api.get('/ditchFinanceKoipy/getBusinessType');
    }

    // 获取收支类型
    getDirectionType(): Promise<{
        label: string;
        value: string;
    }[]> {
        return this.api.get('/ditchFinanceKoipy/getDirectionType');
    }

    // 获取交易状态
    getOrderStatus(): Promise<{
        label: string;
        value: string;
    }[]> {
        return this.api.get('/ditchFinanceKoipy/getOrderStatus');
    }

    // 获取订单类型
    getOrderType(): Promise<{
        label: string;
        value: string;
    }[]> {
        return this.api.get('/ditchFinanceKoipy/getOrderType');
    }

    // 查询金额统计
    getAmountStatistics(params: {
        accountId: string;                       // 账户ID
        businessType: number;                    // 业务类型
        cardNumber: string;                      // 卡号
        direction: number;                       // 方向
        ditchCardId: string;                     // 丢弃卡ID
        ditchSerialNo: string;                   // 丢弃序列号
        ditchTransactionId: string;              // 丢弃交易ID
        entryTimeBegin: string;                  // 进入时间开始
        entryTimeEnd: string;                    // 进入时间结束
        orderStatus: number;                     // 订单状态
        orderType: number;                       // 订单类型
        originalTransactionAmount: string;       // 原始交易金额
        originalTransactionCurrency: string;     // 原始交易货币
        pageNo: number;                          // 页码
        pageSize: number;                        // 每页大小
        transactionAmount: string;               // 交易金额
        transactionCurrency: string;             // 交易货币
        transactionTimeBegin: string;            // 交易时间开始
        transactionTimeEnd: string;              // 交易时间结束
        transactionUpdateTimeBegin: string;      // 交易更新时间开始
        transactionUpdateTimeEnd: string;        // 交易更新时间结束
    }): Promise<{
        amount: number;
        currency: string; //
        label: string;
        type: number; //
    }[]> {
        return this.api.post('/ditchFinanceReap/getAmountStatistics', params);
    }

    // 退款入账详情
    refundInfo(params: { id: string }): Promise<{
        rechargeAmount: string; // 充值金额
        rechargeFee: string; // 充值手续费
        rechargeRate: string; // 充值手续费率
        transactionAmount: string; // 交易金额
        transactionTimeOut: 1 | 2;
    }> {
        return this.api.post('/ditchFinanceReap/refundInfo', params);
    }

    // 退款入账
    refundCredit(params: { id: string; type: 1 | 2 }): Promise<boolean> {
        return this.api.post('/ditchFinanceReap/refundCredit', params);
    }

    // 通过sku获取完整卡号
    getCardNumberBySku(params: { sku: string }): Promise<string> {
        return this.api.get('/ditchFinanceReap/getCardNumberBySku', { params });
    }
}

export default new FetchTest();
