import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/position';
import apiOrder from '@/newApi/order';
import configs from './table-config';

const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
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
            label: 'user.Third-party user ID',
            value: 'thirdAccountId',
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
            label: 'common.CreateTime',
            value: 'time',
            placeholder: 'common.PleaseEnter',
            type: 'date',
            timeFormat: 'timeStamp',
            timeValue: ['startTime', 'endTime'],
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
            handelSubmit: api.skipList.bind(api),
        },
        exportBtns: {
            show: true,
            buttonPermissions: 'export',
            handExport: api.skipListExport.bind(api),
            exportFileTitle: 'common.strategySignalLog',
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
