import { InfoDataConstType, InfoDataeConstructionItem } from '@/config-overall/interface/info';
import api from '@/api/newAgent/index';
export default () => {
    const newsInfo: InfoDataeConstructionItem[] = [
        {
            label: '消息编号',
            value: 'id',
        },
        {
            label: '消息内容',
            value: 'body',
        },
        {
            label: '业务类型',
            value: 'businessTypeName',
        },
        {
            label: '消息类型',
            value: 'msgTypeName',
        },
        {
            label: '业务编号',
            value: 'orderNo',
        },

        {
            label: '通知方式',
            value: 'typeName',
        },
        {
            label: '状态',
            value: 'stateName',
        },
        {
            label: '通知次数',
            value: 'sentTimes',
        },
        {
            label: '响应次数',
            value: 'resTimes',
        },
        {
            label: '最新通知响应内容',
            value: 'astResponse',
        },
        {
            label: '行动次数',
            value: 'actTimes',
        },
        {
            label: '发送时间',
            value: 'lastTime',
        },
        {
            label: '创建时间',
            value: 'createTime',
        },

        {
            label: '更新时间',
            value: 'updateTime',
        },
    ];

    const InfoDataListItem: InfoDataConstType = {
        show: true,
        fieldNames: newsInfo,
        titleName: '代理商消息详情',
        // handelInfoData: api.fetchCallbackInfo.bind(api),
        formState: {
            id: '',
        },
        width: 1000,
    };

    return {
        InfoDataListItem,
    };
};
