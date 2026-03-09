<template>
    <a-modal :open="visible" :mask-closable="false" @ok="handleOk" @cancel="handelCancel">
        <template #title>{{ title }}</template>
        <a-form ref="formRef" :model="formState" name="form" autocomplete="off" :rules="fromRules">
            <a-form-item label="生效范围" name="scope">
                <a-select v-model:value="formState.scope" placeholder="请选择生效范围">
                    <a-select-option v-for="item in pinRangeSelect" :key="item.key" :value="item.key">{{ item.value }} </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="功能简介" name="intros">
                <a-input v-model:value="formState.intros" placeholder="请输入功能简介" />
            </a-form-item>
            <a-form-item label="功能code" name="featureCodes">
                <a-select
                    v-model:value="formState.featureCodes"
                    mode="multiple"
                    placeholder="请输入功能名称进行筛选"
                    :options="options"
                    :max-tag-count="5"
                    :field-names="{
                        label: 'value',
                        value: 'key',
                    }"
                    @change="featureCodeItem"
                >
                    <template #maxTagPlaceholder="omittedValues">
                        <span style="color: red">+ {{ omittedValues.length }} ...</span>
                    </template>
                </a-select>
            </a-form-item>
            <a-form-item label="影响功能" name="influenceFunctions">
                <a-input v-model:value="formState.influenceFunctions" placeholder="请输入影响功能" />
            </a-form-item>
            <a-form-item label="效验时长" name="validDuration">
                <a-input v-model:value.number="formState.validDuration" placeholder="请输入效验时长" />
            </a-form-item>
            <a-form-item label="资金密码允许错误次数" name="errorCount">
                <a-input v-model:value.number="formState.errorCount" placeholder="请输入资金密码的错误次数" />
            </a-form-item>
            <a-form-item label="限制账号时长" name="restrictDuration">
                <a-input v-model:value.number="formState.restrictDuration" placeholder="请输入账号被锁定的时长" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message, Form } from 'ant-design-vue';
import type { AppMenuList, ContentType, AdvertisingSpaceList, PinCheckRuleData } from '@/api/appAdmin/types.d.ts';
import api from '@/api/appAdmin/index';
import type { Rule } from 'ant-design-vue/es/form';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    messageTyep: {
        type: Number,
        default: 1,
    },

    mItem: {
        type: Object,
        default: () => ({}),
    },
});
watch(
    () => props.messageTyep,
    (val) => {
        if (val == 2) {
            props.mItem.featureCodes = props.mItem.featureCodes.split(',');
            Object.keys(props.mItem).forEach((key) => {
                // @ts-ignore
                formState.value[key] = props.mItem[key];
            });
        }
    },
    {
        deep: true,
    }
);
const formRef = ref<FormInstance | null>(null);
const pinRangeSelect = ref(Object.create([]));
const options = ref(Object.create([]));
const formState = ref<PinCheckRuleData>({
    errorCount: '',
    featureCodes: [],
    influenceFunctions: '',
    intros: '',
    restrictDuration: '',
    scope: null,
    validDuration: '',
    id: null,
});
watch(
    () => props.visible,
    async (val) => {
        if (val) {
            pinRangeSelect.value = await api.fetchPinCheckRulePinRangeSelect();
            options.value = await api.fetchPinCheckRuleFCodeSelect();
        }
    }
);
const copyformState = ref(JSON.parse(JSON.stringify(formState.value)));
const validateNumber = (_rule: Rule, value: string) => {
    if (!value) return Promise.resolve();
    if (typeof value !== 'number') return Promise.reject('请输入数字');
    return Promise.resolve();
};
const fromRules = {
    influenceFunctions: [{ required: true, trigger: 'blur', message: '请输入影响功能' }],
    featureCodes: [{ required: true, trigger: 'blur', message: '请选择功能code' }],
    intros: [{ required: true, trigger: 'blur', message: '请输入功能简介' }],

    scope: [{ required: true, trigger: 'blur', message: '请选择生效范围' }],
    errorCount: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入资金密码允许错误次数',
        },
        { required: true, validator: validateNumber, trigger: 'blur' },
    ],
    validDuration: [
        { required: true, trigger: 'blur', message: '请输入校验时长' },
        { required: true, validator: validateNumber, trigger: 'blur' },
    ],
    restrictDuration: [
        { required: true, trigger: 'blur', message: '请输入限制账号时长' },
        { required: true, validator: validateNumber, trigger: 'blur' },
    ],
};

const title = computed(() => {
    return `${props.messageTyep == 1 ? '新增' : '编辑'}资金密码校验规则`;
});
const featureCodeItem = () => {
    const items = formState.value.featureCodes as Array<number>;
    const influenceFunctions = items.map((item) => {
        return options.value.find((option: { key: number; value: string }) => option.key == item).value;
    }) as Array<string>;
    formState.value.influenceFunctions = influenceFunctions.join(',');
};
const emit = defineEmits(['update:visible', 'handleOk']);
const handelCancel = () => {
    formRef.value?.resetFields();
    emit('update:visible', false);
};
const handleOk = async () => {
    await formRef.value?.validate();
    const item = formState.value;
    item.influenceFunctions = (item.influenceFunctions as string).split(',');

    item.errorCount = Number(item.errorCount);
    item.restrictDuration = Number(item.restrictDuration);
    item.validDuration = Number(item.validDuration);
    const fetch = ['fetchPinCheckRuleAdd', 'fetchPinCheckRuleEdit'][props.messageTyep - 1];
    // @ts-ignore
    await api[fetch](formState.value);
    message.success(`${title.value}成功`);
    handelCancel();
    formState.value = JSON.parse(JSON.stringify(copyformState.value));
    emit('handleOk');
};
</script>

<style lang="scss" scoped>
.user-select {
    width: 300px;
}

:deep(.ant-form-item-label) {
    min-width: 90px;
    text-align: left;
}

.user-dowload {
    width: 240px;
    margin-right: 10px;
}

.ant-input[disabled] {
    background-color: #f5f5f5;
}

.ant-select-disabled {
    :deep(.ant-select-selector) {
        background-color: #f5f5f5 !important;
    }
}

.icon-flex {
    display: flex;
}

.info-circle {
    margin-top: 10px;

    .info-icon {
        color: red;

        margin-right: 5px;
    }

    span {
        font-size: 12px;
    }
}
</style>
