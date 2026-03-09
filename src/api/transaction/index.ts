import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';
import type { Pagination } from '@/api/type';

class FetchTest extends Api {
    fetchDepositList(params: {
        orderNo: string; // 订单号
        toAddress: string; // 目标地址
        state: 0 | 1 | 2 | 3 | 4; // 0、全部 1、等待充值 2、成功 3、超时 4、链失败
        pageNo: number;
        pageSize: number;
        transferOrderNo: string;
        uid: string;
        endTime: string;
        startTime: string;
    }): Promise<
        {
            list: {
                amount: string; // 金额
                chainTag: string; // 链
                createTime: string;
                id: string;
                orderNo: string; // 订单号
                symbol: string; // 币种
                toAddress: string; // 目标地址
                state: 1 | 2 | 3 | 4 | 5 | 6; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单
                accountId: string; // uid
                intoTime: string; // 到账时间
                transferOrderNo: string; // 链充币订单号
            }[];
        } & TableResultType
    > {
        // 用户充币-列表
        return this.api.get('/transaction/depositList', { params });
    }

    // 用户新充值记录
    fetchTransactionNewDepositList(params: {
        accountId: string; //
        agentId: string; //
        amount: number;
        txHash: string;
        fromAddress: string;
        toAddress: string;
        type: number;
        state: number;
        freeze: number | null;
        riskControlLevel: number | null;
        endTimeStamp: string;
        beginTimeStamp: string;
        uid: string;
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                accountId: string; // uid
                agentId: string; // 代理商Id
                amount: string; // 金额
            }[];
        } & TableResultType
    > {
        return this.api.get('/transaction/newDepositList', { params });
    }

    // 用户新充值记录 金额
    fetchGetNewDepositAmountTotalt(params: {
        accountId: string; //
        agentId: string; //
        amount: number;
        txHash: string;
        fromAddress: string;
        toAddress: string;
        type: number;
        state: number;
        freeze: number | null;
        riskControlLevel: number | null;
        endTimeStamp: string;
        beginTimeStamp: string;
        uid: string;
        pageNo: number;
        pageSize: number;
    }): Promise<any> {
        return this.api.get('/transaction/getNewDepositAmountTotal', { params });
    }

    fetchTransactionWithdrawList(params: {
        endTime: string; // 结束时间
        startTime: string; // 开始时间
        orderNo: string; // hash
        hash: string; // 订单号
        state: 0 | 1 | 2 | 3 | 4 | 5; // 状态 1、成功 2、钱包处理中 3、失败 4、审核中 5、审核拒绝
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                accountId: string; // 用户ID
                agentType: string; // 1、平台 2、其他
                amount: string; // 总金额
                id: string;
                chainTag: string; // 链
                coinOutStatus: string; // 钱包提币审核状态： 0待审核中 1可提币 2审核失败
                createTime: string; // 创建时间
                state: 1 | 2 | 3 | 4 | 5;
                feeAmount: string; // 平台手续费
                walletFeeAmount: string; // 钱包手续费
                fromAddress: string; // 源地址
                orderNo: string; // 订单号
                symbol: string; // 币种
                check: 1 | 2; // 是否可审核 1、是 2、否
                toAddress: string; // 目标地址
                toAmount: string; // 到账金额
                txHash: string; // hash
                type: string; // 2、提币
                walletState: string; // 钱包状态： waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
            }[];
        } & TableResultType
    > {
        // 用户充币-列表
        return this.api.get('/transaction/withdrawList', { params });
    }

    fetchgetWithdrawAmountTotal(params: {
        endTime: string; // 结束时间
        startTime: string; // 开始时间
        orderNo: string; // hash
        hash: string; // 订单号
        state: 0 | 1 | 2 | 3 | 4 | 5; // 状态 1、成功 2、钱包处理中 3、失败 4、审核中 5、审核拒绝
        pageNo: number;
        pageSize: number;
    }): Promise<{
        toAmountTotal: string; // 到账总金额
        withdrawAmountTotal: string; //提现总金额
    }> {
        // 用户充币-金额总数
        return this.api.get('/transaction/getWithdrawAmountTotal', { params });
    }

