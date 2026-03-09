import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';

class FetchTest extends Api {
    orderList(params: {
        accountId: string; // 用户UID
        agentName: string; // 所属代理商
        cardName: string; // 卡片名称
        cardNo: string; // 卡号
        ditchId: string; // 渠道ID
        ditchName: string; // 渠道名称
        endTime: string; // 扣费时间结束
        mainOrderNo: string; // 订单号
        orderNo: string; // 子订单号
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        startTime: string; // 扣费时间开始
        status: null | number; // 订单状态
    }): Promise<
        {
            list: {
                accountId: string; // 用户UID
                agentName: string; // 所属代理商
                cardName: string; // 卡片名称
                cardNo: string; // 卡号
                cardType: string; // 卡片实/虚
                childDeductionTime: string; // 子订单扣费时间
                deductionFee: string; // 扣费金额
                deductionTime: string; // 扣费时间
                ditchId: string; // 渠道ID
                ditchName: string; // 渠道名称
                id: string; //
                mainOrderNo: string; // 订单号
                managementFeeType: 2 | 3; // 收费方式 2年费 3月费
                managementFeeTypeName: string; // 收费方式
                orderNo: string; // 子订单号
                orderNumber: string; //
                remainingFee: string; // 订单扣费剩余金额
                status: number; // 订单状态
                statusName: string; // 订单状态
            }[];
        } & TableResultType
    > {
        // 币种-列表
        const startTime = params.startTime ? `${params.startTime} 00:00:00` : null;
        const endTime = params.endTime ? `${params.endTime} 23:59:59` : null;
        return this.api.post('/management/fee/order/list', { ...params, startTime, endTime });
    }

    // 导出
    orderExport(params: {
        accountId: string; // 用户UID
        agentName: string; // 所属代理商
        cardName: string; // 卡片名称
        cardNo: string; // 卡号
        ditchId: string; // 渠道ID
        ditchName: string; // 渠道名称
        endTime: string; // 扣费时间结束
        mainOrderNo: string; // 订单号
        orderNo: string; // 子订单号
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        startTime: string; // 扣费时间开始
        status: null | number; // 订单状态
    }) {
        const startTime = params.startTime ? `${params.startTime} 00:00:00` : null;
        const endTime = params.endTime ? `${params.endTime} 23:59:59` : null;
        return this.api.post('/management/fee/order/export',  { ...params, startTime, endTime }, { responseType: 'blob' });
    }

    // 免年费管理列表
    managementFree(params: {
        ditchCardId: string; // 渠道卡id
        ditchId: string; // 渠道id
        exposureRange: 1 | 2 | 3 | null; // 限制范围 1:全局 2:标签 3:用户
        id: string; // 序号
        pageNo: number; // 页码
        pageSize: number; // 页面大小
    }) {
        const exposureRange = params.exposureRange === 4 ? '2,3' : params.exposureRange;
        return this.api.post('/managementFree/list', {  ...params, exposureRange });
    }

    // 免年费管理 新增 / 修改
    addOrUpdate(params: {
        accountIds: string; // 用户ID 多个,隔开
        labelIds: string; // 标签ID 多个,隔开
        ditchCardId: string; // 渠道卡ID
        ditchId: string; // 渠道id
        exposureRange: 1 | 2 | 3; // 限制范围 1:全局 2:标签 3:用户
        id: string; // 序号
        state: 1 | 2; // 状态 1=启用，2=禁用
    }) {
        return this.api.post('/managementFree/addOrUpdate', params);
    }

    // 免年费管理-渠道选择
    ditchChoose(): Promise<{
        id: string;
        name: string;
    }[]> {
        return this.api.get('/managementFree/ditch/choose');
    }

    // 免年费管理-渠道卡片
    cardChoose(params: { ditchId: string }): Promise<{
        id: string;
        name: string;
    }[]> {
        return this.api.get('/managementFree/card/choose', { params });
    }

    // 免年费管理-删除
    managementFreeDelete(params: { id: string }): Promise<boolean> {
        return this.api.get(`/managementFree/delete/${params.id}`);
    }

    // 免年费管理-详情
    getDetail(params: { id: string }): Promise<boolean> {
        return this.api.get(`/managementFree/getDetail/${params.id}`);
    }

    // 状态列表
    feeOrderStatus(): Promise<{ code: number; name: string; }[]> {
        return this.api.get('/management/fee/order/status');
    }
}

export default new FetchTest();
