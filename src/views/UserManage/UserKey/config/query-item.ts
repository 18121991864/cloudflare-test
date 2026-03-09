import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/newApi/user';
import configs from './table-config';
import i18n from '@/setup/i18n-setup';

const t = i18n.global.t;

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
            label: t('common.Balance') + '>=',
            value: 'balance',
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
            label: 'user.AuditStatus',
            value: 'auditStatus',
            placeholder: 'common.PleaseSelect',
            type: 'select',
            options: [
                { label: 'common.AuditStatusPending', value: 1 },
                { label: 'common.AuditStatusApproved', value: 2 },
                { label: 'common.AuditStatusRejected', value: 3 },
            ],
        },
        {
            label: 'common.CreateTime',
            value: 'time',
            placeholder: 'common.PleaseEnter',
            type: 'date',
            timeFormat: 'timeStamp',
            timeValue: ['startOrderTime', 'endOrderTime'],
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
            handelSubmit: api.getAccountKeyList.bind(api),
        },
        exportBtns: {
            show: true,
            buttonPermissions: 'export',
            handExport: api.keyListExport.bind(api),
            exportFileTitle: 'common.UserKey',
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 3000 },
        headersCustom: ['status', 'errorMsg'],
    },
    formState: {},
    allSelectAll: {
        show: true,
        value: null,
    },
});

export default queryConfig;
