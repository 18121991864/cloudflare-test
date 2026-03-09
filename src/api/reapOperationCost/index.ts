import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';

class FetchTest extends Api {
    monthlyAccListPage(params: { // 主账户月度流水分页查询
        authorizationCurrency: string; // 授权货币
        cardId: string; // 渠道卡ID\
        last4: string; // 卡片后四位
        originalTransactionId: string; // 原始交易ID
        pageNo: number; // 页码
        pageSize: number; // 每页大小
        referenceNo: string; // 参考编号
        settlementCurrency: string; // 结算货币
        status: number; // 状态
        transactionEndDate: string; // 交易结束时间
        transactionId: string; // TID
        transactionStartDate: string; // 交易开始时间
        transactionType: number; // 交易类型
    }): Promise<{
        list: {
            accIn: string; // In
            accOut: string; // Out
            authorizationAmount: string; // 授权金额
            authorizationConversionRate: string; // 授权转换率
            authorizationCurrency: string; // 授权币种
            authorizationCurrencyName: string; // 授权币种名称
            balance: string; // 余额
            caasAtmFee: string; // Caas atm费
            caasFxFee: string; // Caas fx费
            cardHolder: string; // 持卡人
            cardId: string; // 渠道卡ID
            description: string; // 描述
            foreignPhysicalTransaction: string; // 国外实体交易
            id: string; // 主键
            last4: string; // 卡片后四位
            mccPadding: string; // MCC Padding
            merchantId: string; // 商户ID
            merchantName: string; // 商户名称
            originalTransactionId: string; // 原始TID
            reapAtmFee: string; // Reap atm手续费
            reapFxFee: string; // Reap fx手续费
            referenceNo: number; // 参考编号
            settlementAmount: number; // 结算金额
            settlementCurrency: string; // 结算币种
            settlementCurrencyName: string; // 结算币种名称
            status: string; // 状态
            transactionDate: string; // 交易时间
            transactionId: string; // TID
            transactionType: string; // 交易类型
            transactionTypeName: string; // 交易类型名称
        }[]
    } & TableResultType> {
        return this.api.post('/reapOperationCost/monthlyAcc/listPage',  params);
    }

     // 主流水月度流水状态下拉列表
    monthlyAccListStatus(): Promise<{
        name: string;
        value: string;
    }[]> {
        return this.api.get('/reapOperationCost/monthlyAcc/listStatus');
    }

    // 主账户月度流水授权币种下拉列表
    listAuthorizationCurrency(): Promise<{
        name: string;
        value: string;
    }[]> {
        return this.api.get('/reapOperationCost/monthlyAcc/listAuthorizationCurrency');
    }

    // 主账户月度流水结算币种下拉列表
    listSettlementCurrency(): Promise<{
        name: string;
        value: string;
    }[]>
    {
        return this.api.get('/reapOperationCost/monthlyAcc/listSettlementCurrency');
    }

    // 主账户月度流水交易类型下拉列表
    listTransactionType(): Promise<{
        name: string;
        value: string;
    }[]>
    {
        return this.api.get('/reapOperationCost/monthlyAcc/listTransactionType');
    }

    // 主账户月度流水导出
    exportMonthlyAcc(params: {
        authorizationCurrency: string; // 授权货币
        cardId: string; // 渠道卡ID
        last4: string; // 卡片后四位
        originalTransactionId: string; // 原始交易ID
        referenceNo: string; // 参考编号
        settlementCurrency: string; // 结算货币
        status: number; // 状态
        transactionEndDate: string; // 交易结束时间
        transactionId: string; // TID
        transactionStartDate: string; // 交易开始时间
        transactionType: number; // 交易类型
    }): Promise<Blob> {
        return this.api.post('/reapOperationCost/monthlyAcc/export', params, { responseType: 'blob' });
    }

    // 主账户每日流水分页查询
    dailyAccListPage(params: {
        cardId: string;
        channel: string;
        chargeModel: string;
        event: string;
        isFx: string;
        pageNo: number;
        pageSize: number;
        transactionEndDate: string;
        transactionId: string;
        transactionStartDate: string;
    }): Promise<{
        list: {
            applePayOnlineFee: number; // applyPay线上费
            applePayPosFee: number; // applePayPOS费
            atmBalanceEnquiry: string; // atm余额查询
            atmMarkup: number; // atm加价
            atmPinChange: string; // atm pin 更改
            atmRevenue: string; // atm收入
            atmWithdrawal: number; // atm取现金额
            billAmount: string; // 账单金额
            cardId: string; // 渠道卡Id
            channel: string; // channel
            chargeModel: string; // 收费模式
            createTime: string; //
            customerAmount: number; // 客户金额
            event: string; // 事件
            fixedVisaThreddSettlementFee: number; // 固定visa/thredd结算费
            forwardingFee: number; // 3ds转发费
            frictionlessFee: number; // 3ds无感支付费用
            fxBase: number; // fx基础
            fxMarkup: number; // fx加价
            fxRevenue: number; // fx金额
            fxTotal: number; // fx总额
            grossInterchange: number; // 总交换金额
            id: string; // 主键
            isFx: boolean; // 是否FX
            mccPadding: string; // MCC Padding
            netInterchange: number; // 网络交换金额
            smsFee: number; // 3DS短信费用
            timestamp: string; // 交易时间
            totalAtm: number; // ATM总额
            transactionId: string; // TID
            variableVisaThreddSettlementFee: number; // 变量Visa/Thredd结算费
            visaThreddAuthorizationFee: number; // Visa/Thredd授权费
            vtsTokenProvisioning: number; // VTS-令牌配置
            vtsUsage: number; // VTS-使用情况
        }[]
    } & TableResultType> {
        return this.api.post('/reapOperationCost/dailyAcc/listPage', params);
    }

