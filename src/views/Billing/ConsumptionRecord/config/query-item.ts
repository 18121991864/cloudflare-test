import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/api/wallet/gas/index';
import configs from './table-config';

const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: 'From',
            value: 'fromAddress',
            placeholder: '请输入',
            type: 'input',
        },
        {
            label: 'To',
            value: 'toAddress',
            placeholder: '请输入',
            type: 'input',
        },
        {
            label: '创建时间',
            value: 'time',
            placeholder: '请选择',
            type: 'date',
            timeFormat: 'timeStamp',
            timeValue: ['startTime', 'endTime'],
        },

        {
            label: '消耗类型',
            value: 'type',
            placeholder: '请选择',
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
            handelSubmit: api.getAccountWalletList.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 2500 },
        headersCustom: ['txHash'],
    },
    formState: {
        type: null,
    },
    allSelectAll: {
        show: true,
        value: null,
    },
});
api.getAccountWalletType().then((res) => {
    const construction = queryConfig.value.construction.find((item) => item.value === 'type');
    res.forEach((item) => {
        construction?.options!.push({
            label: item.name,
            value: item.code,
        });
    });
});
export default queryConfig;
