import { Api } from '../api';
import { Pagination } from '../type';
import type {
    ReturnDataParams,
    ReturnDataList,
    TradeTypeList,
    BalanceLedgerParams,
    BalanceLedgerList,
    CardTransaction,
    getDitchAcctAssetType,
    DitchAcctAssetData,
    KoipyParams,
    KoipyData,
    getActionList,
    PaytradesData,
    PaytradesParams,
    SinoParams,
    SinoData,
    SkyeeParams,
    SkyeeData,
    ChannelSnapshot,
    ChannelSnapshotData,
    channdelCardAmout,
} from '@/api/channel/types.d';
import type { CoinParamsList } from '@/api/asset/types.d';

class Channel extends Api {
    fetchDitchList(params: {
        id?: string; // 用户ID
        name?: string; // 名称
        state?: 1 | 2 | ''; // 状态：1=启用，2=禁用
        pageNo?: number;
        pageSize?: number;
    }) {
        // 渠道管理-列表
        interface _Response extends Pagination {
            list: {
                createTime: string; // 创建时间
                amount: string; // 余额
                id: string;
                name: string; // 名称
                state: 1 | 2; // 状态：1=启用，2=禁用
            }[];
        }

        return this.api.get('/ditch/list', { params }).then((result: any) => result as _Response);
    }

    fetchUpdateAmount(params: {
        // 更新余额
        id: string | undefined;
    }) {
        return this.api.get('/ditch/updateAmount', { params });
    }

    fetchDitchState(params: {
        // 编辑状态
        id: string;
        state: 1 | 2; // 1=启用，2=禁用
    }) {
        return this.api.post('/ditch/updateState', params);
    }

    fetchDitchUpdate(params: {
        // 更新数据
        id: string;
        name: string;
        state: 1 | 2; // 1=启用，2=禁用
    }) {
        return this.api.post('/ditch/update', params);
    }

    fetchDitchApiMerchant(params: {
        // 更新数据
        no: string; // 商户号
        state: 1 | 2; // 状态，0.默认(未启用), 1.启用, 2.禁用
    }) {
        return this.api.post('/ditchApi/merchant/patch', params);
    }

    fetchDitchChoose(params: { business: 'replace' | 'cancel' }) {
        // 渠道下拉
        interface _Response {
            id: string;
            name: string; // 名称
        }

        return this.api.get('/ditch/choose', { params }).then((result: any) => result as _Response[]);
    }

    fetchSinoDitchTransactionMessageTypeList(params: { ditchCode: string }) {
        // Sino交易类型下拉列表
        interface _Response {
            id: string;
            name: string; // 名称
        }

        return this.api.get('/sinoDitchTransaction/messageTypeList', { params }).then((result: any) => result as _Response);
    }

    fetchSinoDitchTransactionOrderStatusList() {
        // Sino交易状态类型下拉列表
        interface _Response {
            id: string;
            name: string; // 名称
        }

        return this.api.get('/sinoDitchTransaction/orderStatusList').then((result: any) => result as _Response);
    }

    fetchDitchSnapshot(): // 渠道快照
    Promise<any> {
        return this.api.get('/ditch/snapshot');
    }

    fetchDitchApiList(params: { id: string; pageNo: number; pageSize: number }) {
        // 渠道api管理-列表
        interface _Response extends Pagination {
            list: {
                api: string;
                apiKey: string; // ApiKey
                callbackUrl: string; // 回调地址
                createTime: string; // 创建时间
                id: string;
                ditchId: string; // 渠道id
                remark: string; // 备注
                homeTag: string; // 备注
            };
        }

        return this.api.get('/ditchApi/list', { params }).then((result: any) => result as _Response);
    }

    fetchDitchApiDel(params: {
        // 渠道api管理-删除
        id: string;
    }) {
        return this.api.get('/ditchApi/del', { params });
    }

    fetchDitchApiAdd(params: {
        // 渠道api管理-新增
        id: string | undefined;
        ditchId: string;
        api: string;
        apiKey: string; // ApiKey
        callbackUrl: string; // 回调地址
        remark: string; // 备注
        secretKey: string; // SecretKey
    }) {
        return this.api.post('/ditchApi/add', params);
    }

