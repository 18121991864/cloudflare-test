<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item v-if="type !== 'add'" :label="`${labelitle}结果`" name="state">
                <a-radio-group v-model:value="formState.state" name="state">
                    <a-radio :value="1">通过</a-radio>
                    <a-radio :value="2">拒绝</a-radio>
                </a-radio-group>
            </a-form-item>
            <template v-if="formState.state === 1">
                <a-form-item label="提币渠道" name="walletType" v-if="type === 'edit' && activeData?.finalCheckState">
                    <a-radio-group v-model:value="formState.walletType" @change="onChangeWalletType">
                        <a-radio :value="1">UE</a-radio>
                        <a-radio :value="2">SafeHeron</a-radio>
                    </a-radio-group>
                </a-form-item>
                <template v-if="activeData?.finalCheckState && formState.walletType == 2 && type === 'edit'">
                    <a-form-item label="提币钱包" name="walletSystemId">
                        <a-select size="small" v-model:value="formState.walletSystemId" placeholder="请选择">
                            <a-select-option :value="item.id" v-for="item in walletSystemList" :key="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="手续费等级" name="feeLevel">
                        <a-radio-group v-model:value="formState.feeLevel">
                            <a-radio :value="1">低</a-radio>
                            <a-radio :value="2">中</a-radio>
                            <a-radio :value="3">高</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </template>
            </template>
            <a-form-item label="登录密码" name="loginPassword">
                <a-input v-model:value="formState.loginPassword" type="password" size="small" placeholder="请输入" @pressEnter="handleSearch" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import systemAPI from '@/api/wallet/system';
import api from '@/api/asset/index';

const FormParams = {
    // tradePwd: '',
    id: '',
    loginPassword: '',
    state: '',
    walletType: null,
    feeLevel: null,
    walletSystemId: null,
};
const walletSystemList = ref<PromiseReturnType<typeof systemAPI.addSystemChooseList>>([]);
const emit = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: { type: Object, default: () => Object.create(null) },
});

const formState = reactive({ ...FormParams });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    loginPassword: [{ required: true, trigger: 'blur', message: '请输入密码' }],
    state: [{ required: true, trigger: 'change', message: '请选择' }],
    walletType: [{ required: true, trigger: 'change', message: '请选择提币渠道' }],
    feeLevel: [{ required: true, trigger: 'change', message: '请选择交易的手续费等级' }],
    walletSystemId: [{ required: true, trigger: 'change', message: '请选择提币钱包' }],
}));

const title = computed(() => {
    const name = props.activeData?.checkType === 1 ? '初审' : '复审';
    return props.type === 'edit' ? `${name}提币` : '重新提币';
});
const labelitle = computed(() => (props.activeData?.checkType === 1 ? '初审' : '复审'));
const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    console.log(57, props);
    if (props.type === 'add') {
        // @ts-ignore
        return api
            .fetchTransactionCheckTransfer({ ...formState })
            .then(() => {
                emit('onClose');
                emit('onSuccess');
                message.success('操作成功');
            })
            .finally(() => {
                isSubmitLoading.value = false;
            });
    }
    return api
        .fetchTransactionAfreshTransfer({ ...formState })
        .then(() => {
            emit('onClose');
            emit('onSuccess');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
};

onMounted(() => {
    Object.entries(FormParams).forEach(([key]: any) => {
        console.log(props.activeData, props.type);
        if (key !== 'state') {
            // @ts-ignore 回填填充formState数据
            formState[key] = props.activeData[key];
        }
    });
});
const onChangeWalletType = () => {
    formState.walletSystemId = null;
    systemAPI
        .addSystemChooseList({
            walletType: formState.walletType as any as number,
            type: 2,
        })
        .then((res) => {
            walletSystemList.value = res;
        });
};
</script>
