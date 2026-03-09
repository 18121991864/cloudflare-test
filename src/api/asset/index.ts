// eslint-disable-next-line max-classes-per-file
import { Api } from '../api';
import type { ChangeCard, ChangeCardList, Pagination } from '../type';
import type {
    sinoDitchTransactionLIst,
    sinoDitchTransactionPrams,
    TotalAmout,
    transferListPrams,
    transferList,
    withdrawListPrams,
    withdrawList,
    withdrawAmountTotal,
    newUserAssetParams,
    newUserAssetList,
    newUserAmountTotal,
    assetSnapshotParams,
    assetSnapshotLIst,
    userAssetSnapshotParams,
    userAssetSnapshotList,
    AssetSnapshotAmountTotal,
    agentAssetSnapshotListParams,
    agentAssetSnapshotList,
    snapshotListParams,
    snapshotList,
    snapshotListTotalAmount,
    accountCardsnapshotParams,
    accountCardsnapshotList,
    withdrawManualRemark,
    withdrawLimitList,
    newDepositParams,
    newDepositList,
    MarkeParams,
    MarkeParamsList,
    MarkeParamsListWithoutAdd,
    Symbols,
    fiatMarkeParamsListWithoutAdd,
    CoinParamsList,
    PasstoTransactionParams,
    PasstoTransactionList,
    AssetsJournaParams,
    AssetsJournaData,
    TypeList,
    AssetFrozenListType,
    AssetFrozenParams,
    PlatformAssetListType,
    PlatformAssetParams,
    WalletAssetListType,
    WalletAssetListData,
    FrozenBalanceParams,
    ParamsTransferLog,
    TransferLogData,
    GetPagePlatParams,
    GetPagePlatData,
    getPagePlatformPrams,
    getPagePlatformCardData,
    PlatformSnapshotParams,
    PlatformSnapshotData,
    CardCutPlatformParams,
    CardCutPlatformData,
    UserCutParams,
    PlatformCardAmout,
    PlatformCardCurreny,
    CardCutStatistics,
} from './types';
import type { getActionList } from '../channel/types.d';

class Asset extends Api {
    fetchCoinList(params: {
        symbol?: string; // 币种
        pageNo?: number;
        pageSize?: number;
    }) {
        // 币种-列表
        interface _Response extends Pagination {
            list: CoinParamsList[];
        }

        return this.api.get('/coin/list', { params }).then((result: any) => result as _Response);
    }

    fetchCoinInfo(params: { coinId: string; chainId: string }) {
        // 币种-列表
        interface _Response {
            chainId: string;
            chainTag: string;
            decimals: number;
            id: string;
            inAccountAmount: string;
            inMinAmount: string;
            inStatus: number;
            maxOutAmount: string;
            minOutAmount: string;
            name: string;
            outStatus: number;
            rechargeText: any;
            status: number;
            symbol: string;
            totalFee: string;
            walletFee: string;
            withdrawFee: string;
        }

        return this.api.get('/coin/info', { params }).then((result: any) => result as _Response);
    }

    coinUpdate(params: {
        // 编辑币种
        coinId: string;
        chainId: string;
        maxOutAmount: string;
        minOutAmount: string;
        rechargeText: any;
        walletFee: string;
        withdrawFee: string;
        inStatus: 1 | 0;
        outStatus: 1 | 0;
        status: 1 | 0;
    }) {
        return this.api.post('/coin/update', params);
    }

    fetchCoinState(params: {
        // 编辑状态
        coinId: string;
        chainId: string;
    }) {
        return this.api.get('/coin/updateState', { params });
    }

    fetchCoinUpdateOutState(params: {
        // 修改提币状态
        coinId: string;
        chainId: string;
    }) {
        return this.api.get('/coin/updateOutState', { params });
    }

    coinSetWithdrawFee(params: {
        // 编辑提币手续费
        coinId: string;
        chainId: string;
        walletFee: string | number; // 优易钱包手续费
        withdrawFee: string | number; // 平台手续费
    }) {
        return this.api.post('/coin/setWithdrawFee', params);
    }

    fetchCoinUpdateInState(params: {
        // 编辑充值状态
        coinId: string;
        chainId: string;
    }) {
        return this.api.get('/coin/updateInState', { params });
    }

    fetchCoinSync() {
        // 同步币种
        return this.api.get('/coin/synchCoinInfo');
    }

    fetchCoinChoose() {
        // 币种下拉
        interface _Response {
            itemId: string; // 钱包币种id
            symbol: string; // 币种
        }

        return this.api.get('/coin/coinListSel').then((result: any) => result as _Response[]);
    }

    fetchGetCurrency() {
        // 币种下拉
        interface _Response {
            value: string; // 钱包币种id
            label: string; // 币种
        }

        return this.api.get('/manualAdjustCard/getCurrency').then((result: any) => result as _Response[]);
    }

    fetchManualAdjustWalletGetCoin(params: { accountId: string }) {
        // 获取币种 钱包
        interface _Response {
            label: string; //
            value: string; //
        }

        return this.api.get('/manualAdjustWallet/getCoin', { params }).then((result: any) => result as _Response[]);
    }

    fetchManualAdjustCardGetCardInfo(params: { accountId: string }) {
        // 获取卡信息(处理选择卡渠道、卡及币种)
        interface _Response {
            label: string; //
            value: string; //
            children: any;
        }

        return this.api.get('/manualAdjustCard/getCardInfo', { params }).then((result: any) => result as _Response[]);
    }

