// eslint-disable-next-line max-classes-per-file
import { AxiosInstance } from 'axios';

import http from '@/servers/index';
import { TableResultType } from '@/interface/StateType';

abstract class Api {
    protected api: http;

    constructor() {
        const url = String(import.meta.env.VITE_APP_BASE_URL);
        const baseUrl: string = `${url}/poboRemitterAccount`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }

    // protected abstract verifyParamsSchema<T>(params: object, schema: object): T | null;  // 如果需要中间件拦截(参数验证等服务)，可以使用Joi集成服务
}

class FetchTest extends Api {
    list(params: {
        accountId: string; // 用户ID
        email: string; // 邮箱
        state: number | null; // 0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-渠道通过 6-风控中 7-已关闭
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                isLoading: boolean;
                accountId: string; // 用户ID
                collectionAmount: number; // 收款金额
                createTime: string; // 创建时间
                exchangeFee: number; // 手续费
                exchangeRate: number; // 汇率
                id: number; //
                orderNo: string; // 订单号
                paymentAmount: number; // 付款金额
                paymentTotalAmount: number; // 支付总额
                purpose: string; // 汇款用途
                state: number; // 状态：0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-汇款中 6-汇款成功 7-退款 8-退款中 9-已退款 10-取消订单 11-收款异常
                transactionProofUrl: string; // 交易凭证
                updateTime: string; // 变更时间
            }[];
        } & TableResultType
    > {
        // 登陆
        return this.api.post('/list', params);
    }

    getOperateLogList(params: {
        // 汇款订单操作日志列表
        id: number;
        pageNo: number; // 页数
        pageSize: number; // 条数
    }): Promise<{
        list: {
            createTime: string; // 时间
            opContent: string; // 操作内容
            opFile: string; // 上传材料url
            opRemark: string; // 备注
            opUserName: string; // 操作人
        }[];
    }> {
        return this.api.post('/getOperateLogList', params);
    }

    updateState(params: {
        // 修改状态
        id: number;
        remark: string; // 备注
        state: number | null; // 状态
    }): Promise<any> {
        return this.api.post('/updateState', params);
    }

    preview(params: { id: number }): Promise<string[]> {
        // 预览
        return this.api.get('/preview', { params });
    }

    download(params: { id: number }): Promise<any> {
        // 下载
        return this.api.get('/download', { params });
    }

    updateApplyFormUrl(params: {
        applyFormUrl: string; // 申请表单URL,相对路径
        id: number; //
    }): Promise<any> {
        return this.api.post('/updateApplyFormUrl', params);
    }

    reject(params: { id: number; reject: string }): Promise<any> {
        // 驳回
        return this.api.post('/reject', params);
    }

    rejectReason(params: number): Promise<{
        count: number; // 手动拒绝次数
        reject: string; // 渠道拒绝原因
    }> {
        // 获取渠道驳回原因
        return this.api.get(`/reject/${params}`);
    }
}

export default new FetchTest();
