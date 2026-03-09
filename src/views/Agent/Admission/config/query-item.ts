import { ConstructionFrom } from '@/config-overall/interface/index';

import api from '@/api/newAgent/index';
import configs from './table-config';
import { fetchGetOrderInfoList, getTypeList } from './options';
import updateData from './update-data';
import auditData from './audit-data';
import useUpdateData from '@/store/config-overall/update-data';
const updateDataStore = useUpdateData();
const { headers } = configs();
const { fieldNames, formRules, formReset, formState, countryList, agentType } = updateData();
const { auditReset, auditNames, auditRules, auditState } = auditData();

const queryConfig = ref<ConstructionFrom>({
    construction: [
        {
            label: '代理商',
            value: 'name',
            placeholder: '请输入',
            type: 'input',
        },
    ],
    constrClassName: 'wrap-box',
    btnShow: true,
    btns: {
        addBtns: {
            show: true,
            title: '新增代理商',
            titleName: '新增代理商',
            fieldNames,
            formRules,
            formReset,
            formState,
            updateInterface: api.fetchAddAgentApply.bind(api),
            buttonPermissions: 'admission-add',
        },
        editBtns: {
            show: false,
        },
        queryBtns: {
            handelSubmit: api.fetchgetPageList.bind(api),
        },
        auditBtns: {
            titleName: '审核',
            fieldNames: auditNames,
            formRules: auditRules,
            formReset: auditReset,
            formState: auditState,
            updateInterface: api.fetchSetAudit.bind(api),
        },
    },

    tabelConfig: {
        headers,
        scroll: { x: 2000 },
        headersCustom: ['statusName', 'phone'],
        imgCustom: ['businessLicense'],
        align: 'center',
    },
    formState: {
        cryptoName: null,
        type: null,
    },
    allSelectAll: {
        show: true,
        value: null,
    },
});
getTypeList({ countryList, agentType });
watch(
    () => updateDataStore.open,
    (open) => {
        if (!open) return false;
        const add = queryConfig.value.btns.addBtns;
        add?.fieldNames?.forEach((item) => {
            if (item.value == 'category') {
                fetchGetOrderInfoList().then((res) => {
                    item.selectOptions = res;
                });
            }
        });
    }
);
export default queryConfig as Ref<ConstructionFrom>;
