import { Api } from '../api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    list(params: {
        orderNumber: string; // 渠道订单
        partnerOrderNumber: string; // 订单号
        receiverId: string; // 收款人ID
        remitterId: string; // 汇款人ID
        state: string | null; // 状态：AUDITING-审核中 REJECT-驳回 REMITTED-已汇出 REMITTING-汇款中 REFUND-已退款 CLOSED-已关闭 RECEIVE_ABNORMAL-收款异常
    }): Promise<
        {
            list: {
                exchangeRate: number; // 汇率
                finishedTime: string; // 完成时间
                handleFee: number; // 手续费
                orderNumber: string; // 渠道订单
                partnerOrderNumber: string; // 订单
                paymentAmount: number; // 支付金额
                receiverId: string; // 收款人ID
                receiverName: string; // 收款人名称
                remitAmount: number; // 汇款金额
                remitterId: string; // 汇款人ID
                remitterName: string; // 汇款人名称
                status: string; // 状态
                totalPayment: string; // 支付总额
            }[];
        } & TableResultType
    > {
        // 登陆
        return this.api.get('/ditchRemit/list', { params });
    }

    ditchChoose(): Promise<{ id: string; name: string }[]> {
        return this.api.get('/ditch/chooseDitch');
    }
}

export default new FetchTest();
