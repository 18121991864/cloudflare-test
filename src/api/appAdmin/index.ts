import { Api } from '../api';
import type { Pagination, rechargeType } from '../type';
import type {
    VersionList,
    VersionParams,
    VersionAdd,
    AppMessageParams,
    AppMessageList,
    AppMessagePush,
    AppMenuList,
    AppMenuParams,
    AdvertisingSpaceList,
    AdvertisingSpaceParams,
    AdvertisingPatch,
    PinCheckRuleParams,
    PinCheckRuleData,
    languageType,
    AppContactlistType,
    AppAddContactlist,
    AppMenuAreaList,
} from '@/api/appAdmin/types.d';

interface _Response<T> extends Pagination {
    list: T;
}

class AppAdmin extends Api {
    fetchVersionList(params: VersionParams) {
        // app版本列表

        return this.api.get('/app/version/list', { params }).then((result: any) => result as _Response<VersionList>);
    }

    fetchVersionAdd(params: VersionAdd) {
        // app新增版本
        return this.api.post('/app/version/add', { ...params, content: JSON.stringify(params.content) }).then((result: any) => result);
    }

    fetchVersionUpdate(params: VersionAdd) {
        // app编辑版本
        return this.api.post('/app/version/update', { ...params, content: JSON.stringify(params.content) }).then((result: any) => result);
    }

    fetchVersionInfo(params: { id: string }) {
        // app详情本
        return this.api.get('/app/version/info', { params }).then((result: any) => result as Required<VersionAdd>);
    }

    fetchVersionRecover(params: { id: string }) {
        // app恢复版本
        return this.api.get('/app/version/recover', { params }).then((result: any) => result as Required<VersionAdd>);
    }

    fetchAppEventList(params: AppMessageParams) {
        // app 活动推送列表
        return this.api.get('/event/list', { params }).then((result: any) => result as _Response<AppMessageList>);
    }

    fetchAppEventAddList(params: AppMessagePush) {
        // app 新增活动推送列表
        return this.api.post('/event/add', params).then((result: any) => result);
    }

    fetchAppEventUpdateList(params: AppMessagePush) {
        // app 编辑活动推送列表
        return this.api.post('/event/edit', params).then((result: any) => result);
    }

    fetchAppEventInfo(id: string) {
        // 查看推送列表
        return this.api.get(`/event/${id}`).then((result: any) => result as AppMessagePush);
    }

    fetchAppSendMessage(id: string) {
        // 立即发送 App 活动推送
        return this.api.post(`/event/send/${id}`).then((result: any) => result as AppMessagePush);
    }

    fetchAppRemoveMessage(id: string) {
        // 删除 App 活动推送
        return this.api.post(`/event/remove/${id}`).then((result: any) => result as AppMessagePush);
    }

    fetchAppMenuList(params: Partial<AppMenuParams>) {
        // App菜单列表
        return this.api.get('/app/menu/list', { params }).then((result: any) => result as _Response<AppMenuList>);
    }

    fetchAppMenuAdd(params: AppMenuList) {
        // 新增App菜单列表
        return this.api.post('/app/menu/add', { ...params }).then((result: any) => result);
    }

    fetchAppMenuEdit(params: AppMenuList) {
        // 修改App菜单列表
        return this.api.post('/app/menu/edit', { ...params }).then((result: any) => result);
    }

    fetchAppRemoveMenu(id: number) {
        // 删除 App 菜单
        return this.api.post(`/app/menu/remove/${id}`).then((result: any) => result as AppMessagePush);
    }

    fetchApptoggleVisibilityMenu(id: number) {
        // 更新 App 菜单
        return this.api.post(`/app/menu/toggleVisibility/${id}`).then((result: any) => result as AppMessagePush);
    }

    fetchappMenuAreaList(params: { language?: string }): Promise<AppMenuAreaList[]> {
        // 菜单区列表
        return this.api.get('/appMenuArea/list', { params });
    }

    fetchappMenuAreaAdd(params: { language: string; name: string }): Promise<any> {
        // 菜单区 新增
        return this.api.post('/appMenuArea/add', params);
    }

    fetchappMenuAreaUpdate(params: { language: string; name: string; id: number | string }): Promise<any> {
        // 菜单区 编辑
        return this.api.post('/appMenuArea/update', params);
    }

    fetchappMenuAreadelete(params: { id: number | string }): Promise<any> {
        // 菜单区 删除
        return this.api.get('/appMenuArea/delete', { params });
    }

    //信用卡菜单配置
    fetchAppCardMenuList(params: Partial<AppMenuParams>) {
        // App菜单列表
        return this.api.post('/app/menu/cardList', params).then((result: any) => result as _Response<AppMenuList>);
    }

