import { rulesType, UpdateConstructionItem } from '@/config-overall/interface/update';
import { TypeList } from '@/interface/StateType';
import { formatValidator } from './update-validator';
export default () => {
    const formState = ref({
        globalCode: '+1',
    });
    const formReset = ref({});
    const countryList = ref<TypeList[] & { tel: string }[]>([]);
    const agentType = ref<TypeList[]>([]);
    const fieldNames: UpdateConstructionItem[] = [
        { label: '代理商', type: 'input', placeholder: '请输入代理商', value: 'name' },
        { label: '联系人', type: 'input', placeholder: '请输入联系人', value: 'contacts' },
        { label: '联系人邮箱', type: 'input', placeholder: '请输入联系人邮箱', value: 'email' },
        {
            label: '联系人手机',
            type: 'globalPhone',
            placeholder: '请输入联系人手机',
            value: 'phone',
            value1: 'globalCode',
            selectOptions: countryList.value,
            placeholder1: '请选择国际区号',
            selectAttribute: {
                showSearch: true,
                fieldNames: {
                    label: 'tel',
                    value: 'tel',
                },
                optionFilterProp: 'tel',
            },
        },
        { label: '公司名称', type: 'input', placeholder: '请输入公司名称', value: 'companyName' },
        {
            label: '代理商类别',
            type: 'select',
            placeholder: '请选择代理商类别',
            value: 'category',
            selectOptions: [],
        },
        // {
        //     label: '公司国家',
        //     type: 'select-options',
        //     placeholder: '请选择公司国家',
        //     value: 'country',
        //     selectOptions: countryList.value,
        //     selectAttribute: {
        //         showSearch: true,
        //         fieldNames: {
        //             label: 'label',
        //             value: 'value',
        //         },
        //         optionFilterProp: 'label',
        //     },
        // },
        { label: '公司地址', type: 'input', placeholder: '请输入公司地址', value: 'address' },
        // {
        //     label: '营业执照',
        //     type: 'upload-img',
        //     placeholder: '请上传营业执照',
        //     uploadOptions: {
        //         isdeleteBtn: false,
        //         maxFileSize: 5,
        //     },
        //     value: 'businessLicense',
        //     value1: 'businessLicenSesuffixUrl',
        // },
    ];

    const formRules: Record<string, rulesType[]> = {
        name: [{ required: true, message: '请输入代理商', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        email: [{ required: true, validator: formatValidator(2), trigger: 'blur' }],
        phone: [{ required: true, validator: formatValidator(1), trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择代理商类别', trigger: 'blur' }],
        // country: [{ required: true, message: '请输入公司国家', trigger: 'blur' }],
        address: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
        // businessLicense: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
    };

    return {
        fieldNames,
        formRules,
        formState,
        formReset,
        countryList,
        agentType,
    };
};
