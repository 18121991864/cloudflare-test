<template>
    <a-modal :open="state.visible" :title="getTitle" :width="600" :confirm-loading="saveLoading" @cancel="close" @ok="handleOk">
        <a-form name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-form-item label="UID" v-bind="validateInfos.accountId" required>
                <a-input v-model:value="formState.accountId" placeholder="请输入" />
                <div v-if="userResult">注册邮箱：{{ userResult }}</div>
            </a-form-item>
            <a-form-item label="业务类型" v-bind="validateInfos.ditchCardIds">
                <a-select
                    :filter-option="filterOption"
                    v-model:value="formState.ditchCardIds"
                    placeholder="请选择"
                    :options="busList"
                    mode="multiple"
                />
            </a-form-item>
            <a-form-item label="赦免认证等级" v-bind="validateInfos.kycLevelRequired">
                <a-select v-model:value="formState.kycLevelRequired" placeholder="请选择" :options="levelOptions" />
            </a-form-item>
            <a-form-item label="模拟认证等级" v-bind="validateInfos.kycLevelMock">
                <a-select v-model:value="formState.kycLevelMock" placeholder="请选择" :options="levelOptions" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { cloneDeep, pick, trim } from 'lodash-es';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { Form } from 'ant-design-vue';
import api from '@/api/whiteList/index';
import { commonLevelEnumMap } from '@/enums/whitelistEnum';
import { transMapBySelectOptions } from '@/utils/component';

interface IFormState {
    accountId: string;
    ditchCardIds: string;
    kycLevelRequired: string;
    kycLevelMock: string;
}

interface IState {
    visible: boolean;
    source?: Record<string, any>;
}

const levelOptions = transMapBySelectOptions(commonLevelEnumMap);

const emit = defineEmits(['sucess']);
const uidRes = new Map();
const uidNotfound = new Set();

const userResult = ref();
const busList = ref();
const saveLoading = ref(false);
let controller: AbortController;

const state = reactive<IState>({
    visible: false,
    source: undefined,
});
const formState = reactive<Partial<IFormState>>({
    accountId: undefined,
    ditchCardIds: undefined,
    kycLevelRequired: undefined,
    kycLevelMock: undefined,
});

async function asyncValidator(_: any, value?: string) {
    if (userResult.value) userResult.value = undefined;
    if (!value) {
        return Promise.reject(new Error('请输入UID'));
    }
    if (!/^\d{19}$/.test(value)) {
        return Promise.reject(new Error('请正确输入UID'));
    }
    if (uidNotfound.has(value)) {
        return Promise.reject(new Error('该用户未注册'));
    }

    if (uidRes.has(value)) {
        userResult.value = uidRes.get(value);
        return Promise.resolve();
    }
    if (controller) controller.abort();

    controller = new AbortController();

    const result = await api.fetchUidById(value, controller.signal);

    if (result) {
        uidRes.set(value, result);
        userResult.value = result;
    } else {
        uidNotfound.add(value);
        console.log(uidNotfound);
        return Promise.reject(new Error('该用户未注册'));
    }

    return Promise.resolve();
}

const formRules = {
    accountId: [{ asyncValidator }],
    ditchCardIds: [{ required: true, message: '请选择业务类型' }],
    kycLevelRequired: [{ required: true, message: '请选择赦免认证等级' }],
    kycLevelMock: [{ required: true, message: '请选择模拟认证等级' }],
};

const filterOption = (input: string, option: any) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

async function queryBusList() {
    busList.value = await api.fetchWhitelistBusList().then((result) => result.map(({ id, name }) => ({ label: name, value: id })));
}

const { validate, validateInfos, resetFields } = Form.useForm(formState, formRules);

const getTitle = computed(() => (state.source ? '编辑白名单用户' : '新增白名单用户'));

function open(source?: Record<string, any>) {
    const result: Partial<IState> = { visible: true };

    if (source) {
        result.source = source;
        const _formState = pick(source, Object.keys(formState));

        _formState.ditchCardIds = _formState.ditchCardIds ? _formState.ditchCardIds.split(',').map(trim) : [];

        Object.assign(formState, _formState);
    }

    Object.assign(state, result);
}

function close() {
    userResult.value = undefined;
    Object.assign(state, {
        visible: false,
        source: undefined,
    });
    resetFields();
}

const handelSubmit = async (values: Record<string, any>) => {
    const _values = cloneDeep(values);
    _values.ditchCardIds = _values.ditchCardIds.join(',');
    _values.type = 1;
    if (state.source) {
        _values.id = state.source.id;
        await api.fetchUpdateWhitelist(_values);
    } else {
        await api.fetchAddWhitelist(_values);
    }
    emit('sucess');
};

async function handleOk() {
    const values = await validate();
    await handelSubmit(values);
}

onMounted(queryBusList);

watch(
    () => state.visible,
    (v) => {
        if (v) {
            queryBusList();
        }
    }
);

defineExpose({ close, open });
</script>

<style scoped></style>