    fetchManualAdjustWalletGetCardInfo(params: { accountId: string }) {
        // 获取卡信息(处理选择卡渠道、卡及币种)
        interface _Response {
            label: string; //
            value: string; //
            children: any;
        }

        return this.api.get('/manualAdjustWallet/getCardInfo', { params }).then((result: any) => result as _Response[]);
    }

    // 获取调账业务  钱包
    fetchManualAdjustWalletGetBusinessType() {
        // 获取调账业务
        interface _Response {
            label: string; // 名
            value: string; // 值
        }

        return this.api.get('/manualAdjustWallet/getBusinessType').then((result: any) => result as _Response[]);
    }

    // 获取调账业务  卡片
    fetchManualAdjustCardGetBusinessType() {
        // 获取调账业务
        interface _Response {
            label: string; // 名
            value: string; // 值
        }

        return this.api.get('/manualAdjustCard/getBusinessType').then((result: any) => result as _Response[]);
    }

    // 获取账单上账类型  卡片
    fetchManualAdjustCardGetEntryType() {
        // 获取调账业务
        interface _Response {
            label: string; // 名
            value: string; // 值
        }

        return this.api.get('/manualAdjustCard/getEntryType').then((result: any) => result as _Response[]);
    }

    fetchStoreCoinInfo() {
        return this.api.get('/coin/coinInfoById').then(
            (result: any) =>
                result as {
                    itemId: string; // 钱包币种id
                    symbol: string; // 币种
                    decimals: Number; //精度
                    coinId: string;
                }[]
        );
    }

    //

    // https://wallet-management.onrender.com/api/v1/sys/user/list?account=&realName=&pageNo=1&pageSize=10
    fetchSysUserListChoose(params: { pageNo: number; pageSize: number }) {
        // 用户ID下拉
        interface _Response extends Pagination {
            list: {
                userId: string; // 用户UID
                realName: string; // 姓名
            };
        }

        return this.api.get('/sys/user/list', { params }).then((result: any) => result as _Response);
    }

    fetchChainChoose(params: { coinId?: string; collection?: string }) {
        // 链下拉
        interface _Response {
            chainTag: string; // 链
            itemId: string; // 钱包链id
            maxout: string; // 单笔最大提币额
            minout: string; // 单笔最小提币额
            chainId: string;
        }

        return this.api.get('/coin/chainListSel', { params }).then((result: any) => result as _Response[]);
    }

    fetchAddressList(params: {
        address?: string; // 地址
        status?: 1 | 0 | string; // 状态：1=启用，2=禁用
        pageNo: number;
        pageSize: number;
        coinId?: string;
        chainId?: string;
    }) {
        // 地址-列表
        interface _Response extends Pagination {
            list: {
                address: string; // 地址
                agentId: string; // 代理商Id
                chainTag: string; // 链
                clientUserId: string; // 客户端用户UID
                coinId: string; // 币种id
                coinSymbol: string; // 币种简称
                id: string;
                itemId: string; // 钱包币种ID

                walletUserId: string; // 钱包用户UID
                status: 1 | 0; // 状态：状态 1正常 0禁用
            };
        }

        return this.api.get('/address/list', { params }).then((result: any) => result as _Response);
    }

    fetchTransactionWithdrawCheckConfigList(params: { pageNo: number; pageSize: number }) {
        // 提币审核配置列表
        interface _Response extends Pagination {
            list: {
                amount: string; // 金额
                coinId: string; // 币种id
                id: string;
                type: string; // 1、初审 2、复审
                userId: string; // 用户UID
                createTime: string; // 创建时间
                updateTime: string; // 更新时间
            };
        }

        return this.api.get('/transaction/withdrawCheckConfigList', { params }).then((result: any) => result as _Response);
    }

    fetchdelWithdrawCheckConfig(params: { id: string }) {
        // 提币审核配置列表
        return this.api.post('/transaction/delWithdrawCheckConfig', params).then((result: any) => result);
    }

    fetchupdateWithdrawCheckConfigState(params: { id: string }) {
        // 提币审核配置列表
        return this.api.post('/transaction/updateWithdrawCheckConfigState', params).then((result: any) => result);
    }

    fetchTransactionWithdrawLimitList(params: {
        accountId: string; // 用户UID
        range: 2 | 1 | 0 | ''; // 0、全部 1、全局 2、用户
        pageNo: number;
        pageSize: number;
    }) {
        // 提币额度配置列表
        interface _Response extends Pagination {
            list: withdrawLimitList;
        }

        return this.api.get('/transaction/withdrawLimitList', { params }).then((result: any) => result as _Response);
    }

    fetchAddressState(params: {
        // 地址-编辑状态
        id: string;
    }) {
        return this.api.get('/address/updateState', { params });
    }

    fetchAddressCreate(params: {
        // 地址-创建地址
        agentId: string; // 代理商ID
        coinId: string; // 币种id
        chainId: string; // 链id
        address?: string; // 平台地址
        num: string; // 数量
    }) {
        return this.api.post('/address/createAddress', params);
    }

    fetchTransactionSetWithdrawLimit(params: {
        // 添加提币额度配置
        accountId: string; // 用户UID
        coinId: string; // 币id
        createTime: string; // 创建时间
        updateTime: string; // 更新时间
        day: string; // 每天最大限额
        hour: string; // 每笔最大限额
        range: string; // 1、全局 2、用户
        singleMax: string; // 每笔最大限额
        singleMin: string; // 每笔最小限额
        status: 1 | 2; // 状态：状态：1=启用，2=禁用
    }) {
        return this.api.post('/transaction/setWithdrawLimit', params);
    }

    fetchTransactionUpdateWithdrawLimit(params: withdrawLimitList) {
        return this.api.post('/transaction/updateWithdrawLimit', params);
    }

