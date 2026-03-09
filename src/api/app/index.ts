import { Api } from '@/api/api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    bannerUpList(params: {
        title: string;
        language: string;
        isJump: null | 0 | 1; // 是否跳转 (0: 不跳转, 1: 跳转)
        goal: null | 0 | 1; // 投放人群 (0: 所有人, 1: 指定人群)
        type: null | 1 | 2 | 3 | 4 | 5; // 投放人群的类型 (1: 新注册用户, 2: 指定标签用户, 3: 未开户用户, 4: 未冲币用户, 5: 未汇款用户)
        showPosition: null | 1 | 2 | 3 | 4; // 展示位置 (1: 首页, 2: 行情页, 3: 卡片页, 4: 更多页)
        goalCreateTime: string; // 投放开始时间
        goalUpdateTime: string; // 投放结束时间
        status: null | 0 | 1 | 2;
        pageSize: number; // 每页条数
        pageNo: number; // 页数
    }): Promise<{
        list: {
            id: number; //
            title: string; // 标题
            language: string; // 语言标识
            url: string; // 广告图片链接
            isJump: 0 | 2; // 是否跳转 (0: 不跳转, 1: 跳转)
            jumpUrl: string; // 跳转链接
            goal: 0 | 1; // 投放人群 (0: 所有人, 1: 指定人群)
            goalStr: string; //
            status: 0 | 1 | 2; // 状态 (0: 下架, 1: 投放中, 2: 过期)
            showPosition: 1 | 2 | 3 | 4; // 展示位置 (1: 首页, 2: 行情页, 3: 卡片页, 4: 更多页)
            pushFrequency: 1 | 2 | 3; // 推送频次 (1: 永久一次, 2: 每次进入, 3: 自定义频次)
            pushFrequencyStr: string; // 推送频次
            everydayPush: 0 | 1; // 是否每天推送一次 (0: 否, 1: 是)
            otherDayPush: string; // otherDayPush
            goalCreateTime: string; // 投放开始时间
            goalUpdateTime: string; // 投放结束时间
            createTime: string; // 创建时间
            updateTime: string; // 更新时间
            parentId: string; //
            types: string;
        }[]
    } & TableResultType> {
        return this.api.post('/app/bannerUp/list', params);
    }

    addOrUpdate(params: {
        everydayPush: 0 | 1; // 是否每天推送一次 (0: 否, 1: 是)
        goal: 0 | 2; // 投放人群 (0: 所有人, 1: 指定人群)
        goalCreateTime: string; // 投放开始时间
        goalUpdateTime: string; // 投放结束时间
        id: string; // ID
        isJump: 0 | 1; // 是否跳转 (0: 不跳转, 1: 跳转)
        isPush: boolean; //
        jumpUrl: string; // 跳转链接
        labels: string; // 标签id
        language: string; // 语言标识
        operator: string; //
        otherDayPush: string; // 每几天推送一次
        pushFrequency: 1 | 2 | 3; // 推送频次 (1: 永久一次, 2: 每次进入, 3: 自定义频次)
        showPosition: 1 | 2 | 3 | 4; // 展示位置 (1: 首页, 2: 行情页, 3: 卡片页, 4: 更多页)
        status: 0 | 1 | 3; // 状态 (0: 下架, 1: 投放中, 2: 过期)
        title: string; // 标题
        type: 1 | 2 | 3 | 4 | 5; // 投放人群的类型 (1: 新注册用户, 2: 指定标签用户, 3: 未开户用户, 4: 未冲币用户, 5: 未汇款用户 多个用,隔开)
        url: string; // 广告图片链接
    }): Promise<any> {
        return this.api.post('/app/bannerUp/addOrUpdate', params);
    }

    // 检查有无发布的广告
    checkStatus(params: { language: string, id?: string, goalCreateTime?: string, goalUpdateTime?: string }): Promise<boolean> {
        return this.api.get('/app/bannerUp/checkStatus', { params });
    }

    // 获取详情
    info(params: { id: string }): Promise<{
        createTime: string; // 创建时间
        everydayPush: 0 | 1; // 是否每天推送一次 (0: 否, 1: 是)
        goal: 0 | 1; // 投放人群 (0: 所有人, 1: 指定人群)
        goalCreateTime: string; // 投放开始时间
        goalStr: string; // 投放人群
        goalTime: string; //
        goalUpdateTime: string; // 投放结束时间
        id: string; // ID
        isJump: 0 | 1; // 是否跳转 (0: 不跳转, 1: 跳转)
        jumpUrl: string; // 跳转链接
        labelList: { id: string; }[];
        language: string; // 语言标识
        otherDayPush: string; // 每几天推送一次
        parentId: string; //
        pushFrequency: 1 | 2 | 3; // 推送频次 (1: 永久一次, 2: 每次进入, 3: 自定义频次)
        pushFrequencyStr: string; // 推送频次
        showPosition: 1 | 2 | 3 | 4; // 展示位置 (1: 首页, 2: 行情页, 3: 卡片页, 4: 更多页)
        status: 0 | 1 | 2; // 状态 (0: 下架, 1: 投放中, 2: 过期)
        title: string; // 标题
        types: string;
        updateTime: string; // 更新时间
        url: string; // 广告图片链接
        halfUrl: string;
        typeList: number[];
    }> {
        return this.api.get('/app/bannerUp/info', { params });
    }

    // 下架 / 发布
    deListOrPublish(params: { id: string; status: 0 | 1 }): Promise<any> {
        return this.api.get('/app/bannerUp/deListOrPublish', { params });
    }
}

export default new FetchTest();