    fetchAppCardMenuAdd(params: AppMenuList) {
        // 新增App菜单列表
        return this.api.post('/app/menu/addCardMenu', { ...params }).then((result: any) => result);
    }

    fetchAppCardMenuEdit(params: AppMenuList) {
        // 修改App菜单列表
        return this.api.post('/app/menu/editCardMenu', { ...params }).then((result: any) => result);
    }

    fetchAppCardRemoveMenu(id: number) {
        // 删除 App 菜单
        return this.api.post(`/app/menu/removeCardMenu/${id}`).then((result: any) => result as AppMessagePush);
    }

    fetchAppCardtoggleVisibilityMenu(id: number) {
        // 更新 App 菜单
        return this.api.post(`/app/menu/cardMenuToggleVisibility/${id}`).then((result: any) => result as AppMessagePush);
    }

    fetchAdvertisingSpaceList(params: AdvertisingSpaceParams) {
        //  App 广告位
        return this.api.get('/app/ad/list', { params }).then((result: any) => result as AdvertisingSpaceList);
    }

    fetchAdvertisingSpaceAdd(params: AdvertisingSpaceList) {
        //  新增App 广告位
        return this.api.post('/app/ad/add', params).then((result: any) => result);
    }

    fetchAdvertisingSpaceEdit(params: AdvertisingSpaceList) {
        //  新增App 广告位
        return this.api.post('/app/ad/edit', params).then((result: any) => result);
    }

    fetchAdvertisingSpaceRemove(id: number) {
        //  删除App 广告位
        return this.api.post(`/app/ad/remove/${id}`).then((result: any) => result);
    }

    fetchAdvertisingSpacePatch(params: AdvertisingPatch) {
        //  更新App 广告位
        return this.api.post('/app/ad/patch', params).then((result: any) => result);
    }

    fetchPinCheckRuleList(params: PinCheckRuleParams) {
        //  安全风控 列表
        return this.api.post('/pinCheckRule/list', params).then((result: any) => result as Array<PinCheckRuleData>);
    }

    fetchPinCheckRuleFCodeSelect() {
        //  安全风控 功能code下拉
        return this.api.get('/pinCheckRule/fCodeSelect').then((result: any) => result);
    }

    fetchPinCheckRulePinRangeSelect() {
        //  安全风控 范围下拉
        return this.api.get('/pinCheckRule/pinRangeSelect').then((result: any) => result);
    }

    fetchPinCheckRuleAdd(params: PinCheckRuleData) {
        //  新增安全风控
        return this.api.post('/pinCheckRule/add', params).then((result: any) => result);
    }

    fetchPinCheckRuleEdit(params: PinCheckRuleData) {
        //  编辑安全风控
        return this.api.post('/pinCheckRule/edit', params).then((result: any) => result);
    }

    fetchAppContactList(params: {
        contactInformation: string;
        languageSymbol: null | string;
        state: null | string;
        pageNo: number;
        pageSize: number;
    }): Promise<_Response<AppContactlistType[]>> {
        //  联系方式管理 列表
        return this.api.post('/sys/appContact/list', params);
    }

    fetchAppContactLanguage(): Promise<languageType[]> {
        //  语言下拉列表
        return this.api.get('/sys/appContact/languageList');
    }

    fetchAppContactSort(params: { languageSymbol: string; type: boolean }): Promise<number[]> {
        // 联系方式管理 排序
        return this.api.get('/sys/appContact/sort', { params });
    }

    fetchAppContactAdd(params: AppAddContactlist): Promise<number[]> {
        // 联系方式管理 新增
        return this.api.post('/sys/appContact/add', params);
    }

    fetchAppContactUpdate(params: AppAddContactlist): Promise<number[]> {
        // 联系方式管理 新增
        return this.api.post('/sys/appContact/update', params);
    }

    fetchAppContactUpdateState(params: { id: string; state: number }): Promise<number[]> {
        // 联系方式管理 新增
        return this.api.get('/sys/appContact/updateState', { params });
    }

    fetchListMigratedUserType(): Promise<Record<string, string>[]> {
        // 迁移用户类型枚举
        return this.api.get('/app/version/listMigratedUserType');
    }

    fetchlistRang(): Promise<Record<string, string>[]> {
        // 针对用户范围枚举
        return this.api.get('/app/version/listRang');
    }

    fetchExportUids(importBatchNo: string): Promise<any> {
        return this.api.get('/app/version/exportUid', { responseType: 'blob', params: { importBatchNo } }).then((result: any) => result);
    }

    // 电话国际区号列表 sys/tel/area/select
    fetchTelAreaSelect(): Promise<any> {
        return this.api.get('/sys/tel/area/select');
    }

}

export default new AppAdmin();
