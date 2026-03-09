import { Api } from '@/api/api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    getPage(params: {
        accountCardId: string; // 内部卡ID
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
    }): Promise<{
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
            customerNo: string; // 客户编号
            accountCardId: string;
            ditchOrderNo: string; // 渠道关联号
        }[]
    } & TableResultType> {
        return this.api.post('/ditchFinancePaytrades/getPage', params);
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
        customerNo: string; // 客户编号
        accountCardId: string;
        ditchOrderNo: string; // 渠道关联号
        pageSize: number; // 每页条数
        pageNo: number; // 页数
    }): Promise<{
        amount: number;
        currency: string; //
        label: string;
        type: number; //
    }[]> {
        return this.api.post('/ditchFinancePaytrades/getAmountStatistics', params);
    }

    // paytrades授权列表
    transactionList(params: {
        accountCardId: string; // 卡id
        authorizationStatus: null | '交易成功' | '交易失败'; // 预授权交易状态: 交易成功 交易失败
        cardNumber: string; // 卡号
        cardStatus: null | 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // 卡片状态,可用值:ACTIVE,INACTIVE,BLOCKED
        ditchCardId: string; // 渠道卡id
        endTime: string; // 结束时间
        id: string; // 主键ID
        internalCardId: string; // 内部卡id
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        settlementStatus: null | '交易成功' | '交易处理中'; // 结算状态,可用值:交易成功,交易处理中
        startTime: string; // 开始时间
        status: null | 'PENDING' | 'SUCCESS' | 'FAILED'; // 结算交易状态,可用值:PENDING,SUCCESS,FAILED
        token?: string; // 卡片Token
        transactionId: string; // 交易关联ID
        type?: null | 'DEBIT' | 'CREDIT'; // 结算交易类型,可用值:DEBIT,CREDIT
        uuid?: string; // (渠道交易id)UUID
    }): Promise<{
        list: {
            accountCardId: string; // 卡id
            authorizationStatus: string; // 预授权交易状态: 交易成功 交易失败
            authorizationStatusCode: number; // 授权交易状态码 payState.01-处理中 payState.02-成功 payState.04-失败
            authorizedAt: string; // 授权交易时间
            cardCurrencyCode: string; // (折算本位币种)开卡币种
            cardNumber: string; // 卡号
            cardStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // 卡片状态,可用值:ACTIVE,INACTIVE,BLOCKED
            customerCardAmount: number; // 折算本位金额(开卡币种)
            customerDisplayName: string; // 客户展示名称
            customerName: string; // 客户名称
            customerNo: string; // 客户编号
            customerSettlementAmount: number; // 客户结算金额(结算币种)
            ditchCardId: string; // 渠道卡id
            id: string; // 主键ID
            internalCardId: string; // 内部卡id
            merchantCategoryCode: string; // 商户MCC
            merchantCity: string; // 商户城市
            merchantCountry: string; // 商户国家
            merchantName: string; // 商户名称
            note: string; // 渠道备注
            originalAmount: number; // (原始金额)授权金额
            originalCurrencyCode: string; // (原始币种)授权币种
            responseCode: string; // 响应代码
            settledAt: string; // 结算交易时间
            settlementCurrencyCode: string; // 结算币种
            settlementStatus: 'PENDING' | 'COMPLETED'; // 结算状态,可用值:PENDING,COMPLETED
            status: 'PENDING' | 'SUCCESS' | 'FAILED'; // 结算交易状态,可用值:PENDING,SUCCESS,FAILED
            token: string; // 卡片Token
            transactionId: string; // (交易关联)交易ID
            type: 'DEBIT' | 'CREDIT'; // 结算交易类型,可用值:DEBIT,CREDIT
        }[]
    } & TableResultType> {
        return this.api.post('/ditchFinancePaytrades/transactionList', params);
    }

    // 结算列表
    settlementList(params: {
        accountCardId: string; // 卡id
        authorizationStatus: null | '交易成功' | '交易失败'; // 预授权交易状态: 交易成功 交易失败
        cardNumber: string; // 卡号
        cardStatus: null | 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // 卡片状态,可用值:ACTIVE,INACTIVE,BLOCKED
        ditchCardId: string; // 渠道卡id
        endTime: string; // 结束时间
        id: string; // 主键ID
        internalCardId: string; // 内部卡id
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        settlementStatus: null | '交易成功' | '交易处理中'; // 结算状态,可用值:交易成功,交易处理中
        startTime: string; // 开始时间
        status: null | 'PENDING' | 'SUCCESS' | 'FAILED'; // 结算交易状态,可用值:PENDING,SUCCESS,FAILED
        token?: string; // 卡片Token
        transactionId: string; // 交易关联ID
        type?: null | 'DEBIT' | 'CREDIT'; // 结算交易类型,可用值:DEBIT,CREDIT
        uuid?: string; // (渠道交易id)UUID
    }): Promise<{
        list: {
            accountCardId: string; // 卡id
            authorizationStatus: string; // 预授权交易状态: 交易成功 交易失败
            authorizationStatusCode: number; // 授权交易状态码 payState.01-处理中 payState.02-成功 payState.04-失败
            authorizedAt: string; // 授权交易时间
            cardCurrencyCode: string; // (折算本位币种)开卡币种
            cardNumber: string; // 卡号
            cardStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // 卡片状态,可用值:ACTIVE,INACTIVE,BLOCKED
            customerCardAmount: number; // 折算本位金额(开卡币种)
            customerDisplayName: string; // 客户展示名称
            customerName: string; // 客户名称
            customerNo: string; // 客户编号
            customerSettlementAmount: number; // 客户结算金额(结算币种)
            ditchCardId: string; // 渠道卡id
            id: string; // 主键ID
            internalCardId: string; // 内部卡id
            merchantCategoryCode: string; // 商户MCC
            merchantCity: string; // 商户城市
            merchantCountry: string; // 商户国家
            merchantName: string; // 商户名称
            note: string; // 渠道备注
            originalAmount: number; // (原始金额)授权金额
            originalCurrencyCode: string; // (原始币种)授权币种
            responseCode: string; // 响应代码
            settledAt: string; // 结算交易时间
            settlementCurrencyCode: string; // 结算币种
            settlementStatus: 'PENDING' | 'COMPLETED'; // 结算状态,可用值:PENDING,COMPLETED
            status: 'PENDING' | 'SUCCESS' | 'FAILED'; // 结算交易状态,可用值:PENDING,SUCCESS,FAILED
            token: string; // 卡片Token
            transactionId: string; // (交易关联)交易ID
            type: 'DEBIT' | 'CREDIT'; // 结算交易类型,可用值:DEBIT,CREDIT
        }[]
    } & TableResultType> {
        return this.api.post('/ditchFinancePaytrades/settlementList', params);
    }

    // paytrades赎回列表
    redemptionList(params: {
        accountNo: string; // 账户号
        currencyCode: string; // 交易币种
        ditchCardId: string; // 渠道卡id
        endTime: string; // 结束时间
        internalCardId: string; // 内部卡id
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        startTime: string; // 开始时间
        transactionId: string; // (交易关联) ID
        type: 1 | 2 | null; // 业务类型,可用值:充值赎回 赎回手续费
        uuid: string; // UUID(渠道交易id)
    }): Promise<{
        list: {
            accountNo: string; // 账户号
            amount: string; // 交易金额
            createTime: string; // 交易发生时间
            currencyCode: string; // 交易币种
            ditchCardId: string; // 内部卡id
            frozenAmount: string; // 冻结金额
            id: string; // id
            internalCardId: string; // 渠道卡id
            newAmount: string; // 变动后余额
            newFrozenAmount: string; // 操作后冻结金额
            note: string; // 备注
            transactionId: string; // (交易关联) ID
            type: 1 | 2; // 业务类型,可用值:充值赎回 赎回手续费
            uuid: string; // UUID(渠道交易id)
        }[]
    } & TableResultType> {
        return this.api.post('/ditchFinancePaytrades/redemptionList', params);
    }

    // 结算表 交易类型下拉列表复制地址复制文档
    settlementMessageTypeList(): Promise<{ code: string; name: string; }[]> {
        return this.api.get('/ditchFinancePaytrades/settlementMessageTypeList');
    }
}

export default new FetchTest();
