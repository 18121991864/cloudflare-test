import { Api } from '@/api/api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    getPage(params: {
        accountId: string; // 用户UID
        businessType: null | number; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
        cardNumber: string; // 卡号
        direction: null | number; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
        ditchCardId: string; // 渠道卡ID
        ditchSerialNo: string; // 渠道交易ID
        ditchTransactionId: string; // 交易关联ID
        entryBeginTime: string; // 入账开始时间
        entryEndTime: string; // 入账结束时间
        orderStatus: null | string; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
        orderType: null | string; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
        transactionAmount: string; // 交易金额
        transactionBeginTime: string; // 交易开始时间
        transactionEndTime: string; // 交易结束时间
        pageSize: number; // 每页条数
        pageNo: number; // 页数
    }): Promise<
        {
            list: {
                accountId: string; // 用户UID
                acquiringBankId: string; // 收单行ID
                batchNo: string; // 批次号
                businessType: number; // 业务类型键
                businessTypeName: string; // 业务类型名
                cardNumber: string; // 卡号
                childId: string; // 子ID(列表中子ID列取该字段)
                createTime: string; // 创建时间(平台入账时间)
                direction: number; // 收支类型键
                directionName: string; // 收支类型名
                ditchCardId: string; // 渠道卡ID
                ditchSerialNo: string; // 渠道交易ID
                ditchTransactionId: string; // 交易关联ID
                id: number; // 数据主键
                mainId: string; // 父ID(列表中ID列取该字段)
                merchantCity: string; // 商户所在城市
                merchantCountry: string; // 商户所在国家
                merchantId: string; // 商户ID
                merchantMcc: string; // 商户MCC
                merchantName: string; // 商户名称
                orderNo: string; // 订单号
                orderStatus: number; // 交易状态键
                orderStatusName: string; // 交易状态名
                orderType: number; // 订单类型键
                orderTypeName: string; // 订单类型名
                transactionAmount: number; // 交易金额
                transactionCurrency: string; // 交易币种
                transactionTime: string; // 交易时间
                updateTime: string; // 更新时间
            }[];
        } & TableResultType
    > {
        return this.api.post('/ditchFinanceKoipy/getPage', params);
    }

    // 获取业务类型
    getBusinessType(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/ditchFinanceKoipy/getBusinessType');
    }

    // 获取收支类型
    getDirectionType(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/ditchFinanceKoipy/getDirectionType');
    }

    // 获取交易状态
    getOrderStatus(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/ditchFinanceKoipy/getOrderStatus');
    }

    // 获取订单类型
    getOrderType(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/ditchFinanceKoipy/getOrderType');
    }

    // 查询金额统计
    getAmountStatistics(params: {
        accountId: string; // 用户UID
        businessType: null | number; // 业务类型(参考接口:/v1/ditchFinanceKoipy/getBusinessType)
        cardNumber: string; // 卡号
        direction: null | number; // 收支类型(参考接口:/v1/ditchFinanceKoipy/getDirectionType)
        ditchCardId: string; // 渠道卡ID
        ditchSerialNo: string; // 渠道交易ID
        ditchTransactionId: string; // 交易关联ID
        entryBeginTime: string; // 入账开始时间
        entryEndTime: string; // 入账结束时间
        orderStatus: null | string; // 交易状态(参考接口:/v1/ditchFinanceKoipy/getOrderStatus)
        orderType: null | string; // 订单类型(参考接口:/v1/ditchFinanceKoipy/getOrderType)
        transactionAmount: string; // 交易金额
        transactionBeginTime: string; // 交易开始时间
        transactionEndTime: string; // 交易结束时间
        pageSize: number; // 每页条数
        pageNo: number; // 页数
    }): Promise<
        {
            amount: number;
            currency: string; //
            label: string;
            type: number; //
        }[]
    > {
        return this.api.post('/ditchFinanceKoipy/getAmountStatistics', params);
    }

}

export default new FetchTest();
