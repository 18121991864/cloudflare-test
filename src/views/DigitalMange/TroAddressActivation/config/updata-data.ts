import { ButtonTypes } from '@/config-overall/interface/button';

import api from '@/api/tron/address';
import { UpdateConstructionItem, UpdateConstructionType } from '@/config-overall/interface/update';
import _ from 'lodash';
const fieldNames: UpdateConstructionItem[] = [
    { label: '当前出币地址', value: 'oldAddress', isForm: true, type: 'text', placeholder: '' },
    { label: 'TRX余额', value: 'balance', isForm: true, type: 'text', placeholder: '' },
    {
        label: '新的出币地址',
        value: 'walletSystemId',
        type: 'select',
        placeholder: '请选择',
        selectOptions: [],
    },
    { label: '新TRX余额', value: 'newBalance', isForm: true, type: 'text', placeholder: '' },
];
const deepfieldNames = _.cloneDeep(fieldNames);
const listAddress = ref<PromiseReturnType<typeof api.addressChooseList>>([]);
const updateConstruction = ref<UpdateConstructionType>({
    fieldNames,
    titleName: '设置出币地址',
    updateInterface: api.addIssueSet.bind(api),
    formState: {
        walletSystemId: null,
        newBalance: 0,
        fromAddress: '',
        balance: 0,
        oldAddress: '',
    },
    formRules: {
        walletSystemId: [{ required: true, message: '请选择出币地址', trigger: 'change' }],
    },
});
const fliterDiscountInfo = async (item?: { balance: string; fromAddress: string }) => {
    const fieldNames = _.cloneDeep(deepfieldNames);
    const data = fieldNames.find((item) => item.value === 'walletSystemId');
    const list = await api.addressChooseList();
    listAddress.value = list;
    list.forEach((item) => {
        data?.selectOptions?.push({
            label: item.address,
            value: item.walletSystemId,
        });
    });
    if (!item) {
        fieldNames.splice(0, 2);
        fieldNames.splice(1, 1);
        fieldNames.push({
            label: 'TRX余额',
            value: 'newBalance',
            isForm: true,
            type: 'text',
            placeholder: '',
        });
        data!.label = '设置出币地址';
    } else {
        console.log(item);

        updateConstruction.value.formState.balance = item.balance;
        updateConstruction.value.formState.oldAddress = item.fromAddress;
    }
    updateConstruction.value.fieldNames = fieldNames as any;

    return updateConstruction;
};

watch(
    () => updateConstruction.value.formState.walletSystemId,
    async (walletSystemId) => {
        if (!walletSystemId) return false;
        const data = listAddress.value.find((item) => item.walletSystemId === walletSystemId);
        updateConstruction.value.formState.fromAddress = data!.address;

        const money = await api.getIssueBlance({ address: data!.address });
        updateConstruction.value.formState.newBalance = money;
    }
);
export { updateConstruction, fliterDiscountInfo };
