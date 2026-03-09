<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        width="600px"
        @cancel="handelClose"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-spin :spinning="spinning">
            <a-form ref="formRef" class="form-list" :label-col="{ span: 6 }" :rules="formRules" :model="formState">
                <template v-if="props.visible">
                    <a-form-item name="range" label="范围">
                        <a-select v-model:value="formState.range" size="small" placeholder="请选择" :disabled="type === 'edit'">
                            <a-select-option :value="1">全局</a-select-option>
                            <!-- <a-select-option :value="2" :disabled="true">用户</a-select-option> -->
                        </a-select>
                    </a-form-item>

                    <a-form-item name="chainId" label="链" v-if="type">
                        <SChain v-model="formState.chainId" :pure="true" :status="1" :disabled="type === 'edit'" />
                    </a-form-item>
                    <a-form-item v-if="formState.chainId && type" name="coinId" label="币种">
                        <SCoin
                            v-model="formState.coinId"
                            :pure="true"
                            @handelSelect="handelSelect"
                            :status="1"
                            :chain-id="formState.chainId"
                            :disabled="type === 'edit'"
                        />
                    </a-form-item>
                    <a-form-item name="singleMin" label="每笔最小限额" v-if="formState.coinId && formState.chainId">
                        <a-input-number v-model:value="formState.singleMin" size="small" placeholder="每笔最小限额" :min="0" />
                        <div class="fee-cost">
                            <div class="fee-cost-item">
                                <span>钱包最小提币金额 </span>
                                <span>{{ coinInfo.withdrawMin || 0 }} {{ coinName || 'USDT' }}</span>
                            </div>
                            <div class="fee-cost-item last-cost-item">
                                <span>平台实得手续费 </span>
                                <span>{{ coinInfo.platformFee || 0 }} {{ coinName || 'USDT' }}</span>
                            </div>
                        </div>
                    </a-form-item>

                    <a-form-item v-if="formState.range === 2" name="accountId" label="用户UID">
                        <a-input v-model:value="formState.accountId" size="small" placeholder="用户UID" :disabled="type === 'edit'" />
                    </a-form-item>
                    <a-form-item name="hour" label="每小时最大限额">
                        <a-input-number v-model:value="formState.hour" size="small" placeholder="每小时最大限额" :min="0" />
                    </a-form-item>
                    <a-form-item name="day" label="每天最大限额">
                        <a-input-number v-model:value="formState.day" size="small" placeholder="每天最大限额" :min="0" />
                    </a-form-item>

                    <a-form-item name="state" label="状态">
                        <a-select v-model:value="formState.state" size="small" placeholder="请选择">
                            <a-select-option :value="1">启用</a-select-option>
                            <a-select-option :value="2">禁用</a-select-option>
                        </a-select>
                    </a-form-item>
                </template>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';
import oldapi from '@/api/asset/index';
import api from '@/newApi/digitAsset/withdrawalLimit';
import { RuleObject } from 'ant-design-vue/lib/form';
import coinApi from '@/newApi/digitAsset/coin/index';

const FormParams = {
    accountId: '', // 用户ID
    coinId: '', // 币id
    chainId: '', // 链id
    day: '', // 每天最大限额
    hour: '', // 每笔最大限额
    id: null, // id
    range: null, // 1、全局 2、用户
    singleMax: '', // 每笔最大限额
    singleMin: '', // 每笔最小限额
    state: null, // 状态：状态：1=启用，2=禁用
};

const emit = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<PromiseReturnType<typeof api.getWithdrawList>['list'][0]>,
        default: () => Object.create(null),
    },
});
const formState = reactive({ ...FormParams });
const singleMinvalidator = (rule: RuleObject, value: number) => {
    if (!formState.coinId) {
        formRef.value.validateFields(['coinId']);
        return Promise.reject('');
    }
    if (!formState.chainId) {
        formRef.value.validateFields(['chainId']);
        return Promise.reject('');
    }
    if (value <= 0) return Promise.reject('不能小于等于0');
    if (!value) return Promise.reject('请输入每笔最小限额');

    const totalNumber = Number(coinInfo.value.withdrawMin) + Number(coinInfo.value.platformFee);

    if (value < totalNumber) {
        return Promise.reject('最小提币金额>=钱包最小提币金额+平台实得手续费');
    }

    return Promise.resolve();
};
const coinName = ref('');
const handelSelect = (item: PromiseReturnType<typeof coinApi.getSymbolSelect>[0]) => {
    console.log(item);

    coinName.value = item.label;
    coinInfo.value.platformFee = item.extend.platformFee;
    coinInfo.value.withdrawMin = item.extend.withdrawMin;
};

//@ts-ignore
const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    accountId: [{ required: true, trigger: 'blur', message: '请输入' }],
    coinId: [{ required: true, trigger: 'blur', message: '请选择币种' }],
    chainId: [{ required: true, trigger: 'blur', message: '请选择链' }],
    day: [{ required: true, trigger: 'blur', message: '请输入' }],
    hour: [{ required: true, trigger: 'blur', message: '请输入' }],
    range: [{ required: true, trigger: 'blur', message: '请输入' }],
    singleMin: [{ required: true, trigger: 'blur', validator: singleMinvalidator }],
    state: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}提币额度配置${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);

const spinning = ref(false);

watch(
    () => formState.chainId,
    (val, oldval) => {
        if (val !== oldval && !isEditFirst.value) {
            formState.coinId = '';
        } else {
            isEditFirst.value = false;
        }
    }
);
const isEditFirst = ref(false);
const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    const isApi = props.type === 'add' ? 'addWithdrawLimit' : 'updateWithdrawLimit';

    return api[isApi](
        // @ts-ignore
        props.type === 'add' ? { ...formState, accountId: formState.range === 1 ? '' : formState.accountId } : { ...formState }
    )
        .then(() => {
            emit('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};
const coinInfo = ref({
    withdrawMin: 0,
    platformFee: 0,
});
const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    // formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => handelSuccess()));
    await formRef.value.validate();
    handleAddOrUpdate()?.then(() => handelSuccess());
};

watch(
    () => props.visible,
    (n, o) => {
        // 用于填充modal数据
        if (n !== o && n) {
            if (props.type == 'edit') {
                isEditFirst.value = true;
                coinName.value = props.activeData!.symbol;
            }
            Object.entries(FormParams).forEach(([key]: any) => {
                // @ts-ignore 回填填充formState数据
                formState[key] = props.type === 'add' ? undefined : props.activeData[key];
            });
        }
    }
);

const handelSuccess = () => {
    handelClose();
    emit('onSuccess');
};
const handelClose = () => {
    clearcoinInfo();
    emit('onClose');
};
const clearcoinInfo = () => {
    coinInfo.value.withdrawMin = 0;
    coinInfo.value.platformFee = 0;
    formRef.value.resetFields();
    Object.keys(FormParams).forEach((key) => {
        // @ts-ignore
        formState[key] = FormParams[key];
    });
};
</script>
<style scoped lang="scss">
.ant-form-item {
    margin-bottom: 20px !important;
}

.fee-cost {
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between;

    .fee-cost-item {
        font-size: 12px;
        color: #b4b4b5;

        &.last-cost-item {
            margin-right: 0px;
        }
    }
}
</style>
