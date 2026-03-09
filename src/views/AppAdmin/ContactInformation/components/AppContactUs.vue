<template>
    <a-modal :open="visible" width="650px" :mask-closable="false" :footer="null" @ok="handleOk" @cancel="handelCancel">
        <template #title>
            <div class="modal-title">{{ title }}</div>
        </template>
        <a-spin :spinning="spinning" tip="Loading..." :delay="200">
            <a-form ref="form" :model="formState" :rules="formRules" label-align="left" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="语言" name="languageSymbol">
                    <a-select
                        ref="select"
                        v-model:value="formState.languageSymbol"
                        placeholder="请选择语言"
                        class="user-select"
                        @change="handleChangeLanguage"
                    >
                        <a-select-option v-for="item in languageList" :key="item.language" :value="item.language">{{ item.value }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="联系方式" name="contactInformation">
                    <a-input v-model:value="formState.contactInformation" placeholder="请输入联系方式" />
                </a-form-item>
                <a-form-item label="联系地址" name="contactAddress">
                    <a-input v-model:value="formState.contactAddress" placeholder="请输入联系地址" />
                </a-form-item>
                <a-form-item label="是否显示地址" name="show">
                    <a-radio-group v-model:value="formState.show">
                        <a-radio :value="0">否</a-radio>
                        <a-radio :value="1">是</a-radio>
                    </a-radio-group>
                </a-form-item>
                <div>
                    <a-form-item label="展示顺序" name="sort">
                        <a-select ref="select" v-model:value="formState.sort" placeholder="请选择展示顺序">
                            <a-select-option v-for="item in sortList" :key="item" :value="item">{{ item }} </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>

                <a-form-item label="状态" name="state">
                    <a-radio-group v-model:value="formState.state">
                        <a-radio :value="0">禁用</a-radio>
                        <a-radio :value="1">启用</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
            <div class="btn-box">
                <div class="btn" @click="handelCancel">取消</div>
                <div class="btn send-card-btn" @click="handleOk">确定</div>
            </div>
        </a-spin>
    </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref, watch, withDefaults } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import api from '@/api/appAdmin/index';
import type { languageType, AppAddContactlist, AppContactlistType } from '@/api/appAdmin/types.d.ts';
import { validate } from '@babel/types';

const props = withDefaults(
    defineProps<{
        visible: boolean;
        type: number;
        languageList: languageType[];
        fromTableData: AppContactlistType | {};
    }>(),
    {
        type: 1,
        visible: false,
        languageList: () => [],
        fromTableData: () => ({}),
    }
);
watch(
    () => props.visible,
    (val) => {
        if (val && props.type > 1) {
            const type = ['languageSymbol', 'sort'];
            Object.keys(formState.value).forEach((key) => {
                //@ts-ignore
                formState.value[key] = props.fromTableData[key];
                if (props.type == 3 && type.includes(key)) {
                    //@ts-ignore
                    formState.value[key] = '';
                }
                key == 'languageSymbol' && handleChangeLanguage(false);
            });
        }
    }
);

const form = ref<FormInstance>();
const spinning = ref(false);
const formState = ref<AppAddContactlist>({
    contactAddress: '',
    contactInformation: '',
    id: '',
    language: undefined,
    languageSymbol: undefined,
    operator: '',
    show: 0,
    sort: undefined,
    state: 0,
});
const title = computed(() => {
    const names = ['新增联系方式', '编辑联系方式', '新增联系方式'];
    return names[props.type - 1];
});

const sortList = ref<number[]>([]);
const formStateCopy = ref({
    ...formState.value,
});
const validateSort = (rule: any, value: any, callback: any) => {
    console.log(formState.value.languageSymbol);

    if (!formState.value.languageSymbol) {
        return Promise.reject('请先选择语言');
    }
    if (!formState.value.sort) {
        return Promise.reject('请选择展示顺序');
    }
    return Promise.resolve();
};
const formRules = {
    state: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    languageSymbol: [{ required: true, message: '请选择状态语言', trigger: 'blur' }],
    contactInformation: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
    contactAddress: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
    show: [{ required: true, message: '请选择是否显示地址', trigger: 'blur' }],
    sort: [{ required: true, validator: validateSort, trigger: 'blur' }],
};

const emit = defineEmits(['update:visible', 'handleOk']);
const handelCancel = () => {
    emit('update:visible', false);
    sortList.value = [];
    form.value?.resetFields();
    formState.value = {
        ...formStateCopy.value,
    };
};
const handleOk = async () => {
    await form.value?.validate();
    spinning.value = true;
    const fetchApis = ['fetchAppContactAdd', 'fetchAppContactUpdate', 'fetchAppContactAdd'][props.type - 1];
    //@ts-ignore
    api[fetchApis](formState.value)
        .then(() => {
            const lang = formState.value.languageSymbol as string;
            message.success(`${title.value}成功`);
            handelCancel();
            emit('handleOk', lang);
        })
        .finally(() => {
            spinning.value = false;
        });
};
const getSrotList = () => {
    api.fetchAppContactSort({
        languageSymbol: formState.value.languageSymbol as string,
        type: props.type == 2 ? false : true,
    }).then((res) => {
        sortList.value = res;
    });
};
const handleChangeLanguage = (isRest: boolean = true) => {
    if (!formState.value.languageSymbol) return;
    const item = props.languageList.find((item) => item.language === formState.value.languageSymbol) as languageType;
    formState.value.language = item.value;
    getSrotList();
    const srot = formState.value.sort;
    formState.value.sort = isRest ? undefined : srot;
    form.value?.resetFields(['sort']);
};
</script>

<style lang="scss" scoped>
.modal-title {
    text-align: center;
    font-weight: normal;
}

.ant-form {
    .ant-form-item {
        :deep(.ant-form-item-label) {
            label {
                color: #000 !important;
            }
        }

        .address {
            width: 240px;
        }
    }
}

.btn-box {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 35px;

    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 7px 40px;

        background-color: #ababab;
        border-radius: 4px;
        color: #fff;

        &.send-card-btn {
            background-color: #2986ff;
        }

        cursor: pointer;

        &:nth-child(1) {
            margin-right: 60px;
        }
    }
}

.user-flex-center {
    display: flex;
    justify-content: center;

    :deep(.ant-form-item-control) {
        flex: none;
    }
}

.desc {
    text-align: center;
    font-size: 12px;
    color: #999;
}

.info {
    font-size: 16px;
    color: #000;
    margin-bottom: 20px;
}

.content-center {
    display: flex;
    justify-content: space-around;
}
</style>