    // 每日流水授权币种下拉列表
    dailyAccListAuthorizationCurrency(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/dailyAcc/listAuthorizationCurrency');
    }

    // 每日流水状态下拉列表
    dailyAccListStatus(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/dailyAcc/listStatus');
    }

    // 每日流水结算币种下拉列表
    dailyAccListSettlementCurrency(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/dailyAcc/listSettlementCurrency');
    }

    // 每日流水交易类型下拉列表
    dailyAccListTransactionType(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/dailyAcc/listTransactionType');
    }

    // 主账户每日流水导出
    exportDailyAcc(params: {
        authorizationCurrency: string; // 授权货币
        cardId: string; // 渠道卡ID
        last4: string; // 卡片后四位
        originalTransactionId: string; // 原始交易ID
        referenceNo: string; // 参考编号
        settlementCurrency: string; // 结算货币
        status: number; // 状态
        transactionEndDate: string; // 交易结束时间
        transactionId: string; // TID
        transactionStartDate: string; // 交易开始时间
        transactionType: number; // 交易类型
    }): Promise<Blob> {
        return this.api.post('/reapOperationCost/dailyAcc/export', params, { responseType: 'blob' });
    }

    // 每月交易费分页查询
    monthlyTransactionFeeListPage(params: {
        cardId: string;
        channel: string;
        chargeModel: string;
        event: string;
        isFx: string;
        pageNo: number;
        pageSize: number;
        transactionEndDate: string;
        transactionId: string;
        transactionStartDate: string;
    }): Promise<{
        list: {
            applePayOnlineFee: number; // applyPay线上费
            applePayPosFee: number; // applePayPOS费
            atmBalanceEnquiry: string; // atm余额查询
            atmMarkup: number; // atm加价
            atmPinChange: string; // atm pin 更改
            atmRevenue: string; // atm收入
            atmWithdrawal: number; // atm取现金额
            billAmount: string; // 账单金额
            cardId: string; // 渠道卡Id
            channel: string; // channel
            chargeModel: string; // 收费模式
            createTime: string; //
            customerAmount: number; // 客户金额
            event: string; // 事件
            fixedVisaThreddSettlementFee: number; // 固定visa/thredd结算费
            forwardingFee: number; // 3ds转发费
            frictionlessFee: number; // 3ds无感支付费用
            fxBase: number; // fx基础
            fxMarkup: number; // fx加价
            fxRevenue: number; // fx金额
            fxTotal: number; // fx总额
            grossInterchange: number; // 总交换金额
            id: string; // 主键
            isFx: boolean; // 是否FX
            mccPadding: string; // MCC Padding
            netInterchange: number; // 网络交换金额
            smsFee: number; // 3DS短信费用
            timestamp: string; // 交易时间
            totalAtm: number; // ATM总额
            transactionId: string; // TID
            variableVisaThreddSettlementFee: number; // 变量Visa/Thredd结算费
            visaThreddAuthorizationFee: number; // Visa/Thredd授权费
            vtsTokenProvisioning: number; // VTS-令牌配置
            vtsUsage: number; // VTS-使用情况
        }[]
    } & TableResultType> {
        return this.api.post('/reapOperationCost/monthlyTransactionFee/listPage', params);
    }

    // 每月交易费收费模式下拉列表
    monthlyTransactionFeeListChargeModel(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/monthlyTransactionFee/listChargeModel');
    }

    // 每月交易渠道下拉列表
    monthlyTransactionFeeListChannel(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/monthlyTransactionFee/listChannel');
    }

    // 每月交易费事件下拉列表
    monthlyTransactionFeeListEvent(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/monthlyTransactionFee/listEvent');
    }

    // 每月交易费导出
    exportMonthlyTransactionFee(params: {
        cardId: string;
        channel: string;
        chargeModel: string;
        event: string;
        isFx: string;
        pageNo: number;
        pageSize: number;
        transactionEndDate: string;
        transactionId: string;
        transactionStartDate: string;
    }): Promise<Blob> {
        return this.api.post('/reapOperationCost/monthlyTransactionFee/export', params, { responseType: 'blob' });
    }

