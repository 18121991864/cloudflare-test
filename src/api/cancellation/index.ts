import { Api } from '../api';
import { Pagination } from '../type';
import { AddRefndList, CancelCardListResList, CancelCardParams, RefndFirstCheck, RefndList, RefndParams, predictDitchAmount } from './types.d';
import {TableDataPages, TableQueryParams} from "@/interface/StateType";

class CancelCardList extends Api {
    fetchCancelCardList(params: CancelCardParams) {
        // 销卡-列表
        interface _Response extends Pagination {
            list: CancelCardListResList[];
        }

        return this.api.post('/cardCancel/cancelList', params).then((result: any) => result as _Response);
    }

    fetchCancelExport(params: CancelCardParams) {
        // 销卡-导出列表
        return this.api.post('/cardCancel/cancelListExcel', params, {responseType: 'blob'}).then((result: any) => result);
    }
    fetchgetCardRefundOrder(params: { cardNo: string }) {
        // 查询-退款是否多次提交
        return this.api.get('/cardCancel/getCardRefundOrder', {params}).then((result: any) => result as Boolean);
    }

    fetchaCardCanceldRefund(params: AddRefndList) {
        // 新增-退款金额
        return this.api.post('/cardCancel/addRefund', params).then((result: any) => result);
    }

    fetchCancelRefundList(params: RefndParams) {
        // 退款-列表
        interface _Response extends Pagination {
            list: RefndList[];
        }

        return this.api.post('/cardCancel/refundList', params).then((result: any) => result as _Response);
    }

    fetchCancelReFirstCheck(params: RefndFirstCheck) {
        // 退款-初审
        interface _Response extends Pagination {
            list: RefndList[];
        }

        return this.api.post('/cardCancel/firstCheck', params).then((result: any) => result as _Response);
    }

    fetchCancelReSecondCheck(params: RefndFirstCheck) {
        // 退款-初审
        interface _Response extends Pagination {
            list: RefndList[];
        }

        return this.api.post('/cardCancel/secondCheck', params).then((result: any) => result as _Response);
    }

    fetchCancelRefundExport(params: RefndParams) {
        // 销卡-导入列表
        return this.api.post('/cardCancel/refundListExcel', params, {responseType: 'blob'}).then((result: any) => result);
    }

    // 换卡列表
    cardReplacementOldList(params: {
        accountId: string;
        cardReplacementState: 1 | 2 | 3 | 4 | 5 | 6; // 换卡状态 1、待审核 2、渠道处理中 3、渠道拒绝 4、渠道通过 5、完成 6、审核拒绝
        ditchId: string; // 渠道ID
        endTime: string; // 结束时间
        labelIds: string; // 用户标签
        newCardNo: string; // 新卡号
        oldCardNo: string; // 原卡号
        pageNo: number; // 页码
        pageSize: number; // 每页大小
        startTime: string; // 开始时间
        type: 1 | 2 | 3; // 类型 1、新的到期日 2、新卡号 3、新卡号和新有效期
    }) {
        return this.api.post('/cardCancel/cardReplacementOldList', params);
    }

    // 销卡列表后台状态枚举
    sysStates(): Promise<{
        code: number;
        name: string;
    }[]> {
        return this.api.get('/cardCancel/sysStates');
    }

    // 销卡列表用户状态枚举
    userStates(): Promise<{
        code: number;
        name: string;
    }[]> {
        return this.api.get('/cardCancel/userStates');
    }

    // 销卡审核
    checkCancelCard(params: {
        id: string;
        rejectionReasonCn: string; // 拒绝理由-中文
        rejectionReasonEn: string; // 拒绝理由-英文
        state: 1 | 2; // 1、通过 2、不通过
    }) {
        return this.api.post('/cardCancel/checkCancelCard', params);
    }

    // 换卡状态枚举
    cardReplacementStates(): Promise<{
        value: number;
        description: string;
    }[]> {
        return this.api.get('/cardCancel/cardReplacementStates');
    }

    // 新卡枚举状态
    cardStates(): Promise<{
        code: number;
        name: string;
    }[]> {
        return this.api.get('/cardCancel/cardStates');
    }

    // 导出换卡列表
    cardReplacementOldListExcel(params: {
        accountId: string;
        cardReplacementState: 1 | 2 | 3 | 4 | 5 | 6; // 换卡状态 1、待审核 2、渠道处理中 3、渠道拒绝 4、渠道通过 5、完成 6、审核拒绝
        ditchId: string; // 渠道ID
        endTime: string; // 结束时间
        labelIds: string; // 用户标签
        newCardNo: string; // 新卡号
        oldCardNo: string; // 原卡号
        pageNo: number; // 页码
        pageSize: number; // 每页大小
        startTime: string; // 开始时间
        type: 1 | 2 | 3; // 类型 1、新的到期日 2、新卡号 3、新卡号和新有效期
    }): Promise<Blob> {
        return this.api.post('/cardCancel/cardReplacementOldListExcel', params, { responseType: 'blob' });
    }

    // 换卡审核
    checkCardReplacementOld(params: {
        id: string;
        rejectionReasonCn: string; // 拒绝理由-中文
        rejectionReasonEn: string; // 拒绝理由-英文
        state: 1 | 2; // 1、通过 2、不通过
    }) {
        return this.api.post('/cardCancel/checkCardReplacementOld', params);
    }

    // 更新余额
    updateAmount(params: { id: string }) {
        return this.api.get('/cardCancel/updateAmount', { params });
    }

    // 卡退款查询汇率
    queryCardRefundRate(params: { id: string }) {
        return this.api.get('/cardCancel/queryCardRefundRate', { params });
    }

    // 更新换卡状态
    updateCardReplacementStatus(params: { id: string }) {
        return this.api.get('/cardCancel/updateCardReplacementStatus', { params });
    }
}

export default new CancelCardList();
