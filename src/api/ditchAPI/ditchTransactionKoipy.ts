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

    // 授权列表
    transactionList(params: {
        approvalCode: string; // 授权码
        cardLogId: string; // 内部卡ID
        ditchCardId: string; // 渠道卡ID
        endTime: string; // 结束时间
        orderNo: string; // 订单号
        requestId: string; // 渠道交易ID
        startTime: string; // 开始时间
        state: 1 | 2; // 交易结果:1=完成,2=未完成
        transactionCode: string; // 业务类型
        transactionId: string; // 交易关联ID
        pageNo: number; // 页码
        pageSize: number; // 页面大小
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
        return this.api.post('/ditchTransactionKoipy/transactionList', params);
    }

    // 授权表交易下拉列表
    transactionMessageTypeList(): Promise<{ code: string; name: string }[]> {
        return this.api.get('/ditchTransactionKoipy/transactionMessageTypeList');
    }
}

export default new FetchTest();
