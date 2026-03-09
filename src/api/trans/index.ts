import { TableResultType } from "@/interface/StateType";
import { Api } from '@/api/api';
import type {ChangeCard} from "@/api/type";

class FetchTest extends Api {
    // 授权列表
    transList(params: {
        pageSize: number;
        pageNo: number;
    }): Promise<{
        list: {
            arrivalAccount: string; // 到账账户
            arrivalAmount: string; // 到账金额
            authCode: string; // 授权码
            authFailedFeeAmount: string; // 失败交易手续费金额
            cardBalance: string; // 常规卡金额
            cardId: string; // cardId
            cardType: string; // 卡类型
            cardTypeName: string; // 卡类型名称
            code: string; // code
            conversionFeeAmount: string; // 汇率转换费金额
            createTime: string; //
            createdAt: string; // 创建时间
            crossBroadFeeAmount: string; // 跨境手续费金额
            feeDeductionAccount: string; // 手续费扣费账户
            feeDeductionAmount: number; // 手续费扣费金额
            feeDeductionCurrency: string; // 手续费扣费币种
            feeReturnAccount: string; // 手续费返还账户
            feeReturnAmount: number; // 手续费返还金额
            feeReturnCurrency: string; // 手续费返还币种
            fundInFeeAmount: string; // 汇入手续费金额
            gatewayFeeAmount: string; // 网关手续费金额
            id: string; // id
            matrixAccount: string; // matrix账户号
            mcc: string; // mcc
            memberId: string; // 会员ID
            merchantNameLocation: string; // 商户名称
            msg: string; // msg
            originTransactionId: string; // 原始交易ID
            refundFeeAmount: string; // 退款手续费金额
            requestId: string; // 商户请求ID
            status: string; // 状态
            statusName: string; // 状态名称
            transactionCurrency: string; /// 交易币种
            transactionFeeAmount: string; // 交易手续费金额
            transactionId: string; // 交易ID
            transactionType: string; // 交易类型
            transactionTypeName: string; // 交易类型名称
            txnPrincipalChangeAccount: string; // 交易本金变动账户
            txnPrincipalChangeAmount: number; // 交易本金预授权金额
            txnPrincipalChangeCurrency: string; // 交易本金变动币种
            updateTime: string; //
            updatedAt: string; // 更新时间
            voidFeeAmount: string; // 撤销手续费金额
        }[]
    } & TableResultType> {
        return this.api.post('/trans/photon/list', params);
    }

    // 导出授权列表
    photonExport(params: {
        pageSize: number;
        pageNo: number;
    }) {
        return this.api.post('/trans/photon/export', params, { responseType: 'blob' });
    }

    // 结算列表
    settleList(params: {
        cardId: string; // 渠道卡ID
        memberId: string; // 渠道客户编号
        originTransactionId: string; // 交易关联id
        pageNo: number; // 页数
        pageSize: number; // 每页条数
        settlementEndTime: string; // 结束时间
        settlementStartTime: string; // 开始时间
        timeHeader: string[];
        transactionId: string; // 渠道交易ID
        transactionStatus: string | null; // 交易状态
        transactionType: string | null; // 交易类型
    }): Promise<{
        list: {
            authCode: string; // 授权码
            cardId: string; // 渠道卡ID
            id: string; // id
            memberId: string; // 渠道客户编号
            merchantName: string; // 商户名称
            micc: string; // MICC
            originTransactionId: string; // 交易关联id
            settleAmount: string; // 交易金额
            settleCurrency: string; // 交易币种
            transactionAmount: string; // 原始交易金额
            transactionCountry: string; // 交易国家
            transactionCurrency: string; // 原始交易币种
            transactionHappenedTime: string; // 交易发生时间
            transactionId: string; // 渠道交易ID
            transactionStatus: string; // 交易状态
            transactionType: string; // 交易类型
            transactionTypeName: string; //
        }[]
    } & TableResultType> {
        return this.api.post('/settle/photon/list', params);
    }

    // 导出结算列表
    settleExport(params: {
        cardId: string; // 渠道卡ID
        memberId: string; // 渠道客户编号
        originTransactionId: string; // 交易关联id
        pageNo: number; // 页数
        pageSize: number; // 每页条数
        settlementEndTime: string; // 结束时间
        settlementStartTime: string; // 开始时间
        timeHeader: string[];
        transactionId: string; // 渠道交易ID
        transactionStatus: string | null; // 交易状态
        transactionType: string | null; // 交易类型
    }) {
        return this.api.post('/settle/photon/export', params, { responseType: 'blob' });
    }