    fetchDitchApiUpdate(params: {
        // 渠道api管理-编辑
        id: string | undefined;
        ditchId: string;
        api: string;
        apiKey: string; // ApiKey
        callbackUrl: string; // 回调地址
        remark: string; // 备注
        secretKey: string; // SecretKey
    }) {
        return this.api.post('/ditchApi/update', params);
    }

    fetchDitchCardList(params: {
        ditchId?: string;
        state?: 1 | 2 | ''; // 状态：1=启用，2=禁用
        pageNo: number;
        pageSize: number;
    }) {
        // 渠道卡片管理-列表
        interface _Response extends Pagination {
            list: {
                createTime: string;
                depositFee: string; // 充值手续费
                ditchName: string; // 渠道商名称
                id: string;
                imageUri: string; // 图片
                name: string; // 卡片名称
                openFee: string; // 开卡手续费
                summary: string; // 简介
                tradeFee: string; // 交易手续费
                state: 1 | 2; // 状态：1=启用，2=禁用
                cardType: string; // 卡类型： 1=虚拟卡， 2=实体卡
                maxAuthAmount: string; // 单次授权金额上限
                minAuthAmount: string; // 单次授权金额下限
                explainTitle1: string; // 说明标题1
                explainTitle2: string; // 说明标题2
                explainTitle3: string; // 说明标题3
                explain1: string; // 说明备注1
                explain2: string; // 说明备注2
                explain3: string; // 说明备注3

                consumeFee: string; // 消费手续费
                surfaceRate: string; // 上浮汇率
            }[];
        }

        return this.api.get('/ditchCard/list', { params }).then((result: any) => result as _Response);
    }

    fetchDitchCardListDetail(params: {
        ditchCardId: string; // 渠道卡ID
        pageNo: number;
        pageSize: number;
    }) {
        // 渠道卡片管理-列表
        interface _Response extends Pagination {
            list: {
                id: string; // ID
                explainTitle1: string; // 说明标题1
                explainTitle2: string; // 说明标题2
                explainTitle3: string; // 说明标题3
                explain1: string; // 说明备注1
                explain2: string; // 说明备注2
                explain3: string; // 说明备注3

                info: string; // 详情
                language: string; // 语言
                summary: string; // 备注
            };
        }

        return this.api.get('/ditchCardInfo/list', { params }).then((result: any) => result as _Response);
    }

    fetchDitchCardInfo(params: { id: string | undefined }) {
        // 渠道卡片管理-详情
        interface _Response {
            createTime: string;
            depositFee: string; // 充值手续费
            ditchName: string; // 渠道商名称
            id: string;
            imageUri: string; // 图片
            name: string; // 卡片名称
            openFee: string; // 开卡手续费
            summary: string; // 简介
            tradeFee: string; // 交易手续费
            state: 1 | 2; // 状态：1=启用，2=禁用

            maxAuthAmount: string; // 单次授权金额上限
            minAuthAmount: string; // 单次授权金额下限
            explainTitle1: string; // 说明标题1
            explainTitle2: string; // 说明标题2
            explainTitle3: string; // 说明标题3
            explain1: string; // 说明备注1
            explain2: string; // 说明备注2
            explain3: string; // 说明备注3
            info: string; // 详情
            area: string; // 发卡地区
            ditchId: string; // 渠道商ID
            fullImageUri: string; // 全路径图片
            organizationId: string; // 组织ID
            productId: string; // 产品ID
            typeId: string; // 类型ID
            cardSampleUrlAll: string;
            imageUriAll: string;
            restrictedCallingCode: string;
            exposureRange: string;
            labelIds: string;
            fields: string;
            certificateType: string;
            cardApposeUrlAll: string;
            cardApposeUrl: string;
        }

        return this.api.get('/ditchCard/info', { params }).then((result: any) => result as _Response);
    }

