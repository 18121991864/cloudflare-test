import { Api } from '../api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    getPage(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        accountId: string; // 用户UID
        businessType: number | null; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
        cardNumber: string; // 卡号
        direction: number | null; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
        ditchCardId: string; // 渠道卡ID
        ditchSerialNo: string; // 渠道交易ID
        ditchTransactionId: string; // 交易关联ID
        entryTimeBegin: string; // 入账时间(开始)[时间戳]
        entryTimeEnd: string; // 交易更新时间(结束)[时间戳]
        orderStatus: number; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
        orderType: number | null; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
        originalTransactionAmount: string; // 原始交易金额(参考接口:/v1/ditchFinanceOe/getOriginalTransactionCurrency)
        originalTransactionCurrency: string; // 原始交易币种
        transactionAmount: string; // 交易金额
        transactionCurrency: string; // 交易币种(参考接口:/v1/ditchFinanceOe/getTransactionCurrency)
        transactionTimeBegin: string; // 交易时间(开始)[时间戳]
        transactionTimeEnd: string; // 交易结束时间(结束)[时间戳]
        transactionUpdateTimeBegin: string; // 交易更新时间(开始)[时间戳]
        transactionUpdateTimeEnd: string; // 交易更新时间(结束)[时间戳]
    }): Promise<
        {
            list: {
                accountCardId: string;
                accountId: string; // 用户ID
                adjustType: number; // 调账类型
                adjustTypeName: string; // 调账类型名称
                aliasName: string; // 别名
                amount: string; // 金额
                cardNumber: string; // 卡号
                channelInfoId: string; // 渠道明细账务ID
                coinSymbol: string; // 充值币种
                consumeFee: string; // 渠道预扣手续费
                consumeFeeAmount: string; // 渠道预扣消费手续费
                createTime: string; // 创建时间
                customerNo: string; // 客户编号
                depositFee: string; // 充值手续费收入
                ditchAssetsId: string; // 渠道明细交易ID
                ditchCode: string; // 渠道编码
                ditchId: string; // 渠道Id
                ditchName: string; // 渠道名称
                executeExchangeRate: string; // 汇率
                fiatSymbol: string; // 到账币种
                id: string; // ID
                internalCardId: string; // 内部卡Id
                labelColor: string; // 标签颜色
                labelName: string; // 标签名称
                name: string; // 名
                openFee: string; // 开卡收入
                orderNo: string; // 订单号
                platformPreChargedFee: string; // 平台预扣手续费, OE 渠道字段
                platformPreChargedFeeSymbol: string; // 平台预扣手续费币种, OE 渠道字段
                platformRechargeAmount: string; // 平台通知充值金额, OE 渠道字段
                platformRechargeSymbol: string; // 平台通知充值币种, OE 渠道字段
                shippingInformationId: string; // 配送ID
                state: number; // 状态：1、等待充值 2、充值超时 3、待开卡/充卡 4、充币失败 5、成功 6、开卡失败 7、开卡中 8、开卡成功待充值 9充值失败 10、提款中 11、提款成功 12、提款失败 13、开卡退款成功 14、充值退款成功 15、失败
                stateStr: string;
                surname: string; // 姓
                toAmount: string; // 到账金额
                toCoinSymbol: string; // 到账金额
                topUpAmount: string; // 充值金额, OE 渠道字段
                totalFee: string; // 充值手续费
                transactionAmount: string; // 充值手续费
                type: number; // 类型：1=开卡，2=充值，3=提款,4=退款
                typeString: string;
            }[];
        } & TableResultType
    > {
        return this.api.post('/ditchFinanceOe/getPage', params);
    }

    accountingAmount(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        accountId: string; // 用户UID
        businessType: number | null; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
        cardNumber: string; // 卡号
        direction: number | null; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
        ditchCardId: string; // 渠道卡ID
        ditchSerialNo: string; // 渠道交易ID
        ditchTransactionId: string; // 交易关联ID
        entryTimeBegin: string; // 入账时间(开始)[时间戳]
        entryTimeEnd: string; // 交易更新时间(结束)[时间戳]
        orderStatus: number; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
        orderType: number | null; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
        originalTransactionAmount: string; // 原始交易金额(参考接口:/v1/ditchFinanceOe/getOriginalTransactionCurrency)
        originalTransactionCurrency: string; // 原始交易币种
        transactionAmount: string; // 交易金额
        transactionCurrency: string; // 交易币种(参考接口:/v1/ditchFinanceOe/getTransactionCurrency)
        transactionTimeBegin: string; // 交易时间(开始)[时间戳]
        transactionTimeEnd: string; // 交易结束时间(结束)[时间戳]
        transactionUpdateTimeBegin: string; // 交易更新时间(开始)[时间戳]
        transactionUpdateTimeEnd: string; // 交易更新时间(结束)[时间戳]
    }): Promise<{
        amount: string; // 金额
        currency: string; // 币种
        label: string; // 标签
        type: string; // 类型
    }> {
        return this.api.post('/ditchFinanceOe/accountingAmount', params);
    }

    // 查询交易币种
    getTransactionCurrency(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/ditchFinanceOe/getTransactionCurrency');
    }

    // 查询原始交易币种
    getOriginalTransactionCurrency(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/ditchFinanceOe/getOriginalTransactionCurrency');
    }

    // oe渠道原始数据
    transactionList(params: {
        cardNumber: string; // 卡号
        currency: string; // 交易币种
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        status: string; // 交易状态,可用值:交易成功,交易失败
        tradeId: string; // 渠道交易 ID
        type: string; // 交易类型 :消费授权,消费授权冲正,退款授权,退款授权冲正,授权查询
    }): Promise<
        {
            list: {
                accountCardId: string; // 卡id
                authorizedAt: string; // 授权交易时间(UTC时间)
                cardAmount: number; // 卡交易金额
                cardCurrencyCode: string; // (折算本位币种)开卡币种
                cardNumber: string; // 卡号
                cardStatus: string; // 卡片状态,可用值:正常,预注销,已注销
                customerCardAmount: number; // 折算本位金额
                customerDisplayName: string; // 客户展示名称
                customerName: string; // 客户名称
                customerNo: string; // 客户编号
                customerSettlementAmount: number; // 客户结算金额(结算币种)
                ditchCardId: string; // 渠道卡id
                id: string; // 唯一标识
                internalCardId: string; // 内部卡id
                merchantCategoryCode: number; // 商户 MCC
                merchantCity: string; // 商户城市
                merchantCountry: string; // 商户国家
                merchantName: string; // 商户名称
                note: string; // 渠道备注
                originalAmount: number; // (原始金额)授权金额
                originalCurrencyCode: string; // (原始币种)授权币种
                responseCode: string; // 响应代码
                responseDesc: string; // 响应描述
                settledAt: string; // 结算交易时间(UTC时间)
                settlementCurrencyCode: string; // 结算币种
                settlementStatus: string; // 结算状态,可用值:交易成功,交易处理中
                settlementStatusCode: string; // 结算状态码值,可用值:settleState.01-未结算 settleState.02-已结算
                status: string; // 授权交易状态,可用值:交易成功,交易失败
                token: string; // 卡片 Token
                transactionId: string; // (交易关联) ID
                type: string; // 业务类型,可用值:消费授权,消费授权冲正,退款授权,退款授权冲正,授权查询
                uuid: string; // UUID(渠道交易id)
            }[];
        } & TableResultType
    > {
        return this.api.post('/ditchFinanceOe/transactionList', params);
    }

    // 交易类型枚举列表
    tradeTypes(): Promise<
        {
            name: string;
            code: string;
            nameEn: string;
        }[]
    > {
        return this.api.get('/ditchFinanceOe/tradeTypes');
    }

    
    // 获取下拉枚举
    getCardTypeIdList(): Promise<{
        cardTypeId: string;
        cardTypeName: string;
    }[]> {
        return this.api.get('/ditchFinanceOe/cardTypeId');
    }
}

export default new FetchTest();