    // 光子易账务明细
    ditchFinanceList(params: {
        accountId: string; // 用户UID
        agentName: string; // 所属代理商
        businessType: string | null; // 业务类型
        cardNumber: string; // 卡号
        direction: string | null; // 收支类型键
        ditchCardId: string; // 渠道卡ID
        ditchSerialNo: string; // 渠道交易ID
        ditchTransactionId: string; // 交易关联ID
        endCreateTime: string; // 平台入账时间(结束)
        endTransactionTime: string; // 交易时间(结束)
        endTransactionUpdateTime: string; // 更新时间(结束)
        labelId: string; // 用户标签
        orderStatus: null | string; // 交易状态
        orderType: null | string; // 订单类型
        originalAmount: string; // 原始交易金额
        originalCurrency: string | null; // 原始交易币种
        pageNo: number; // 页数
        pageSize: number; // 每页条数
        startCreateTime: string; // 平台入账时间(开始)
        startTransactionTime: string; // 交易时间(开始)
        startTransactionUpdateTime: string; // 更新时间(开始)
        transactionAmount: number; // 交易金额
        transactionCurrency: string; // 交易币种
    }): Promise<{
        list: {
            accountId: string; // 用户UID
            adjustType: 1 | 2 | 3; // 调账类型(1:不处理 2:补入账 3:冲正)
            agentName: string; // 所属代理商
            businessType: string; // 业务类型键
            businessTypeName: string; // 业务类型名
            cardNumber: string; // 卡号
            childId: string; // 子ID(列表中子ID列取该字段)
            commissionCurrency: string; // 手续费币种
            createTime: string; // 创建时间(平台入账时间)
            direction: string; // 收支类型键
            directionName: string; // 收支类型名
            ditchCardId: string; // 渠道卡ID
            ditchSerialNo: string; // 渠道交易ID
            ditchTransactionId: string; // 交易关联ID
            id: string; // 数据主键
            labelList: {
                accountIds: string; // 包含用户
                color: string; // 颜色
                createTime: string; // 创建日期
                id: string; // id
                name: string; // 名称
                operatorName: string; // 修改人
                sort: number; // 顺序
                updateTime: string; // 修改日期
            }[];
            labelNames: string; // 用户标签
            mainId: string; // 父ID(列表中ID列取该字段)
            merchantMcc: string; // 商户MCC
            merchantName: string; // 商户名称
            orderStatus: string; // 交易状态键
            orderStatusName: string; // 交易状态名
            orderType: string; // 订单类型键
            orderTypeName: string; // 订单类型名
            originalAmount: number; // 原始交易金额
            originalCurrency: string; // 原始交易币种
            transactionAmount: number; // 交易金额
            transactionCommission: number; // 交易手续费
            transactionCurrency: string; // 交易币种
            transactionTime: string; // 交易时间
            transactionUpdateTime: string; // 更新时间(交易)
        }[]
    } & TableResultType> {
        return this.api.post('/settle/photon/ditchFinanceList', params);
    }

    // 导出账务明细
    exportFinance(params: {
        accountId: string; // 用户UID
        agentName: string; // 所属代理商
        businessType: string | null; // 业务类型
        cardNumber: string; // 卡号
        direction: string | null; // 收支类型键
        ditchCardId: string; // 渠道卡ID
        ditchSerialNo: string; // 渠道交易ID
        ditchTransactionId: string; // 交易关联ID
        endCreateTime: string; // 平台入账时间(结束)
        endTransactionTime: string; // 交易时间(结束)
        endTransactionUpdateTime: string; // 更新时间(结束)
        labelId: string; // 用户标签
        orderStatus: null | string; // 交易状态
        orderType: null | string; // 订单类型
        originalAmount: string; // 原始交易金额
        originalCurrency: string | null; // 原始交易币种
        pageNo: number; // 页数
        pageSize: number; // 每页条数
        startCreateTime: string; // 平台入账时间(开始)
        startTransactionTime: string; // 交易时间(开始)
        startTransactionUpdateTime: string; // 更新时间(开始)
        transactionAmount: number; // 交易金额
        transactionCurrency: string; // 交易币种
    }) {
        return this.api.post('/settle/photon/exportFinance', params, { responseType: 'blob' });
    }

    // 查询金额统计
    getAmountStatistics(params: {
        accountId: string; // 用户UID
        agentName: string; // 所属代理商
        businessType: string | null; // 业务类型
        cardNumber: string; // 卡号
        direction: string | null; // 收支类型键
        ditchCardId: string; // 渠道卡ID
        ditchSerialNo: string; // 渠道交易ID
        ditchTransactionId: string; // 交易关联ID
        endCreateTime: string; // 平台入账时间(结束)
        endTransactionTime: string; // 交易时间(结束)
        endTransactionUpdateTime: string; // 更新时间(结束)
        labelId: string; // 用户标签
        orderStatus: null | string; // 交易状态
        orderType: null | string; // 订单类型
        originalAmount: string; // 原始交易金额
        originalCurrency: string | null; // 原始交易币种
        pageNo: number; // 页数
        pageSize: number; // 每页条数
        startCreateTime: string; // 平台入账时间(开始)
        startTransactionTime: string; // 交易时间(开始)
        startTransactionUpdateTime: string; // 更新时间(开始)
        transactionAmount: number; // 交易金额
        transactionCurrency: string; // 交易币种
    }) {
        return this.api.post('/settle/photon/getAmountStatistics', params);
    }

    // 交易状态下拉
    stateList(): Promise<{
        name: string;
        symbol: string;
    }[]> {
        return this.api.get('/trans/photon/stateList');
    }

    // 交易类型下拉
    transactionTypeList(): Promise<{
        code: string;
        name: string;
    }[]> {
        return this.api.get('/trans/photon/transactionTypeList');
    }


    queryOriginalCurrency(): Promise<string[]> {
        return this.api.get('/settle/photon/original/currency');
    }

    settleStatus(): Promise<{ }[]> {
        return this.api.get('/settle/photon/status');
    }

    // 光子易账务明细业务类型
    businessTypes(): Promise<{
        code: string;
        name: string;
    }[]> {
        return this.api.get('/settle/photon/business/types');
    }

    // 交易币种
    transactionCurrency(): Promise<string[]> {
        return this.api.get('/settle/photon/transaction/currency');
    }

    // 获取订单类型
    getOrderType(): Promise<{
        label: string;
        value: string;
    }[]> {
        return this.api.get('/settle/photon/getOrderType');
    }

    // 获取收支类型
    getDirectionType(): Promise<{
        label: string;
        value: string;
    }[]> {
        return this.api.get('/settle/photon/getDirectionType');
    }

}

export default new FetchTest();
