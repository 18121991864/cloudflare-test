import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/policy';
import configs from './table-config';
import i18n from '@/setup/i18n-setup';

const t = i18n.global.t;

const { headers } = configs();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: 'policy.PolicyName',
            value: 'name',
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
            show: true,
            titleName: 'policy.EditPolicy',
            fieldNames: [
                {
                    label: `policy.BasePositionRatio`,
                    type: 'input',
                    value: 'basePositionSize',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
                {
                    label: `policy.DeviationThreshold`,
                    type: 'input',
                    value: 'deviationThreshold',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
                {
                    label: `policy.InitialBalance`,
                    type: 'input',
                    value: 'initialBalance',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
                {
                    label: `policy.MediumTermMAperiod`,
                    type: 'input',
                    value: 'maPeriod',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
                {
                    label: `policy.MaxTradeInterval`,
                    type: 'input',
                    value: 'maxTradeInterval',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
                {
                    label: `policy.MaxDailyTrades`,
                    type: 'input',
                    value: 'maxTradesPerDay',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
                {
                    label: `policy.MinTradeInterval`,
                    type: 'input',
                    value: 'minTradeInterval',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
                { label: `policy.StopLossRatio`, type: 'input', value: 'stopLossPct', placeholder: 'common.PleaseEnter', isRuqire: true },
                { label: `policy.TakeProfitRatio`, type: 'input', value: 'takeProfitPct', placeholder: 'common.PleaseEnter', isRuqire: true },
                { label: `policy.TargetVolatility`, type: 'input', value: 'targetVolatility', placeholder: 'common.PleaseEnter', isRuqire: true },
                { label: `policy.VersionName`, type: 'input', value: 'versionName', placeholder: 'common.PleaseEnter', isRuqire: true },

                {
                    label: `common.Status`,
                    type: 'select',
                    selectOptions: [
                        { label: 'common.Enable', value: 1 },
                        { label: 'common.Disable', value: 2 },
                    ],
                    value: 'status',
                    placeholder: 'common.PleaseEnter',
                    isRuqire: true,
                },
            ],
            title: 'policy.EditPolicy',
            updateInterface: api.updateStrategyPage.bind(api),
            formRules: {
                basePositionSize: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                deviationThreshold: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                initialBalance: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                maPeriod: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                maxTradeInterval: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                maxTradesPerDay: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                minTradeInterval: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                status: [{ required: true, message: 'common.PleaseSelect', trigger: ['change', 'blur'] }],
                stopLossPct: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                takeProfitPct: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                targetVolatility: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
                versionName: [{ required: true, message: 'common.PleaseEnter', trigger: ['change', 'blur'] }],
            },
        },
        infoButs: {
            show: false,
        },
        queryBtns: {
            handelSubmit: api.getStrategyPage.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 3500 },
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