    fetchMsgTemplateInfo(params: { id: string | undefined }) {
        // 渠道卡片管理-详情
        interface _Response {
            id: string;
            businessType: string; // 业务类型
            businessTypeName: string; // 业务类型名称
            info: string; // 通知内容
            language: string; // 语言
            languageName: string; // 语言名称
            modelId: string; // 模板 ID
            state: string; // 状态 1、启用 2、禁用
            title: string; // 通知 Title
            type: string; // 通知类型 2、邮件通知
        }

        return this.api.get('/msgTemplate/info', { params }).then((result: any) => result as _Response);
    }

    fetchDitchCardState(params: {
        // 渠道卡片管理-编辑状态
        id: string;
        state: 1 | 2; // 1=启用，2=禁用
    }) {
        return this.api.post('/ditchCard/updateState', params);
    }

    fetchDitchCardAdd(params: CardTransaction) {
        return this.api.post('/ditchCard/add', params);
    }

    fetchDitchCardInfoAdd(params: {
        // 渠道卡片管理详情-新增
        ditchCardId: string; // 渠道卡ID,新增时传入
        explainTitle1: string; // 说明标题1
        explainTitle2: string; // 说明标题2
        explainTitle3: string; // 说明标题3
        explain1: string; // 说明备注1
        explain2: string; // 说明备注2
        explain3: string; // 说明备注3
        info: string; // 详情
        language: string; // 语言
        summary: string; // 备注
        applicationRestriction: string; // 申请限制
        supportPlatform: string; // 支持消费的平台
        tag: string; // 标签
        sort: null | number;
    }) {
        return this.api.post('/ditchCardInfo/add', params);
    }

    fetchDitchCardInfoUpdate(params: {
        // 渠道卡片管理详情-编辑
        id: string; // ID
        explainTitle1: string; // 说明标题1
        explainTitle2: string; // 说明标题2
        explainTitle3: string; // 说明标题3
        explain1: string; // 说明备注1
        explain2: string; // 说明备注2
        explain3: string; // 说明备注3
        info: string; // 详情
        language: string; // 语言
        summary: string; // 备注
        applicationRestriction: string; // 申请限制
        supportPlatform: string; // 支持消费的平台
        tag: string; // 标签
        sort: null | number;
    }) {
        return this.api.post('/ditchCardInfo/update', params);
    }

    fetchDitchCardUpdate(params: {
        // 渠道卡片管理-编辑
        id: string | undefined;
        area: string; // 发卡地区
        depositFee: string; // 充值手续费
        ditchId: string; // 代理商ID
        imageUri: string; // 图片
        name: string; // 名称
        openFee: string; // 开卡手续费
        organizationId?: string; // 组织ID
        productId?: string; // 产品ID
        state: 1 | 2; // 状态：1=启用，2=禁用
        summary: string; // 简介
        tradeFee: string; // 交易手续费
        surfaceRate: string; // 浮动汇率
        maxAuthAmount: string; // 单次授权金额上限
        minAuthAmount: string; // 单次授权金额下限
        explainTitle1: string; // 说明标题1
        explainTitle2: string; // 说明标题2
        explainTitle3: string; // 说明标题3
        explain1: string; // 说明备注1
        explain2: string; // 说明备注2
        explain3: string; // 说明备注3
        typeId: string; // 类型ID
        cardType: string; // 卡类型： 1=虚拟卡， 2=实体卡
        info: string; // 详情
    }) {
        return this.api.post('/ditchCard/update', params);
    }

    fetchDitchCardChoose(params: { ditchCode?: string; agentId?: string }) {
        // 渠道卡片管理下拉
        interface _Response {
            id: string;
            name: string; // 名称
            ditchCode: string; // 渠道
            symbol: string;
            cardType: number;
            cardModel: number;
        }

        return this.api.get('/ditchCard/choose', { params }).then((result: any) => result as _Response[]);
    }

    fetchDitchTransactionKoipyMessageTypeList() {
        // 交易类型下拉列表
        interface _Response {
            code: string;
            name: string; // 名称
        }

        return this.api.get('/ditchTransactionKoipy/messageTypeList').then((result: any) => result as _Response);
    }

