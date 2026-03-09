import { Api } from '@/api/api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    list(params: {
        accountId: string; // 用户ID
        amount: string; // 动账金额
        assetType: null | number; // 资金流水类型
        businessType: null | number; // 业务类型
        cardNumber: string; // 卡号
        childOrderNo: string; // 子订单号
        currency: string; // 币种
        ditchCode: string; // 渠道编码
        endTime: string; // 处理结束,2000-01-02 00:00:00
        mainOrderNo: string; // 主订单号
        orderNo: string; // 流水号
        startTime: string; // 处理开始,2000-01-02 00:00:00
        transactionEndTime: string; // 交易结束时间,2000-01-02 00:00:00
        transactionStartTime: string; // 交易开始时间,2000-01-01 00:00:00
        transactionState: null | number; // 交易状态
        pageSize: number; // 每页条数
        pageNo: number; // 页数
    }): Promise<{
        list: {
            accountId: string; // 用户UID
            afterAvailable: string; // 可用后余额
            afterFrozen: string; // 冻结后余额
            afterPriorFee: string; // 手续费后余额
            amount: string; // 动账金额
            assetType: number; // 资金类型
            assetTypeName: string; // 资金类型名称
            availableAmount: string; // 可用余额动账
            beforeAvailable: string; // 可用前余额
            beforeFrozen: string; // 冻结前余额
            beforePriorFee: string; // 手续费前余额
            businessNo: string; // 子订单号
            businessType: number; // 业务类型
            businessTypeName: string; // 业务类型名称
            cardNumber: string; // 卡号
            consumeFeeAmount: string; // 动账消费手续费金额
            createTime: string; // 处理时间
            ditchName: string; // 渠道名称
            frozenAmount: string; // 动账冻结金额
            hash: string; // 动账Hash
            id: string; // ID
            mainBusinessNo: string; // 主订单号
            operateType: 1 | 2; // 动账人:1=系统,2=用户
            orderNo: string; // 流水号
            transactionState: number; // 交易状态
            transactionStateName: string; // 交易状态名称
            transactionTime: string; // 交易时间
            version: number; // 动账版本
        }[]
    } & TableResultType> {
        return this.api.post('/accountCardAssetLog/list', params);
    }

    assetTypeChoose(): Promise<{ name: string; code: number }[]> {
        return this.api.get('/accountCardAssetLog/assetTypeChoose');
    }

    // 统计
    statistics(params: {
        accountId: string; // 用户ID
        amount: string; // 动账金额
        assetType: null | number; // 资金流水类型
        businessType: null | number; // 业务类型
        cardNumber: string; // 卡号
        childOrderNo: string; // 子订单号
        currency: string; // 币种
        ditchCode: string; // 渠道编码
        endTime: string; // 处理结束,2000-01-02 00:00:00
        mainOrderNo: string; // 主订单号
        orderNo: string; // 流水号
        startTime: string; // 处理开始,2000-01-02 00:00:00
        transactionEndTime: string; // 交易结束时间,2000-01-02 00:00:00
        transactionStartTime: string; // 交易开始时间,2000-01-01 00:00:00
        transactionState: null | number; // 交易状态
        pageSize: number; // 每页条数
        pageNo: number; // 页数
    }): Promise<{
        changeAmountTotal: string;
    }> {
        return this.api.post('/accountCardAssetLog/statistics', params);
    }
}

export default new FetchTest();