    // 每月非交易费分页查询
    monthlyNonTransactionFeeListPage(params: {
        cardId: string;
        channel: string;
        event: string;
        pageNo: number;
        pageSize: number;
        transactionEndDate: string;
        transactionStartDate: string;
    }): Promise<{
        list: {
            cardId: string; // 渠道卡Id
            channel: string; // channel
            event: string; // 事件
            id: string; // 主键
            timestamp: string; // TID
        }[]
    } & TableResultType> {
        return this.api.post('/reapOperationCost/monthlyNonTransactionFee/listPage', params);
    }

    // 每月非交易渠道下拉列表
    monthlyNonTransactionFeeListChannel(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/monthlyNonTransactionFee/listChannel');
    }

    // 每月交易费事件下拉列表
    monthlyNonTransactionFeeListEvent(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/monthlyNonTransactionFee/listEvent');
    }

    // 每月非交易费导出
    ExportMonthlyNonTransactionFee(params: {
        cardId: string;
        channel: string;
        event: string;
        pageSize: number;
        transactionEndDate: string;
        transactionStartDate: string;
    }): Promise<Blob> {
        return this.api.post('/reapOperationCost/monthlyNonTransactionFee/export', params, { responseType: 'blob' });
    }

    // 每日交易费分页查询
    dailyTransactionFeeListPage(params: {
        cardId: string; // 渠道卡ID
        channel: string; // channel
        chargeModel: string; // 收费模式
        event: string; // 事件
        isFx: string; // 是否FX
        pageNo: number; // 页码
        pageSize: number; // 每页大小
        transactionEndDate: string; // 交易结束时间
        transactionId: string; // TID
        transactionStartDate: string; // 交易开始时间
    }): Promise<{
        list: {
            applePayOnlineFee: number; // applyPay线上费
            applePayPosFee: number; // applePayPOS费
            atmBalanceEnquiry: string; // atm余额查询
            atmMarkup: number; // atm加价
            atmPinChange: string; // atm pin 更改
            atmRevenue: string; // atm收入
            atmWithdrawal: number; // atm取现金额
            billAmount: string; // 账单金额
            cardId: string; // 渠道卡Id
            channel: string; // channel
            chargeModel: string; // 收费模式
            createTime: string; //
            customerAmount: number; // 客户金额
            event: string; // 事件
            fixedVisaThreddSettlementFee: number; // 固定visa/thredd结算费
            forwardingFee: number; // 3ds转发费
            frictionlessFee: number; // 3ds无感支付费用
            fxBase: number; // fx基础
            fxMarkup: number; // fx加价
            fxRevenue: number; // fx金额
            fxTotal: number; // fx总额
            grossInterchange: number; // 总交换金额
            id: string; // 主键
            isFx: boolean; // 是否FX
            mccPadding: string; // mcc_padding
            netInterchange: number; // 网络交换金额
            smsFee: number; // 3ds短信费用
            timestamp: string; // 交易时间
            totalAtm: number; // atm总额
            transactionId: string; // TID
            variableVisaThreddSettlementFee: number; // 变量visa/thredd结算费
            visaThreddAuthorizationFee: number; // visa/thredd搜全非
            vtsTokenProvisioning: number; // VTS-令牌配置
            vtsUsage: number; // vts-使用情况
        }
    } & TableResultType> {
        return this.api.post('/reapOperationCost/dailyTransactionFee/listPage', params);
    }

    // 每日交易费导出
    dailyTransactionFeeExport(params: {
        cardId: string; // 渠道卡ID
        channel: string; // channel
        chargeModel: string; // 收费模式
        event: string; // 事件
        isFx: string; // 是否FX
        pageNo: number; // 页码
        pageSize: number; // 每页大小
        transactionEndDate: string; // 交易结束时间
        transactionId: string; // TID
        transactionStartDate: string; // 交易开始时间
    }): Promise<Blob> {
        return this.api.post('/reapOperationCost/dailyTransactionFee/export', params, { responseType: 'blob' });
    }

    // 每日交易渠道下拉列表
    dailyTransactionFeeListChannel(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/dailyTransactionFee/listChannel');
    }

    // 每月交易费事件下拉列表
    dailyTransactionFeeListEvent(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/dailyTransactionFee/listEvent');
    }

    // 每日交易费收费模式下拉列表
    dailyTransactionFeeChargeModel(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/dailyTransactionFee/listChargeModel');
    }

    // 账单类型
    billListType(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/reapOperationCost/bill/listType');
    }

    // 账单生成历史查询
    billHistoryListPage(params: {
        pageNo: number;
        pageSize: number;
    }): Promise<{
        list: {
            createBy: string; // 操作人
            createTime: string; // 操作时间
            fileType: string; // 账单类型
            fileUrl: string; // string
            id: string; // 主键id
            selectDate: string; // 选择时间
        }[]
    } & TableResultType> {
        return this.api.post('/reapOperationCost/billHistory/listPage', params);
    }

    // 账单生成
    billCreate(params: {
        date: string;
        fileType: string;
    }): Promise<boolean> {
        return this.api.get('/reapOperationCost/bill/create', { params });
    }

    // 账单下载
    billDown(params: { id: string }): Promise<string> {
        return this.api.get('/reapOperationCost/bill/down', { params });
    }
}

export default new FetchTest();
