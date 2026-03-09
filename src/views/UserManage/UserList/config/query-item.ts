import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/user';
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
            label: 'user.UserID',
            value: 'accountId',
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
            label: 'common.Status',
            value: 'status',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [
                { label: 'common.Enable', value: 1 },
                { label: 'common.Disable', value: 2 },
            ],
        },
        {
            label: 'user.Category',
            value: 'category',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [
                { label: 'user.OrdinaryUser', value: 1 },
                { label: 'user.PayingUser', value: 2 },
            ],
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
            handelSubmit: api.getAccountList.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 1000 },
        headersCustom: ['status'],
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
