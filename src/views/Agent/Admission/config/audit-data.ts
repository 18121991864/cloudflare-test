import { rulesType, UpdateConstructionItem } from '@/config-overall/interface/update';

export default () => {
    const formState = ref({
        status: 2,
    });
    const formReset = ref({});
    const fieldNames: UpdateConstructionItem[] = [
        {
            label: '审核状态',
            type: 'radio',
            placeholder: '请输入联系人',
            value: 'status',
            selectOptions: [
                { label: '通过', value: 1 },
                { label: '拒绝', value: 2 },
            ],
        },
        { label: '审核意见', type: 'textarea', placeholder: '请输入审核意见', value: 'auditRemark' },
    ];
    const formRules: Record<string, rulesType[]> = {
        auditRemark: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
        status: [{ required: true, message: '审核状态', trigger: 'blur' }],
    };
    return {
        auditState: formState,
        auditReset: formReset,
        auditNames: fieldNames,
        auditRules: formRules,
    };
};