    fetchDitchCardType(params: {
        type: number; // 1=卡产品,2=卡类型,3=卡组织
        ditchId: string; // 渠道id
    }) {
        // 渠道卡片类型下拉
        interface _Response {
            id: string;
            name: string; // 名称
        }

        return this.api.get('/ditchCard/typeChoose', { params }).then((result: any) => result as _Response);
    }

    fetchTypeChoose() {
        // 风控-类型下拉
        interface _Response {
            code: string; // 编码
            name: string; // 名称
            type: 1 | 2; // 类型:1=下拉,2=输入
            itemList: {
                code: string; // 编码
                name: string; // 名称
            };
        }

        return this.api.get('/ditchCardRisk/typeChoose').then((result: any) => result as _Response);
    }

    fetchSelectValChoose(params: {
        code: string; // 编码
    }) {
        // 风控-查询下拉框类型
        interface _Response {
            code: string; // 编码
            name: string; // 名称
        }

        return this.api.get('/ditchCardRisk/selectValChoose', { params }).then((result: any) => result as _Response);
    }

    fetchCardRiskList(params: {
        code: string; // 风控类型
        ditchCardId: string; // 渠道ID
        state: 1 | 2 | ''; // 状态：1=启用,2=禁用
        pageNo: number;
        pageSize: number;
    }) {
        // 风控列表
        interface _Response extends Pagination {
            list: {
                code: string; // 风控编码
                createTime: string;
                ditchCardId: string; // 卡ID
                id: string;
                itemCode: string; // 风控项编码
                itemName: string; // 风控项名称
                name: string; // 风控名称
                remark: string; // 风控备注
                val: string; // 风控值
                state: 1 | 2; // 状态：1=启用，2=禁用
            };
        }

        return this.api.get('/ditchCardRisk/list', { params }).then((result: any) => result as _Response);
    }

    fetchMsgTemplateList(params: {
        id: string; //
        info: string; // 内容
        modelId: string; // 模板 ID
        pageNo: number;
        pageSize: number;
        type: 2 | '';
        state: 1 | 2 | '';
    }) {
        // 模板列表
        interface _Response extends Pagination {
            list: {
                businessType: string; // 业务类型
                info: string; // 通知内容
                language: string; // 语言
                title: string; // 通知 Title
                state: 1 | 2; // 状态：1=启用，2=禁用
                type: 2; // 通知类型 2、邮件通知
            };
        }

        return this.api.get('/msgTemplate/list', { params }).then((result: any) => result as _Response);
    }

    fetchCardRiskDel(params: {
        // 删除
        id: string;
    }) {
        return this.api.get('/ditchCardRisk/del', { params });
    }

    fetchCardRiskUpdateState(params: {
        // 编辑状态
        id: string;
        // state?:1|2|'', // 状态：1=启用,2=禁用
    }) {
        return this.api.post('/ditchCardRisk/updateState', params);
    }

    fetchMsgTemplateUpdateState(params: {
        // 编辑状态
        id: string;
        state: 1 | 2 | ''; // 状态：1=启用,2=禁用
    }) {
        return this.api.get('/msgTemplate/updateState', { params });
    }

    fetchCardRiskAdd(params: {
        // 新增
        businessType: string; // 业务类型
        businessTypeName: string; // 业务类型名称
        id: string;
        info: string; // 通知内容
        language: string; // 语言
        languageName: string; // 语言名称
        modelId: string; // 模板 ID
        title: string; // 通知 Title
        state: 1 | 2; // 状态：1=启用，2=禁用
        type: 2; // 通知类型 2、邮件通知
    }) {
        return this.api.post('/ditchCardRisk/add', params);
    }

    fetchMgTemplateAdd(params: {
        // 新增
        id: string | undefined;
        ditchCardId: string; // 卡片ID
        code: string; // 风控编码
        itemCode: string; // 风控项编码
        remark: string; // 风控备注
        val: string; // 风控值
        state: 1 | 2;
    }) {
        return this.api.post('/msgTemplate/add', params);
    }

