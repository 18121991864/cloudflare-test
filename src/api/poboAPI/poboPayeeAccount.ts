// eslint-disable-next-line max-classes-per-file

import http from '@/servers/index';
import { TableResultType } from '@/interface/StateType';

abstract class Api {
    protected api: http;

    constructor() {
        const url = String(import.meta.env.VITE_APP_BASE_URL);
        const baseUrl: string = `${url}/PoboPayeeAccount`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }

    // protected abstract verifyParamsSchema<T>(params: object, schema: object): T | null;  // 如果需要中间件拦截(参数验证等服务)，可以使用Joi集成服务
}

class FetchTest extends Api {
    list(params: {
        accountNumber: string; // 收款账户号
        name: string; // 姓名
        stateAudit: number | null; // 审核状态：0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-渠道通过 6-风控中 7-已关闭 8-已删除
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                isLoading: boolean;
                accountNumber: string; // 收款人账户号
                bankAddress: string; // 收款银行地址
                bankSwiftCode: string; // 银行SWIFT/BIC代码
                collectionBank: string; // 收款银行名称
                createTime: string; // 创建时间
                id: number; //
                name: string; // 姓名
                state: number; // 状态 1-启用 2-禁用
                stateAudit: number; // 审核状态：0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-渠道通过 6-风控中 7-已关闭 8-已删除
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
        stateAudit: number | null; // 状态
    }): Promise<any> {
        return this.api.post('/updateStateAudit', params);
    }

    able(params: {
        // 启用
        id: number; //
        remark: string; // 备注
        url: string; // 上传材料url
    }): Promise<any> {
        return this.api.post('/able', params);
    }

    disable(params: {
        // 禁用
        id: number; //
        remark: string; // 备注
        url: string; // 上传材料url
    }): Promise<any> {
        return this.api.post('/disable', params);
    }

    preview(params: { id: number }): Promise<string[]> {
        // 预览
        return this.api.get('/preview', { params });
    }

    info(params: { id: number }): Promise<{
        // 详细
        accountName: string; // 账户名
        accountNumber: string; // 账户号
        address: string; // 通讯地址
        bankAddress: string; // 银行地址
        bankCode: string; // 银行识别码
        bankSwiftCode: string; // 银行swift编码
        birthday: string; // 出生年月日
        collectionBank: string; // 收款银行
        credentialNumber: string; // 证件号
        credentialReleaseCountry: string; // 证件发行国家
        credentialType: string; // 证件类型 （POST 护照 / PASS 通行证 / OTHER 其他 / IDCARD 身份证)
        expirationDateBegin: string; // 有效期开始时间
        expirationDateEnd: string; // 有效期结束时间
        id: string; // ID
        name: string; // name
        nationality: string; // 国籍
        openBankCountry: string; // 开户行国家
        sex: number; // 1、男 2、女
        stateAudit: number; // 状态：0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-渠道通过 6-风控中 7-已关闭 8-已删除
        subject: number; // 1、企业 2、个人
        surname: string; // surname
        enterpriseName: string;
        registCountry: string;
        registAddress: string;
        businessCountry: string;
        businessAddress: string;
    }> {
        return this.api.get('/info', { params });
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
