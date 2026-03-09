import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/position';
import apiOrder from '@/newApi/order';
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
            label: 'policy.TradingPair',
            value: 'contractName',
            placeholder: 'common.PleaseEnter',
            type: 'input',
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
            label: 'policy.Direction',
            value: 'direction',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [
                { label: 'policy.Hold', value: 0 },
                { label: 'policy.Buy', value: 1 },
                { label: 'policy.Sell', value: 2 },
            ],
        },
        {
            label: 'common.source',
            value: 'source',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [],
        },
        {
            label: 'common.CreateTime',
            value: 'time',
            placeholder: 'common.PleaseEnter',
            type: 'date',
            timeFormat: 'timeStamp',
            timeValue: ['createStartTime', 'createEndTime'],
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
            handelSubmit: api.getpositionList.bind(api),
        },
        exportBtns: {
            show: true,
            buttonPermissions: 'export',
            handExport: api.positionListExport.bind(api),
            exportFileTitle: 'common.strategySignalHistory',
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 1000 },
        headersCustom: ['direction'],
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
            apiOrder.sourceSelect().then((res) => {
                item.options = res;
            });
        }
    });
    return queryConfig;
};