    fetchTransactionSetWithdrawCheckConfig(params: {
        // 添加提币审核配置
        amount: string; // 金额
        coinId: string; // 币种id
        type: string; // 1、初审 2、复审
        userId: string; // 用户UID
        createTime: string; // 创建时间
        updateTime: string; // 更新时间
    }) {
        return this.api.post('/transaction/setWithdrawCheckConfig', params);
    }

    fetchTransactionUpdateWithdrawCheckConfig(params: {
        // 修改提币审核配置
        amount: string; // 金额
        coinId: string; // 币种id
        id: string;
        type: string; // 1、初审 2、复审
        userId: string; // 用户UID
        createTime: string; // 创建时间
        updateTime: string; // 更新时间
    }) {
        return this.api.post('/transaction/updateWithdrawCheckConfig', params);
    }

    // 审核提币
    fetchTransactionAfreshTransfer(params: {
        // 审核提币
        id: string; // id
        state: string; // 1、通过 2、拒绝
        loginPassword: string; // 交易密码
    }) {
        return this.api.post('/transaction/checkTransfer', params);
    }

    // 退回提币失败的资产
    fetchTransactionBackTransferAmount(params: {
        // 退回提币失败的资产
        id: string; // id
        loginPassword: string;
    }) {
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
    }) {
        return this.api.post('/transaction/withdrawCoin', params);
    }

    fetchTransactionCheckTransfer(params: {
        // 重新提币
        id: string; // id
        loginPassword: string; // 交易密码
    }) {
        return this.api.post('/transaction/afreshTransfer', params);
    }

    // 设置提币钱包密码
    fetchTransactionSetTradePwd(params: {
        // 设置提币钱包密码
        againTradePwd: string; // 确认交易密码
        newTradePwd: string; // 交易密码
    }) {
        return this.api.post('/transaction/setTradePwd', params);
    }

    fetchAddressDisuse(params: {
        // 弃用
        id: string; // id
        info: string; // 弃用原因
    }) {
        return this.api.post('/address/disuse', params);
    }

    fetchBargainList(params: transferListPrams) {
        // 充币列表
        interface _Response extends Pagination {
            list: transferList;
        }

        return this.api.get('/transaction/transferList', { params }).then((result: any) => result as _Response);
    }

    featchgetTransferAmountTotal(params: transferListPrams) {
        // 充币 金额
        return this.api.get('/transaction/getTransferAmountTotal', { params }).then((result: any) => result as string);
    }

    fetchBargainListExcel(params: {
        // 充提-导出
        hash: string;
        orderNo: string; // 订单号
        toAddress: string; // 目标地址
        coinOutStatus: 0 | 1 | 2 | ''; // 钱包提币审核 0待审核中 1可提币 2审核失败
        type: 1 | 2 | ''; // 交易类型 1、充 2、提
        state: 1 | 2 | 3 | 4 | 5 | 6 | 8 | ''; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝 6、未匹配订单
        walletStatus: string; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
        startTime: string;
        endTime: string;
        uid: string;
        riskCoinStatus: 0 | 1 | 2; // 冻结状态：0、全部 1、未冻结 2、冻结中
        riskLevel: 0 | 1 | 2 | 3 | 4; // 风控等级，0、全部 1、低 2、中 3、高 4、严重
        withdrawType?: string | null;
    }): Promise<any> {
        return this.api.get('/transaction/transferList/excelWriter', { params, responseType: 'blob' });
    }

    fetchBargainSearch(params: {
        orderNo: string; // 订单号
    }) {
        // 充提-搜索充值订单
        interface _Response {
            address: string; // 充值地址
            amount: string; // 金额
            createTime: string; // 时间
            name: string; // 名
            orderNo: string; // 充值订单号
            uid: string; // UID
            surname: string; // 姓
        }

        return this.api.get('/transaction/searchCardDeposit', { params }).then((result: any) => result as _Response);
    }

    fetchBargainMateCard(params: {
        id: string; // 充提记录Id
        orderNo: string; // 订单号
    }) {
        // 充提-匹配订单充值确定
        return this.api.post('/transaction/mateCardDeposit', params);
    }

    fetchBargainTransfer(params: {
        address: string; // 地址
        amount: string; // 金额
        chainTag: string; // 链
        itemId: string; // 钱包币种id
    }) {
        // 充提-发起提币
        return this.api.post('/transaction/transfer', params);
    }

    fetchBargainSetTradePwd(params: {
        newTradePwd: string; // 确认交易密码
        againTradePwd: string; // 交易密码
    }) {
        // 充提-设置交易密码
        return this.api.post('/transaction/setTradePwd', params);
    }
    // 链上充值-退款
    fetchDepositRefund(params: {
        loginPassword: string; // 登录密码
        id: string; // id
        address: string;
    }) {
        // 充提-设置交易密码
        return this.api.post('/transaction/depositRefund', params).then((result: any) => result);
    }

    fetchAgentAssetList(params: {
        agentId: string; // 资产人代理商ID
        coinId: string; // 币种id
        pageNo: number;
        pageSize: number;
    }) {
        // 资产-列表
        interface _Response extends Pagination {
            list: {
                userId: string;
                agentId: string; // 资产人Id
                balance: string; // 可用资产
                frozenBalance: string; // 提现冻结 程序
                id: string;
                remarks: string; // 备注
                symbol: string; // 资产类型
                manualFrozenBalance: string; // 风控冻结 人工
            };
        }

        return this.api.get('/agentAsset/agentAssetList', { params }).then((result: any) => result as _Response);
    }

    fetchAgentAssetListExcel(params: {
        // 资产-导出
        agentId: string; // 资产人代理商ID
        coinId: string; // 币种id
    }): Promise<any> {
        return this.api.get('/agentAsset/agentAssetList/excelWriter', { params, responseType: 'blob' });
    }

    fetchUserAssetUserAssetSnapshotListExcelWriter(params: {
        // 用户资产快照导出
        type?: null | 1 | 2; //
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        userId?: string; // 用户ID
        pageNo: string | number;
        pageSize: string | number;
    }): Promise<any> {
        return this.api.get('/userAsset/userAssetSnapshotList/excelWriter', { params, responseType: 'blob' });
    }

    fetchAssetSnapshotExcelWriterExcelWriter(params: {
        // 资产快照列表导出
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        snapshotType: 0 | 1 | 2 | null; // 资产人代理商ID
        coinId: string; // 用户UID
    }): Promise<any> {
        return this.api.get('/coin/assetSnapshot/excelWriter', { params, responseType: 'blob' });
    }


    fetchDitchSnapshotListExcelWriter(params: {
        // 渠道快照导出
        type?: null | 1 | 2; //
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        id?: string; // id
    }): Promise<any> {
        return this.api.get('/ditch/snapshotList/excelWriter', { params, responseType: 'blob' });
    }

    fetchAgentAssetAgentAssetSnapshotListExcelWriter(params: {
        // 用户资产快照导出
        type?: null | 1 | 2; //
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        agentId?: string; // 资产人代理商ID
    }): Promise<any> {
        return this.api.get('/agentAsset/agentAssetSnapshotList/excelWriter', { params, responseType: 'blob' });
    }

    fetchAgentAssetFrozen(params: {
        amount?: string; // 金额
        id?: string; // id
    }) {
        // 资产-冻结
        return this.api.post('/agentAsset/frozen', params);
    }

    fetchAgentAssetThaw(params: {
        amount?: string; // 金额
        id?: string; // id
    }) {
        // 资产-解冻
        return this.api.post('/agentAsset/thaw', params);
    }

    fetchAgentAssetTransfer(params: {
        id?: string;
        coinId?: string; // 币种id
        agentId?: string; // 资产人转出Id
        cardNo?: string; // 卡号
        remarks?: string; // 备注
        amount?: string; // 金额
    }) {
        // 资产-划转
        return this.api.post('/agentAsset/agentTransfer', params);
    }

    fetchAgentAssetTransferList(params: {
        agentId: string; // 资产人代理商ID
        coinId: string; // 币种id
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        pageNo: number;
        pageSize: number;
    }) {
        // 划转-列表
        interface _Response extends Pagination {
            list: {
                id: string;
                amount: string; // 金额
                orderNo: string; // 订单号
                agentAssetId: string; // 资产人转出Id
                cardNo: string; // 卡号
                fee: string; // 手续费
                createTime: string; // 时间
                remarks: string; // 备注
                symbol: string; // 币种
            };
        }

        return this.api.get('/agentAsset/assetTransferList', { params }).then((result: any) => result as _Response);
    }

    fetchMsgList(params: {
        account?: string; // 接收邮箱
        id?: string; // 邮件模板 ID
        state?: null | string; // 状态 1、成功 2、失败
        title?: string; // 标题
        pageNo: number;
        pageSize: number;
    }) {
        // 划转-列表
        interface _Response extends Pagination {
            list: {
                businessType: string; // 业务类型
                businessTypeName: string; // 业务类型名称
                id: string;
                info: string; // 通知内容
                language: string; // 语言
                languageName: string; // 语言名称
                modelId: string; // 模板 ID
                title: string; // 通知 Title
                state: 1 | 2; // 状态：1=启用，2=禁用
            };
        }

        return this.api.get('/msgTemplate/logList', { params }).then((result: any) => result as _Response);
    }

    fetchAgentAssetAgentAssetSnapshotList(params: agentAssetSnapshotListParams) {
        // 代理资产列表
        interface _Response extends Pagination {
            list: agentAssetSnapshotList;
        }
        return this.api.get('/agentAsset/agentAssetSnapshotList', { params }).then((result: any) => result as _Response);
    }

    fetchgetAgentAssetSnapshot(params: agentAssetSnapshotListParams) {
        // 代理资产金额
        return this.api.get('/agentAsset/getAgentAssetSnapshot', { params }).then((result: any) => result as AssetSnapshotAmountTotal);
    }

    fetchUAssetUserAssetSnapshotList(params: userAssetSnapshotParams) {
        // 用户资产快照列表
        interface _Response extends Pagination {
            list: userAssetSnapshotList;
        }
        return this.api.get('/userAsset/userAssetSnapshotList', { params }).then((result: any) => result as _Response);
    }

    fetchgetUserAssetSnapshotAmountTotalt(params: userAssetSnapshotParams) {
        // 用户资产快照 金额
        return this.api.get('/userAsset/getUserAssetSnapshotAmountTotal', { params }).then((result: any) => result as AssetSnapshotAmountTotal);
    }

    fetchCoinAssetSnapshotList(params: assetSnapshotParams) {
        // 用户资产快照列表
        interface _Response extends Pagination {
            list: assetSnapshotLIst;
        }

        return this.api.get('/coin/assetSnapshotList', { params }).then((result: any) => result as _Response);
    }

    fetchgetAssetSnapshotAmountTotal(params: assetSnapshotParams) {
        // 用户资产快照金额
        return this.api.get('/coin/getAssetSnapshotAmountTotal', { params }).then((result: any) => result as string);
    }

    fetchDitchAnapshotList(params: snapshotListParams) {
        // 渠道快照列表
        interface _Response extends Pagination {
            list: snapshotList;
        }
        return this.api.get('/ditch/snapshotList', { params }).then((result: any) => result as _Response);
    }

    fetchgetSnapshotAmountTotal(params: snapshotListParams) {
        // 渠道快照 金额
        return this.api.get('/ditch/getSnapshotAmountTotal', { params }).then((result: any) => result as snapshotListTotalAmount);
    }

    fetchAgentAssetTransferListExcel(params: {
        // 划转-导出
        agentId: string; // 资产人代理商ID
        coinId: string; // 币种id
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
    }): Promise<any> {
        return this.api.get('/agentAsset/assetTransferList/excelWriter', { params, responseType: 'blob' });
    }

    fetchAssetDetailList(params: {
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        pageNo: number;
        pageSize: number;
    }) {
        // 资产-列表
        interface _Response extends Pagination {
            list: {
                assetsBalance: string; // 资金余额
                laveAmount: string; // 残余金额
                cardBalance: string; // 卡余额
                cardConsume: string; // 卡消费
                cardDeposit: string; // 卡充值
                createTime: string;
                deposit: string; // 充值
                depositFee: string; // 充手续费
                id: string;
                openFee: string; // 开手续费
                state: -1 | 0 | 1; // 状态：0=平，1=长，-1=短
                statisticsDate: string; // 日期
                transferAmount: string; // 划转金额
                withdraw: string; // 提现
            };
        }

        return this.api.get('/assetsDetail/list', { params }).then((result: any) => result as _Response);
    }
    fetchAssetDetailExport(params: {
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        pageNo: number;
        pageSize: number;
    }) {
        // 资产-列表
        return this.api.get('/assetsDetail/export', { params, responseType: 'blob' }).then((result: any) => result);
    }

    // 操作日志列表
    fetchOperationLogList(params: {
        endTime?: string;
        id?: number;
        opAccount?: string;
        pageNo: number;
        pageSize: number;
        reqFunc?: string;
        startTime?: string;
    }) {
        // 资产-列表
        interface _Response extends Pagination {
            list: {
                elapsedTime: number;
                id: number;
                opAccount: string;
                opTime: string;
                reqData: string;
                reqFunc: string;
                reqMethod: string;
                reqUrl: string;
                respData: string;
                success: boolean;
            };
        }

        return this.api.post('/sysOpRecord/list', params).then((result: any) => result as _Response);
    }

    fetchDitchAssetDetailList(params: sinoDitchTransactionPrams) {
        // 渠道明细账务-列表
        interface _Response extends Pagination {
            list: {
                approveCode: string; // 授权码
                authId: string; // 交易唯一ID
                cardLogId: string; // 卡ID
                id: string;
                ditchId: string; // 渠道
                messageType: string; // 交易类型
                occurTime: string; // 交易发生时间
                respCode: string; // 交易响应码
                transCurrency: string; // 交易币种
                transCurrencyAmt: string; // 交易金额
                transactionId: string; // 交易ID

                receiveMsg: any; // 详情信息
                authAmount: string; // 授权金额
                authCurrency: string; // 授权币种
                cabin: string; // 卡片模式:Standard:标准卡,ShareBalance:共享卡
                cabinName: string; // 卡片模式:Standard:标准卡,ShareBalance:共享卡
                cardNo: string; // 卡号
                merchantName: string; // 商家
                settleTime: string; // 清算时间
                settledAmount: string; // 清算金额
                settledCurrency: string; // 清算币种
                state: 1 | 2 | 3 | 4 | 5; // 状态:1:处理中,2:已完成,3:处理失败,4-已退回,5-退回失败
                stateName: string; // 状态名称
            };
        }

        return this.api.get('/ditchAssetsDetails/list', { params }).then((result: any) => result as _Response);
    }

    fetchDitchAssetsDetailsList(params: sinoDitchTransactionPrams) {
        // 渠道明细账务-金额

        return this.api.get('/ditchAssetsDetails/amount/total', { params }).then((result: any) => result as TotalAmout);
    }

    fetchSinoDitchTransactionList(params: sinoDitchTransactionPrams) {
        // Sino渠道明细账务-列表
        interface _Response extends Pagination {
            list: sinoDitchTransactionLIst;
        }

        return this.api.get('/sinoDitchTransaction/list', { params }).then((result: any) => result as _Response);
    }

    fetchsinoDitchTransactionAmount(params: sinoDitchTransactionPrams) {
        // Sino渠道明细账务-列表

        return this.api.get('/sinoDitchTransaction/amount/total', { params }).then((result: any) => result as TotalAmout);
    }

    fetchDitchAssetDetailListExcel(params: {
        // 渠道明细账务-导出
        messageType: string; // 交易类型
        transactionId: string; // 交易ID
        authId: string; // 交易唯一ID
        cardNo: string; // 卡号
        ditchId: string; // 渠道
        state: 1 | 2 | 3 | 4 | 5 | ''; // 状态:1:处理中,2:已完成,3:处理失败,4-已退回,5-退回失败
        occurStartTime?: string; // 开始时间
        occurEndTime?: string; // 结束时间
    }): Promise<any> {
        return this.api.get('/ditchAssetsDetails/export', { params, responseType: 'blob' });
    }

    fetchSinoDitchTransactionExport(params: {
        // sion渠道明细账务-导出
        messageType: string; // 交易类型
        transactionId: string; // 交易ID
        txnId: string; // 交易唯一ID
        cardNo: string; // 卡号
        ditchId: string; // 渠道
        status: 1 | 2 | 3 | 4 | 5 | ''; // 状态:1:处理中,2:已完成,3:处理失败,4-已退回,5-退回失败
        occurStartTime?: string; // 开始时间
        occurEndTime?: string; // 结束时间
        ditchCode: string;
    }): Promise<any> {
        return this.api.get('/sinoDitchTransaction/export', { params, responseType: 'blob' });
    }

    fetchPasstoList(params: PasstoTransactionParams) {
        //Passto渠道明细账务列表
        interface _Response extends Pagination {
            list: PasstoTransactionList;
        }
        return this.api.post('/passto/list', params).then((result: any) => result as _Response);
    }
    fetchPasstoTotalCleanAmount(params: PasstoTransactionParams) {
        //Passto渠道明细账务总清算金额
        return this.api.post('/passto/totalCleanAmount', params).then((result: any) => result);
    }
    fetchPasstoExport(params: PasstoTransactionParams) {
        //Passto渠道明细账务总清算金额
        return this.api.post('/passto/export', params, { responseType: 'blob' }).then((result: any) => result as string);
    }
    fetchPasstoTypeList() {
        //Passto渠道明细交易类型
        return this.api.get('/passto/passtoTypeList').then((result: any) => result as Array<{ code: number; name: string }>);
    }

    fetchUserAssetList(params: newUserAssetParams) {
        // 用户资产-列表
        interface _Response extends Pagination {
            list: newUserAssetList;
        }
        return this.api.post('/userAsset/newUserAssetList', params).then((result: any) => result as _Response);
    }

    fetchgetUserAssetListAmountTotal(params: newUserAssetParams) {
        // 用户资产-金额
        return this.api.post('/userAsset/getUserAssetListAmountTotal', params).then((result: any) => result as newUserAmountTotal);
    }

    // 用户资产 冻结
    fetchUserfreezeData(params: {
        userId: string; // 用户UID
        coinId: string; // 币种id
        pageNo: number;
        pageSize: number;
        endBalance: string; // 结束金额
        startBalance: string; // 开始金额
        startFrozen: string; // 开始冻结
        endFrozen: string; // 结束冻结
        startFrozenBalance: string; // 开始提现冻结金额
        endFrozenBalance: string; // 结束提现冻结金额
        startManualFrozenBalance: string; // 开始提现冻结金额
        endManualFrozenBalance: string; // 结束风控冻结金额
    }) {
        // 用户资产-列表
        interface _Response extends Pagination {
            /**
             * 错误码
             */
            code?: number;
            /**
             * 错误描述
             */
            msg?: string;
            /**
             * 是否成功
             */
            success?: boolean;
            /**
             * 服务器当前时间戳
             */
            ts?: number;
        }

        // return this.api.get("/userAsset/userAssetList", { params }).then((result: any) => result as _Response);
        return this.api.post('/userAsset/manualFreeze', params).then((result: any) => result as _Response);
    }

    // 用户资产 解冻
    fetchUserThawData(params: {
        userId: string; // 用户UID
        coinId: string; // 币种id
        pageNo: number;
        pageSize: number;
        endBalance: string; // 结束金额
        startBalance: string; // 开始金额
        startFrozen: string; // 开始冻结
        endFrozen: string; // 结束冻结
    }) {
        // 用户资产-列表
        interface _Response extends Pagination {
            /**
             * 错误码
             */
            code?: number;
            /**
             * 错误描述
             */
            msg?: string;
            /**
             * 是否成功
             */
            success?: boolean;
            /**
             * 服务器当前时间戳
             */
            ts?: number;
        }

        // return this.api.get("/userAsset/userAssetList", { params }).then((result: any) => result as _Response);
        return this.api.post('/userAsset/manualUnfreeze', params).then((result: any) => result as _Response);
    }

    fetchgetUpdateUserAssetStatus(params: { id: string; showMinusAccount: 1 | 2 }) {
        //   // 修改是否向用户展示负资产
        return this.api.post('/userAsset/updateUserAssetStatus', params).then((result: any) => result as any);
    }

    fetchUserAssetListSnapshot(): // 用户资产快照
    Promise<any> {
        return this.api.get('/userAsset/snapshot');
    }
    fetchuserAssetLogList(params: AssetsJournaParams) {
        interface _Response extends Pagination {
            list: AssetsJournaData[];
        }
        // 用户资产流水列表
        return this.api.post('/userAssetLog/list', params).then((res: any) => res as _Response);
    }
    fetchuserAssetExport(params: AssetsJournaParams) {
        // 用户资产流水列表-导出
        return this.api.post('/userAssetLog/export', params, { responseType: 'blob' }).then((res: any) => res);
    }
    fetchuserAsseTypeList() {
        // 用户资产日志类型
        return this.api.get('/userAssetLog/typeList').then((res: any) => res as TypeList[]);
    }
    fetchMsgSend(
        // 重新发送
        params: {
            id: string;
        }
    ): Promise<any> {
        return this.api.get('/msgTemplate/resend', { params });
    }

    fetchAgentAssetSnapshot(): // 代理商资产快照
    Promise<any> {
        return this.api.get('/agentAsset/snapshot');
    }

    fetchUserAssetListExcel(params: {
        // 用户资产-导出
        /**
         * 资产类型：币种id
         */
        coinId?: string;
        /**
         * 结束金额
         */
        endBalance?: string;
        /**
         * 结束提现冻结金额
         */
        endFrozenBalance?: string;
        /**
         * 结束风控冻结金额
         */
        endManualFrozenBalance?: string;
        /**
         * pageNo.默认值:1
         */
        pageNo: number;
        /**
         * pageSize.默认值:10
         */
        pageSize: number;
        /**
         * 开始金额
         */
        startBalance?: string;
        /**
         * 开始提现冻结金额
         */
        startFrozenBalance?: string;
        /**
         * 开始风控冻结金额
         */
        startManualFrozenBalance?: string;
        /**
         * 用户UID
         */
        userId?: string;
    }): Promise<any> {
        return this.api.post('/userAsset/userAssetList/excelWriter', params, { responseType: 'blob' });
    }

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
    }) {
        // 用户充币-列表
        interface _Response extends Pagination {
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
            };
        }

        return this.api.get('/transaction/depositList', { params }).then((result: any) => result as _Response);
    }

    // 用户新充值记录
    fetchTransactionNewDepositList(params: newDepositParams) {
        interface _Response extends Pagination {
            list: newDepositList;
        }

        return this.api.get('/transaction/newDepositList', { params }).then((result: any) => result as _Response);
    }

    // 用户新充值记录 金额
    fetchGetNewDepositAmountTotalt(params: newDepositParams) {
        return this.api.get('/transaction/getNewDepositAmountTotal', { params }).then((result: any) => result);
    }

    fetchTransactionWithdrawList(params: withdrawListPrams) {
        // 用户充币-列表
        interface _Response extends Pagination {
            list: withdrawList[];
        }
        return this.api.get('/transaction/withdrawList', { params }).then((result: any) => result as _Response);
    }

    fetchgetWithdrawAmountTotal(params: withdrawListPrams) {
        // 用户充币-金额总数
        return this.api.get('/transaction/getWithdrawAmountTotal', { params }).then((result: any) => result as withdrawAmountTotal);
    }

    fetchwithdrawExport(params: withdrawListPrams) {
        // 用户充币-导出
        return this.api.get('/transaction/withdraw/export', { params, responseType: 'blob' }).then((result: any) => result);
    }

    fetchgetwithdrawManualRemark(params: withdrawManualRemark) {
        // 用户充币-备注
        return this.api.post('/transaction/withdrawManualRemark', params).then((result: any) => result as any);
    }

    // 币种资产手动快照导出
    fetchCoinAssetSnapshotExport(params: {}): Promise<any> {
        return this.api.get('/coin/assetSnapshot', { params, responseType: 'blob' });
    }

    fetchNotifyNotifyList(params: {
        txHash: string; // hash
        toAddress: string; // 地址
        pageNo: number;
        pageSize: number;
    }): Promise<any> {
        return this.api.get('/notify/notifyList', { params });
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

    // 冻结
    // fetchDepositListExcelWriter(params: {
    //   orderNo: string; // 订单号
    //   toAddress: string; // 目标地址
    //   state: 0 | 1 | 2 | 3 | 4; // 0、全部 1、等待充值 2、成功 3、超时 4、链失败
    //   pageNo: number;
    //   pageSize: number;
    //   transferOrderNo: string;
    //   uid: string;
    //   endTime: string;
    //   startTime: string;
    // }): Promise<any> {
    //   return this.api.get("/transaction/depositList/excelWriter", { params, responseType: "blob" });
    // }

    // 数字货币列表
    fetchCoinMarket(params: MarkeParams): Promise<any> {
        return this.api.get('/coin/market/list', { params }).then((result: any) => result as MarkeParamsList);
    }
    // 新增数字货币列表
    fetchCoinMarketAdd(params: MarkeParamsListWithoutAdd): Promise<any> {
        return this.api.post('/coin/market/add', params).then((result: any) => result as any);
    }
    // 编辑数字货币列表
    fetchCoinMarketEdit(params: MarkeParamsListWithoutAdd): Promise<any> {
        return this.api.post('/coin/market/edit', params).then((result: any) => result as any);
    }
    // 获取币种下拉列表选项
    fetchCoinMarketSymbols(): Promise<any> {
        return this.api.get('/coin/market/symbols').then((result: any) => result as Symbols[]);
    }
    // 获取数字货币种下拉列表选项
    fetchCoinMarketSort(params: { type: boolean }): Promise<any> {
        return this.api.get('/coin/market/sort', { params });
    }
    // 获取法币列表选项
    fetchFiatMoneyList(params: MarkeParams): Promise<any> {
        return this.api.post('/coin/market/fiatMoneyList', params).then((result: any) => result as MarkeParamsList);
    }
    fiatMoneyAddOrUpdate(params: fiatMarkeParamsListWithoutAdd): Promise<any> {
        return this.api.post('/coin/market/fiatMoneyAddOrUpdate', params).then((result: any) => result as MarkeParamsList);
    }
    // 冻结资产表
    fetchUserAssetFrozenList(params: AssetFrozenParams): Promise<any> {
        interface _Response extends Pagination {
            list: AssetFrozenListType;
        }
        return this.api.get('/virtual/bill/userAssetFrozenList', { params }).then((result: any) => result as _Response);
    }
    // 解冻用户资产表
    fetchUserThawManualFrozenBalance(params: FrozenBalanceParams): Promise<any> {
        interface _Response extends Pagination {
            list: AssetFrozenListType;
        }
        return this.api.post('/virtual/bill/thawManualFrozenBalance', params).then((result: any) => result);
    }
    // 冻结资产历史冻结表
    fetchUserAssetFrozenLogList(params: AssetFrozenParams): Promise<any> {
        interface _Response extends Pagination {
            list: AssetFrozenListType;
        }
        return this.api.get('/virtual/bill/userAssetFrozenLogList', { params }).then((result: any) => result as _Response);
    }
    //币币平台账务
    fetchPlatformAssetList(params: PlatformAssetParams): Promise<any> {
        interface _Response extends Pagination {
            list: PlatformAssetListType;
        }
        return this.api.get('/virtual/bill/platformAssetList', { params }).then((result: any) => result as _Response);
    }

    // 币币渠道资产列表
    featchWalletAssetList(params: WalletAssetListType): Promise<any> {
        interface _Response extends Pagination {
            list: WalletAssetListData[];
        }
        return this.api.get('/virtual/bill/walletAssetList', { params }).then((res) => res as any as _Response);
    }
    // 币币渠道资产流水表
    featchwalletTransferLogList(params: ParamsTransferLog): Promise<any> {
        interface _Response extends Pagination {
            list: TransferLogData[];
        }
        return this.api.get('/virtual/bill/walletTransferLogList', { params }).then((res) => res as any as _Response);
    }

    // 卡平台账务列表
    getPagePlatformCard(params: GetPagePlatParams): Promise<any> {
        interface _Response extends Pagination {
            list: GetPagePlatData[];
        }
        return this.api.post('/platformCard/getPagePlatformCard', params).then((res) => res as any as _Response);
    }
    // 导出-卡平台账务列表
    ExportPlatformCard(params: GetPagePlatParams): Promise<any> {
        return this.api.post('/platformCard/exportPlatformCard', params, { responseType: 'blob' }).then((res) => res);
    }

    // 卡平台账务流水表
    getPagePlatformCardBuffer(params: getPagePlatformPrams): Promise<any> {
        interface _Response extends Pagination {
            list: getPagePlatformCardData[];
        }
        return this.api.post('/platformCard/getPagePlatformCardBuffer', params).then((res) => res as any as _Response);
    }
    // 导出-卡平台账务流水表
    ExportPlatformCardBuffer(params: getPagePlatformPrams): Promise<any> {
        return this.api.post('/platformCard/exportPlatformCardBuffer', params, { responseType: 'blob' }).then((res) => res);
    }
    // 卡平台账务快照
    getPagePlatformCardSnapshot(params: PlatformSnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            list: PlatformSnapshotData[];
        }
        return this.api.post('/platformCard/getPagePlatformCardSnapshot', params).then((res) => res as any as _Response);
    }
    // 卡平台账务快照-统计
    getPlatformCardSnapshotStatistics(params: PlatformSnapshotParams): Promise<any> {
        return this.api
            .post('/platformCard/getPlatformCardSnapshotStatistics', params)
            .then((res) => res as any as PlatformCardCurreny<PlatformCardAmout>);
    }
    // 导出-卡平台账务快照
    ExportPlatformCardSnapshot(params: PlatformSnapshotParams): Promise<any> {
        return this.api.post('/platformCard/exportPlatformCardSnapshot', params, { responseType: 'blob' }).then((res) => res as any);
    }
    // 查询快照类型
    getSnapshotType(): Promise<any> {
        return this.api.get('/ditchAcctAsset/getSnapshotType').then((res: any) => res as getActionList[]);
    }
    // 获取资金类型
    getCurrency(): Promise<any> {
        return this.api.post('/platformCard/getCurrency').then((res: any) => res as getActionList[]);
    }
    // 平台日切
    getPagePlatformCardCut(params: CardCutPlatformParams): Promise<any> {
        interface _Response extends Pagination {
            list: CardCutPlatformData[];
        }
        return this.api.post('/platformCard/getPagePlatformCardCut', params).then((res) => res as any as _Response);
    }
    // 平台日切-统计
    getPlatformCardCutStatistics(params: CardCutPlatformParams): Promise<any> {
        return this.api
            .post('/platformCard/getPlatformCardCutStatistics', params)
            .then((res) => res as any as PlatformCardCurreny<CardCutStatistics>);
    }
    // 导出-平台日切
    ExportPlatformCardCut(params: CardCutPlatformParams): Promise<any> {
        return this.api.post('/platformCard/exportPlatformCardCut', params, { responseType: 'blob' }).then((res) => res as any);
    }
    // 用户卡日切
    getUserCardCut(params: UserCutParams): Promise<any> {
        interface _Response extends Pagination {
            list: CardCutPlatformData[];
        }
        return this.api.post('/acountCardCut/getPage', params).then((res) => res as any as _Response);
    }
    // 用户卡日切-统计
    getStatistics(params: UserCutParams): Promise<any> {
        return this.api.post('/acountCardCut/getStatistics', params).then((res) => res as any as PlatformCardCurreny<CardCutStatistics>);
    }
    // 导出-用户卡日切
    ExportUserCardCut(params: UserCutParams): Promise<any> {
        return this.api.post('/acountCardCut/export', params, { responseType: 'blob' }).then((res) => res as any);
    }
    // 生成平台快照
    generateSnapshot(params: { ids?: string }): Promise<any> {
        return this.api.post('/platformCard/generateSnapshot', params).then((res) => res);
    }
    // 链上提币加速
    transactionQuicken(params: { id: string; level: number }): Promise<any> {
        return this.api.post('/transaction/quicken', params).then((res) => res);
    }

    // 充值-充币方式
    transactionDepositTypeList(): Promise<Array<{ code: number; name: string }>> {
        return this.api.get('/transaction/depositTypeList').then((res) => res);
    }
    // 提币-提币币方式
    transactionWithdrawTypeList(): Promise<Array<{ code: number; name: string }>> {
        return this.api.get('/transaction/withdrawTypeList').then((res) => res);
    }
    // 提现审核状态列表
    transactionWithdrawCheckStateList(): Promise<Array<{ code: number; name: string }>> {
        return this.api.get('/transaction/withdrawCheckStateList').then((res) => res);
    }
}

export default new Asset();