    fetchwithdrawExport(params: {
        endTime: string; // 结束时间
        startTime: string; // 开始时间
        orderNo: string; // hash
        hash: string; // 订单号
        state: 0 | 1 | 2 | 3 | 4 | 5; // 状态 1、成功 2、钱包处理中 3、失败 4、审核中 5、审核拒绝
        pageNo: number;
        pageSize: number;
    }): Promise<any> {
        // 用户充币-导出
        return this.api.get('/transaction/withdraw/export', { params, responseType: 'blob' });
    }

    fetchgetwithdrawManualRemark(params: { id: string; manualRemark: string }): Promise<any> {
        // 用户充币-备注
        return this.api.post('/transaction/withdrawManualRemark', params);
    }

    fetchTransactionWithdrawCheckConfigList(params: { pageNo: number; pageSize: number }): Promise<
        {
            list: {
                amount: string; // 金额
                coinId: string; // 币种id
                id: string;
                type: string; // 1、初审 2、复审
                userId: string; // 用户id
                createTime: string; // 创建时间
                updateTime: string; // 更新时间
            }[];
        } & TableResultType
    > {
        // 提币审核配置列表
        return this.api.get('/transaction/withdrawCheckConfigList', { params });
    }

    fetchdelWithdrawCheckConfig(params: { id: string }): Promise<any> {
        // 提币审核配置列表
        return this.api.post('/transaction/delWithdrawCheckConfig', params);
    }

    fetchupdateWithdrawCheckConfigState(params: { id: string }): Promise<any> {
        // 提币审核配置列表
        return this.api.post('/transaction/updateWithdrawCheckConfigState', params);
    }

    fetchTransactionWithdrawLimitList(params: {
        accountId: string; // 用户id
        range: 2 | 1 | 0 | ''; // 0、全部 1、全局 2、用户
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                accountId: string; // 用户id
                coinId: string; // 币id
                createTime: string; // 创建时间
                updateTime: string; // 更新时间
                day: string; // 每天最大限额
                hour: string; // 每笔最大限额
                id: string; // id
                range: string; // 1、全局 2、用户
                singleMax: string; // 每笔最大限额
                singleMin: string; // 每笔最小限额
                state: 1 | 2; // 状态：状态：1=启用，2=禁用
            }[];
        } & TableResultType
    > {
        // 提币额度配置列表
        return this.api.get('/transaction/withdrawLimitList', { params });
    }

    fetchTransactionSetWithdrawLimit(params: {
        // 添加提币额度配置
        accountId: string; // 用户id
        coinId: string; // 币id
        createTime: string; // 创建时间
        updateTime: string; // 更新时间
        day: string; // 每天最大限额
        hour: string; // 每笔最大限额
        range: string; // 1、全局 2、用户
        singleMax: string; // 每笔最大限额
        singleMin: string; // 每笔最小限额
        status: 1 | 2; // 状态：状态：1=启用，2=禁用
    }): Promise<any> {
        return this.api.post('/transaction/setWithdrawLimit', params);
    }

    fetchTransactionUpdateWithdrawLimit(params: {
        accountId: string; // 用户id
        coinId: string; // 币id
        createTime: string; // 创建时间
        updateTime: string; // 更新时间
        day: string; // 每天最大限额
        hour: string; // 每笔最大限额
        id: string; // id
        range: string; // 1、全局 2、用户
        singleMax: string; // 每笔最大限额
        singleMin: string; // 每笔最小限额
        state: 1 | 2; // 状态：状态：1=启用，2=禁用
    }): Promise<any> {
        return this.api.post('/transaction/updateWithdrawLimit', params);
    }

