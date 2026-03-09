import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/digitAsset/tron';
import configs from './table-config';

const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: '外部订单号',
            value: 'serial',
            placeholder: '请输入',
            type: 'input',
        },
        {
            label: '来源订单号',
            value: 'sourceOrderNo',
            placeholder: '请输入',
            type: 'input',
        },
        {
            label: '时间',
            value: 'time',
            placeholder: '请选择',
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
            handelSubmit: api.getTrozenEnergyParams.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 1000 },
        headersCustom: ['state'],
    },
    formState: {},
    allSelectAll: {
        show: true,
        value: null,
    },
});

export default queryConfig;
