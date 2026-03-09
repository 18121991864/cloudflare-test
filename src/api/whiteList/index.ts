import { Api } from '../api';
import { Pagination } from '../type';

interface IWhitelistList {
    accountId: string;
    businessType: string;
    createTime: string;
    dkycLevel: string;
    dname: string;
    id: string;
    ktype: string;
    kycLevel: string;
    kycLevelMock: number;
    kycLevelRequired: number;
    state: number;
    tag: string;
    updateTime: string;
}

interface IWhitelistBus {
    id: string;
    name: string;
}

class Whitelist extends Api {
    fetchWhitelistList(params: Record<string, any>) {
        // 白名单列表
        interface _Response extends Pagination {
            list: IWhitelistList[];
        }

        return this.api.post('/kycWhite/list', params).then((result: any) => result as _Response);
    }

    fetchAddWhitelist(params: Record<string, any>) {
        // 添加白名单
        return this.api.post('/kycWhite/add', params);
    }

    fetchUpdateWhitelist(params: Record<string, any>) {
        // 更新白名单
        return this.api.post('/kycWhite/update', params);
    }

    fetchWhitelistBusList(type = 1) {
        // 添加白名单
        return this.api
            .get('/kycWhite/getBusinessList', {
                params: { type },
            })
            .then((result: any) => result as IWhitelistBus[]);
    }

    fetchUidById(accountId: string, signal?: any) {
        // 添加白名单
        return this.api
            .get('/kycWhite/getEmailByAccountId', {
                params: { accountId },
                signal,
            })
            .then((result: any) => result as string);
    }

    fetchPpdateState(params: Record<string, any>) {
        // 添加白名单
        return this.api.post('/kycWhite/updateState', params).then((result: any) => result as boolean);
    }
}

export default new Whitelist();