    fetchTransactionSetWithdrawCheckConfig(params: {
        // 添加提币审核配置
        amount: string; // 金额
        coinId: string; // 币种id
        type: string; // 1、初审 2、复审
        userId: string; // 用户id
        createTime: string; // 创建时间
        updateTime: string; // 更新时间
    }): Promise<any> {
        return this.api.post('/transaction/setWithdrawCheckConfig', params);
    }

    fetchTransactionUpdateWithdrawCheckConfig(params: {
        // 修改提币审核配置
        amount: string; // 金额
        coinId: string; // 币种id
        id: string;
        type: string; // 1、初审 2、复审
        userId: string; // 用户id
        createTime: string; // 创建时间
        updateTime: string; // 更新时间
    }): Promise<any> {
        return this.api.post('/transaction/updateWithdrawCheckConfig', params);
    }

    fetchTransactionAfreshTransfer(params: {
        // 审核提币
        id: string; // id
        state: string; // 1、通过 2、拒绝¬
        loginPassword: string; // 交易密码
    }): Promise<any> {
        return this.api.post('/transaction/checkTransfer', params);
    }

    fetchTransactionBackTransferAmount(params: {
        // 退回提币失败的资产
        id: string; // id
        loginPassword: string;
    }): Promise<any> {
        return this.api.post('/transaction/backTransferAmount', params);
    }

    // 提币申请
    fetchTransactionWithdrawCoin(params: {
        // 提币申请
        address: string; // 地址
        amount: string; // 金额
        chainId: string; // 链id
        loginPassword: string; // 登录密码
        coinId: string; // 币种id
    }): Promise<any> {
        return this.api.post('/transaction/withdrawCoin', params);
    }

    fetchTransactionCheckTransfer(params: {
        // 重新提币
        id: string; // id
        loginPassword: string; // 交易密码
    }): Promise<any> {
        return this.api.post('/transaction/afreshTransfer', params);
    }

    fetchTransactionSetTradePwd(params: {
        // 设置提币钱包密码
        againTradePwd: string; // 确认交易密码
        newTradePwd: string; // 交易密码
    }): Promise<any> {
        return this.api.post('/transaction/setTradePwd', params);
    }

    fetchBargainList(params: {
        hash: string;
        orderNo: string; // 订单号
        toAddress: string; // 目标地址
        coinOutStatus: 0 | 1 | 2 | ''; // 钱包提币审核 0待审核中 1可提币 2审核失败
        type: 1 | 2 | ''; // 交易类型 1、充 2、提
        state: 1 | 2 | 3 | 4 | 5 | 6 | ''; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单
        walletStatus: string; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
        pageNo: number;
        pageSize: number;
        startTime: string;
        endTime: string;
        uid: string;
        riskCoinStatus: 0 | 1 | 2; // 冻结状态：0、全部 1、未冻结 2、冻结中
        riskLevel: 0 | 1 | 2 | 3 | 4; // 风控等级，0、全部 1、低 2、中 3、高 4、严重
    }): Promise<
        {
            list: {
                amount: string; // 金额
                chainTag: string; // 链
                coinOutStatus: 0 | 1 | 2; // 钱包提币审核 0待审核中 1可提币 2审核失败
                createTime: string;
                ditchName: string; // 渠道
                agentName: string; // 代理商
                cardNo: string; // 卡号
                fromAddress: string; // 源地址
                id: string;
                orderNo: string; // 订单号
                symbol: string; // 币种
                toAddress: string; // 目标地址
                txHash: string;
                type: 1 | 2; // 1、充值 2、提币
                state: 1 | 2 | 3 | 4 | 5 | 6; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单
                walletState: 0; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
                accountId: string; // 用户ID
                agentType: 1 | 2; // 1、平台 2、其他
                depositOrder: string; // 充币订单号
            }[];
        } & TableResultType
    > {
        // 充币列表
        return this.api.get('/transaction/transferList', { params });
    }