    fetchCardRiskUpdate(params: {
        // 编辑
        id: string | undefined;
        ditchCardId: string; // 卡片ID
        code: string; // 风控编码
        itemCode: string; // 风控项编码
        remark: string; // 风控备注
        val: string; // 风控值
        state: 1 | 2;
    }) {
        return this.api.post('/ditchCardRisk/update', params);
    }

    fetchMsgTemplateUpdate(params: {
        // 编辑
        id: string | undefined;
        info: string; // 通知内容
        language: string; // 语言
        state: string; // 状态 1、启用 2、禁用
        title: string; // 通知 Title
        type: string; // 通知类型 2、邮件通知
    }) {
        return this.api.post('/msgTemplate/update', params);
    }

    // 退款数据
    fetchUserAssetListOfSkyee(params: ReturnDataParams) {
        interface _Response extends Pagination {
            list: ReturnDataList;
        }

        return this.api.post('/userAsset/userAssetListOfSkyee', params).then((result: any) => result as _Response);
    }

    // 导出退款数据
    excelWriterUserAssetListOfSkyee(params: ReturnDataParams) {
        return this.api.post('/userAsset/excelWriterUserAssetListOfSkyee ', params, { responseType: 'blob' }).then((result: any) => result);
    }

    // sino渠道流水交易类型
    featchTradeTypeList(params: { ditchCode: string }) {
        return this.api.get('/sino/balance/ledger/tradeTypeList', { params }).then((result: any) => result as TradeTypeList);
    }

    featchBalanceLedgerList(params: BalanceLedgerParams) {
        interface _Response extends Pagination {
            list: BalanceLedgerList;
        }

        return this.api.get('/sino/balance/ledger/list', { params }).then((result: any) => result as _Response);
    }

    featchBalanceLedgerExport(params: BalanceLedgerParams) {
        return this.api.get('/sino/balance/ledger/export', { params, responseType: 'blob' }).then((result: any) => result);
    }

    featchExportPageList() {
        return this.api.get('/sino/balance/ledger/exportPageList').then((result: any) => result);
    }

    //
    featDitchCard() {
        return this.api.get('/ditchCard/publisherList').then((result: any) => result);
    }

    // 获取排序号
    featgetSortList(params: { type: Boolean }) {
        return this.api.get('/ditchCardInfo/getSortList', { params }).then((result: any) => result);
    }

    //获取渠道id
    featgetDitchInfo(params?: { state?: 1 | 2 }) {
        return this.api.get('/ditchCardInfo/ditchInfo', { params }).then((result: any) => result as Array<{ name: string; id: number }>);
    }

    // 获取限制国家
    featgetDitchCountryList() {
        return this.api
            .get('/ditchCard/countryList')
            .then((result: any) => result as Array<{ code: string; displayName: string; languageType: string; alpha3: string }>);
    }

    // 获取充值币种
    featgetDitchcoinList() {
        return this.api.get('/coin/coinList').then((result: any) => result as CoinParamsList[]);
    }
    // 渠道账户资产
    getPageDitchAcctAsset(params: getDitchAcctAssetType) {
        interface _Response extends Pagination {
            list: DitchAcctAssetData[];
        }
        return this.api.post('/ditchAcctAsset/getPageDitchAcctAsset', params).then((result: any) => result as _Response);
    }
    // 导出-渠道账户资产
    exportDitchAcctAsset(params: getDitchAcctAssetType) {
        return this.api.post('/ditchAcctAsset/exportDitchAcctAsset', params, { responseType: 'blob' }).then((result: any) => result);
    }

    // 渠道(Koipy)账户资产流水
    getKoipyListData(params: KoipyParams) {
        interface _Response extends Pagination {
            list: KoipyData[];
        }
        return this.api.post('/ko/getPage', params).then((result: any) => result as _Response);
    }
    // 渠道(Koipy)查询交易类型
    getKoipyAction() {
        return this.api.get('/ko/getAction').then((result: any) => result as getActionList[]);
    }
    // 导出-渠道(Koipy)账户资产
    exportKoipyListData(params: KoipyParams) {
        return this.api.post('/ko/export', params, { responseType: 'blob' }).then((result: any) => result);
    }

