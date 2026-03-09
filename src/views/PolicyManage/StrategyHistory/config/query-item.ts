import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/policy';
import configs from './table-config';

const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: 'user.StrategyId',
            value: 'strategyId',
            placeholder: 'common.PleaseEnter',
            type: 'input',
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
            handelSubmit: api.getStrategyVersionPage.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 3800 },
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

export default queryConfig;
