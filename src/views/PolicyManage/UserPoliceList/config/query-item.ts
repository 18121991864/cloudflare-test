import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/policy';
import configs from './table-config';

const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: 'user.UserUID',
            value: 'uid',
            placeholder: '请输入',
            type: 'input',
        },
        {
            label: 'common.Status',
            value: 'status',
            placeholder: '请输入',
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
            handelSubmit: api.getStrategyAccountPage.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 2000 },
        headersCustom: ['direction', 'gridTradeStatus'],
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
        if (item.value === 'status') {
            if (item?.options?.length) return;
            api.getStatusySelect().then((res) => {
                item.options = res;
            });
        }
    });
    return queryConfig;
};
