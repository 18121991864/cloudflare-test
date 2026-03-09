import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/digitAsset/tron/active';
import configs from './table-config';
const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: '出币地址',
            value: 'fromAddress',
            placeholder: '请输入',
            type: 'input',
        },
        {
            label: '激活地址',
            value: 'activateAddress',
            placeholder: '请输入',
            type: 'input',
        },
        {
            label: '状态',
            value: 'status',
            placeholder: '请选择',
            type: 'select',
            options: [],
        },
        {
            label: '时间',
            value: 'time',
            placeholder: '请选择',
            type: 'date',
            timeFormat: 'timeStamp',
            timeValue: ['createTimeBegin', 'createTimeEnd'],
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
            handelSubmit: api.getTrozenActivateParams.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 1800 },
        headersCustom: ['state', 'txHash'],
    },
    formState: {
        status: null,
    },
    allSelectAll: {
        show: true,
        value: null,
    },
    // statistics: {
    //     show: true,
    //     isType: 1, // 不需要自己组装数组
    //     AmountList: [{ label: '当前出币地址余额', value: 'balance', currenty: 'TRX' }],
    //     queryAmoutTotal: api.getissueInfo.bind(api),
    // },
});

export default () => {
    const construction = queryConfig.value.construction;
    construction.forEach((item) => {
        if (item.value === 'status') {
            api.getTrozenActivateStatus().then((res) => {
                item.options = res.map((item) => ({ label: item.label, value: item.value }));
            });
        }
    });
    return queryConfig;
};