    featchgetTransferAmountTotal(params: {
        hash: string;
        orderNo: string; // 订单号
        toAddress: string; // 目标地址
        coinOutStatus: 0 | 1 | 2 | ''; // 钱包提币审核 0待审核中 1可提币 2审核失败
        type: 1 | 2 | ''; // 交易类型 1、充 2、提
        state: 1 | 2 | 3 | 4 | 5 | 6 | ''; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单
        walletStatus: string; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
        pageNo: number;
        pageSize: number;
        startTime: string;
        endTime: string;
        uid: string;
        riskCoinStatus: 0 | 1 | 2; // 冻结状态：0、全部 1、未冻结 2、冻结中
        riskLevel: 0 | 1 | 2 | 3 | 4; // 风控等级，0、全部 1、低 2、中 3、高 4、严重
    }): Promise<string> {
        // 充币 金额
        return this.api.get('/transaction/getTransferAmountTotal', { params });
    }

    fetchBargainListExcel(params: {
        // 充提-导出
        hash: string;
        orderNo: string; // 订单号
        toAddress: string; // 目标地址
        coinOutStatus: 0 | 1 | 2 | ''; // 钱包提币审核 0待审核中 1可提币 2审核失败
        type: 1 | 2 | ''; // 交易类型 1、充 2、提
        state: 1 | 2 | 3 | 4 | 5 | 6 | ''; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单
        walletStatus: string; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
        startTime: string;
        endTime: string;
        uid: string;
        riskCoinStatus: 0 | 1 | 2; // 冻结状态：0、全部 1、未冻结 2、冻结中
        riskLevel: 0 | 1 | 2 | 3 | 4; // 风控等级，0、全部 1、低 2、中 3、高 4、严重
    }): Promise<any> {
        return this.api.get('/transaction/transferList/excelWriter', { params, responseType: 'blob' });
    }

    fetchBargainSearch(params: {
        orderNo: string; // 订单号
    }): Promise<{
        address: string; // 充值地址
        amount: string; // 金额
        createTime: string; // 时间
        name: string; // 名
        orderNo: string; // 充值订单号
        uid: string; // UID
        surname: string; // 姓
    }> {
        // 充提-搜索充值订单

        return this.api.get('/transaction/searchCardDeposit', { params });
    }

    fetchBargainMateCard(params: {
        id: string; // 充提记录Id
        orderNo: string; // 订单号
    }): Promise<any> {
        // 充提-匹配订单充值确定
        return this.api.post('/transaction/mateCardDeposit', params);
    }

    fetchBargainTransfer(params: {
        address: string; // 地址
        amount: string; // 金额
        chainTag: string; // 链
        itemId: string; // 钱包币种id
    }): Promise<any> {
        // 充提-发起提币
        return this.api.post('/transaction/transfer', params);
    }

    fetchBargainSetTradePwd(params: {
        newTradePwd: string; // 确认交易密码
        againTradePwd: string; // 交易密码
    }): Promise<any> {
        // 充提-设置交易密码
        return this.api.post('/transaction/setTradePwd', params);
    }

    fetchDepositListExcelWriter(params: {
        orderNo: string; // 订单号
        toAddress: string; // 目标地址
        state: 0 | 1 | 2 | 3 | 4; // 0、全部 1、等待充值 2、成功 3、超时 4、链失败
        pageNo: number;
        pageSize: number;
        transferOrderNo: string;
        uid: string;
        endTime: string;
        startTime: string;
    }): Promise<any> {
        return this.api.get('/transaction/depositList/excelWriter', { params, responseType: 'blob' });
    }

    fetchNewDepositListExportExcelWriter(params: {
        accountId: string; //
        agentId: string; //
        txHash: string;
        fromAddress: string;
        toAddress: string;
        type: number | null;
        state: number | null;
        freeze: number | null;
        riskControlLevel: number | null;
        endTimeStamp: string;
        beginTimeStamp: string;
        uid: string;
    }): Promise<any> {
        return this.api.get('/transaction/newDepositListExport', { params, responseType: 'blob' });
    }
}

export default new FetchTest();
