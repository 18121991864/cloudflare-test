// eslint-disable-next-line max-classes-per-file
import { Api } from '../api';
import type { TableDataPages } from '@/interface/StateType';
class OeTransferFetch extends Api {
    /**
     * @description OE汇款调单用户列表
     * */
    queryAdjustmentOrderList(params: Record<string, any>): Promise<TableDataPages<IAdjustmentOrderList>> {
        return this.api.get('/oe/remit/paymentAdjustmentOrderList', { params });
    }
    /**
     * @description OE汇款调单用户详情
     * */
    queryAdjustmentOrderDetail(id: string): Promise<IAdjustmentOrderDetail> {
        return this.api.get('/oe/remit/paymentAdjustmentOrderInfo', { params: { id } });
    }

    /**
     * @description OE汇款账户申请列表
     * */
    queryTransferAccountList(params: Record<string, any>): Promise<TableDataPages<IOeTransferAccount>> {
        return this.api.get('/oe/remit/accountPayerList', { params });
    }

    /**
     * @description OE汇款账户申请详情
     * */
    queryTransferAccountDetail(id: string): Promise<IOeTransferAccountDetail> {
        return this.api.get('/oe/remit/accountPayerInfo', { params: { id } });
    }

    /**
     * @description OE收款账户申请列表
     * */
    queryTransferPayeeApplyList(params: Record<string, any>): Promise<TableDataPages<IOePayeeApply>> {
        return this.api.get('/oe/remit/accountPayeeList', { params });
    }

    /**
     * @description OE收款账户申请详情
     * */
    queryTransferPayeeApplyDetail(id: string): Promise<IOePayeeApplyDetail> {
        return this.api.get('/oe/remit/accountPayeeInfo', { params: { id } });
    }

    /**
     * @description OE汇款订单列表
     * */
    queryTransferOrderList(params: Record<string, any>): Promise<TableDataPages<IOeOrder>> {
        return this.api.get('/oe/remit/paymentList', { params });
    }

    /**
     * @description OE汇款订单详情
     * */
    queryTransferOrderDetail(id: string): Promise<IOeOrderDetail> {
        return this.api.get('/oe/remit/paymentInfo', { params: { id } });
    }

    /**
     * @description OE汇款订单修改状态
     * */
    updateTransferOrderStatus(params: Record<string, any>): Promise<void> {
        return this.api.post('/oe/remit/updatePaymentOrderState', params);
    }
    /**
     * @description OE汇款订单-渠道驳回
     * */
    rejectTransferOrder(params: Record<string, any>): Promise<void> {
        return this.api.post('/oe/remit/channelReject', params);
    }
    /**
     * @description OE汇款订单-退款
     * */
    rejectTransferRefund(params: Record<string, any>): Promise<void> {
        return this.api.post('/oe/remit/refund', params);
    }
    /**
     * @description 设置手续费
     * */
    setTransferFee(params: Record<string, any>): Promise<void> {
        return this.api.post('/oe/remit/setFee', params);
    }
    /**
     * @description OE收款人申请驳回
     * */
    updateTransferPayeeApplyState(params: Record<string, any>): Promise<void> {
        return this.api.post('/oe/remit/rejectPayeeState', params);
    }
    /**
     * @description OE汇款账户申请驳回
     * */
    updateTransferAccountState(params: Record<string, any>): Promise<void> {
        return this.api.post('/oe/remit/rejectPayerState', params);
    }

    /**
     * @description OE汇款订单列表导出
     * */
    paymentListExcelWriter(params: Record<string, any>): Promise<void> {
        return this.api.get('/oe/remit/paymentList/excelWriter', { params, responseType: 'blob' });
    }

    /**
     * @description 获取手续费
     * */
    queryFee(): Promise<string> {
        return this.api.get('/oe/remit/getFee');
    }
}

export default new OeTransferFetch();
