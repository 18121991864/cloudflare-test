import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/order';
import configs from './table-config';

const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: 'user.UserID',
            value: 'accountId',
            placeholder: 'common.PleaseEnter',
            type: 'input',
        },
        {
            label: 'user.UserUID',
            value: 'uid',
            placeholder: 'common.PleaseEnter',
            type: 'input',
        },
        {
            label: 'user.UserMailbox',
            value: 'email',
            placeholder: 'common.PleaseEnter',
            type: 'input',
        },
        {
            label: 'order.OrderID',
            value: 'orderNo',
            placeholder: 'common.PleaseEnter',
            type: 'input',
        },
        {
            label: 'user.Third-party user ID',
            value: 'thirdAccountId',
            placeholder: 'common.PleaseEnter',
            type: 'input',
        },
        {
            label: 'order.ThirdPartyOrderID',
            value: 'thirdOrderId',
            placeholder: 'common.PleaseEnter',
            type: 'input',
        },
        {
            label: 'order.TradingPair',
            value: 'contractName',
            placeholder: 'common.PleaseEnter',
            type: 'input',
        },
        {
            label: 'common.CreateTime',
            value: 'time',
            placeholder: 'common.PleaseEnter',
            type: 'date',
            timeFormat: 'timeStamp',
            timeValue: ['createStartTime', 'createEndTime'],
        },
        {
            label: 'common.source',
            value: 'source',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [],
        },
        {
            label: 'user.Ditch',
            value: 'ditchCode',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [
                { label: 'bingX', value: 'bingX' },
                { label: 'edgeX', value: 'edgeX' },
            ],
        },
        {
            label: 'common.orderType',
            value: 'orderType',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [],
        },
        {
            label: 'common.Status',
            value: 'status',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [],
        },
        {
            label: 'common.cancelReason',
            value: 'cancelReason',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [],
        },
    ],
    constrClassName: 'wrap-box',
    btnShow: true,
    btns: {
        addBtns: {
            show: false,
        },
        editBtns: {
            show: false,
        },
        infoButs: {
            show: false,
        },
        queryBtns: {
            handelSubmit: api.getOrderList.bind(api),
        },
        exportBtns: {
            show: true,
            buttonPermissions: 'export',
            handExport: api.orderListExport.bind(api),
            exportFileTitle: 'common.OrderList',
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 3500 },
        headersCustom: ['direction', 'cancelReason'],
    },
    formState: {
        status: null,
    },
    allSelectAll: {
        show: true,
        value: null,
    },
});

export default () => {
    const construction = queryConfig.value.construction;
    construction.forEach((item) => {
        if (item.value === 'source') {
            api.sourceSelect().then((res) => {
                item.options = res;
            });
        }
        if (item.value === 'cancelReason') {
            api.cancelReasonSelect().then((res) => {
                item.options = res;
            });
        }
        if (item.value === 'status') {
            api.statusSelect().then((res) => {
                item.options = res;
            });
        }
        if (item.value === 'orderType') {
            api.orderTypeSelec().then((res) => {
                item.options = res;
            });
        }
    });
    return queryConfig;
};