    // 渠道(Paytrades)账户资产流水
    getPaytradesListData(params: PaytradesParams) {
        interface _Response extends Pagination {
            list: PaytradesData[];
        }
        return this.api.post('/ptr/getPage', params).then((result: any) => result as _Response);
    }
    // 渠道(Paytrades)查询交易类型
    getPaytradesAction() {
        return this.api.get('/ptr/getType').then((result: any) => result as getActionList[]);
    }
    // 导出-渠道(Paytrades)账户资产
    exportPaytradesListData(params: PaytradesParams) {
        return this.api.post('/ptr/export', params, { responseType: 'blob' }).then((result: any) => result);
    }

    // 渠道(Sino)账户资产流水
    getSinoListData(params: SinoParams) {
        interface _Response extends Pagination {
            list: SinoData[];
        }
        return this.api.post('/si/getPage', params).then((result: any) => result as _Response);
    }
    // 渠道(Sino)查询交易类型
    getSinoAction() {
        return this.api.get('/si/getTradeType').then((result: any) => result as getActionList[]);
    }
    // 查询资金方向
    getSinoBorrowLend() {
        return this.api.get('/si/getBorrowLend').then((result: any) => result as getActionList[]);
    }
    // 导出-渠道(Sino)账户资产
    exportSinoListData(params: SinoParams) {
        return this.api.post('/si/export', params, { responseType: 'blob' }).then((result: any) => result);
    }
    // 渠道(Skyee)账户资产流水
    getSkyeeListData(params: SkyeeParams) {
        interface _Response extends Pagination {
            list: SkyeeData[];
        }
        return this.api.post('/sk/findPage', params).then((result: any) => result as _Response);
    }
    // 渠道(Skyee)查询交易类型
    getSkyeeAction() {
        return this.api.get('/sk/getFundChangeType').then((result: any) => result as getActionList[]);
    }
    // 查询资金方向
    getSkyeeBorrowLend() {
        return this.api.get('/sk/getTxnDirect').then((result: any) => result as getActionList[]);
    }
    // 导出-渠道(Skyee)账户资产
    exportSkyeeListData(params: SkyeeParams) {
        return this.api.post('/sk/export', params, { responseType: 'blob' }).then((result: any) => result);
    }
    // 渠道快照
    getPageDitchAcctAssetSnapshot(params: ChannelSnapshot) {
        interface _Response extends Pagination {
            list: ChannelSnapshotData[];
        }
        return this.api.post('/ditchAcctAsset/getPageDitchAcctAssetSnapshot', params).then((result: any) => result as _Response);
    }
    // 渠道快照-统计
    getDitchAcctAssetSnapshotStatistics(params: ChannelSnapshot) {
        return this.api.post('/ditchAcctAsset/getDitchAcctAssetSnapshotStatistics', params).then((result: any) => result as channdelCardAmout);
    }
    // 导出渠道快照
    exportDitchAcctAssetSnapshot(params: ChannelSnapshot) {
        return this.api.post('/ditchAcctAsset/exportDitchAcctAssetSnapshot', params, { responseType: 'blob' }).then((result: any) => result);
    }

    // 生成渠道快照
    generateSnapshot(params: { ids?: string }): Promise<any> {
        return this.api.post('/ditchAcctAsset/generateSnapshot', params).then((res) => res);
    }

    // 渠道商卡片管理费类型下拉列表
    listManagementFeeType(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/ditchCard/listManagementFeeType');
    }

    // 管理费减免类型下拉列表
    listManagementReductionType(): Promise<{ name: string; value: string }[]> {
        return this.api.get('/ditchCard/listManagementReductionType');
    }

    // 渠道卡片管理费信息查询
    getManagementFeeInfo(params: { ditchCardId: string }) {
        return this.api.get('/ditchCard/getManagementFeeInfo', { params });
    }
}

export default new Channel();
