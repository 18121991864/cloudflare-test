import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';

class FetchTest extends Api {
    smsLogList(params: {
        accountId: string; // 用户UID
        email: string; // 邮箱
        endTime: string; // 结束时间
        globalCode: string; // 区号
        pageNo: number;
        pageSize: number;
        phone: string; // 手机号
        result: 1 | 2| null; // 发送结果(1:成功,2:失败)
        startTime: string; // 开始时间
        title: string; // 标题
    }): Promise<
        {
            list: {
                accountId: string; // 用户UID
                content: string; // 发送内容
                createTime: string; // 生成时间
                createYearMonth: string; // 生成年月
                email: string; // 邮箱
                globalCode: string; // 区号
                id: string; // 记录ID
                phone: string; // 手机号
                reason: string; // 失败原因
                result: 1 | 2; // 发送结果(1:成功,2:失败)
                resultName: string; // 发送结果名称(1:成功,2:失败)
                title: string; // 标题
            }[];
        } & TableResultType
    > {
        return this.api.post('/notify/smsLog/list', params);
    }

    // 短信发送记录导出
    smsLogExport(params: { endTime: string; startTime: string }): Promise<any> {
        return this.api.post('/notify/smsLog/export', params, { responseType: 'blob' });
    }

    // 平台下拉接口
    platformChoose(): Promise<{
        code: string;
        name: string;
    }[]> {
        return this.api.get('/notify/smsLog/platformChoose');
    }

    // 客户咨询列表
    customerInquiryList(params: {
        pageNo: number;
        pageSize: number;
        enquiryTypeId?: string;
        synState?: string;
    }): Promise<
    {
        list: {
            businessType: string;
            companyName: string;
            companyWebsite: string;
            countryCode: string;
            createTime: string;
            email: string;
            enquiryTypeName: string;
            enquiryTypeNameEn: string;
            firstName: string;
            id: number;
            lastName: string;
            message: string;
            phoneNumber: string;
            synState: number;
            telegramUserName: string;
            updateTime: string;
        }[];
    } & TableResultType> {
        return this.api.post('/contactUs/list', params );
    }

    // /api/v1/contactUs/synZoho
    synZoho(params: {
        id: number;
    }): Promise<any> {
        return this.api.get('/contactUs/synZoho', {params});
    }

    

    // 咨询类型下拉接口
    queryEnquiryTypeList(): Promise<{
        id: string;
        name: string;
    }[]> {
        return this.api.get('/contactUs/queryEnquiryTypeList');
    }
}

export default new FetchTest();
