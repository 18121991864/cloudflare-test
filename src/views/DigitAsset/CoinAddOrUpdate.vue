<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        :width="900"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-spin :spinning="spinning">
            <a-form ref="formRef" layout="horizontal" class="form-list" hide-required-mark :rules="formRules" :model="formState">
                <div class="flex-wrap-wrap">
                    <div class="mr-20 width-400">
                        <div class="flex" style="justify-content: space-between">
                            <a-form-item class="mr-20 width-190" name="name" label="币种">
                                <a-input v-model:value="formState.name" disabled size="small" />
                            </a-form-item>
                            <a-form-item class="mr-20 width-190" name="chainTag" label="区块链">
                                <a-input v-model:value="formState.chainTag" disabled size="small" />
                            </a-form-item>
                        </div>
                    </div>
                    <a-form-item class="mr-20 width-400" name="decimals" label="币种精度">
                        <a-input v-model:value="formState.decimals" disabled size="small" />
                    </a-form-item>

                    <a-form-item class="mr-20 width-600" name="inAccountAmount" label="平台最小充币金额">
                        <a-input-number v-model:value="formState.inAccountAmount" size="small" :min="0" style="width: 300px" placeholder="请输入" />
                        <div class="fee-cost">
                            <div class="fee-cost-item">
                                <span>钱包最小上账金额 </span>
                                <span>{{ coinInfo?.inMinAmount || 0 }} {{ coinInfo.symbol }}</span>
                            </div>
                            <div class="fee-cost-item last-cost-item">
                                <span>钱包最小提币金额 </span>
                                <span>{{ coinInfo?.minOutAmount || 0 }} {{ coinInfo.symbol }}</span>
                            </div>
                        </div>
                    </a-form-item>

                    <a-form-item class="mr-20 width-600" name="totalFee" label="平台提币手续费">
                        <a-input v-model:value="formState.totalFee" size="small" style="width: 300px" :min="0" />
                        <div class="fee-cost">
                            <div class="fee-cost-item">
                                <span>钱包提币手续费 </span>
                                <span>{{ formState.walletFee || 0 }} {{ coinInfo.symbol }}</span>
                            </div>
                            <div class="fee-cost-item last-cost-item">
                                <span>平台实得手续费 </span>
                                <span>{{ actuallyFee || 0 }} {{ coinInfo.symbol }}</span>
                            </div>
                        </div>
                    </a-form-item>
                    <a-form-item class="mr-20 width-400" name="internalOutMinAmount" label="内部提币最小限额">
                        <a-input size="small" :min="0" v-model:value="formState.internalOutMinAmount" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item class="mr-20 width-400" name="internalOutMaxAmount" label="内部提币最大限额">
                        <a-input size="small" :min="0" v-model:value="formState.internalOutMaxAmount" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="zhCn" label="充值文案(中文简体)">
                        <a-textarea v-model:value="formState.zhCn" placeholder="充值文案(中文简体)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="zhTw" label="充值文案(中文繁体)">
                        <a-textarea v-model:value="formState.zhTw" placeholder="充值文案(中文繁体)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="enUs" label="充值文案(英文)">
                        <a-textarea v-model:value="formState.enUs" placeholder="充值文案(英文)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="ruRu" label="充值文案(俄文)">
                        <a-textarea v-model:value="formState.ruRu" placeholder="充值文案(俄文)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="arAe" label="充值文案(阿拉伯)">
                        <a-textarea v-model:value="formState.arAe" placeholder="充值文案(阿拉伯)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="status" label="链开关">
                        <a-radio-group v-model:value="formState.status" name="radioGroup">
                            <a-radio :value="1">启用币种链</a-radio>
                            <a-radio :value="0">禁用币种链</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="inStatus" label="链充币状态">
                        <a-radio-group v-model:value="formState.inStatus" name="radioGroup">
                            <a-radio :value="1">启用链充币</a-radio>
                            <a-radio :value="0">禁用链充币</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item class="mr-20 width-820" name="outStatus" label="链提币状态">
                        <a-radio-group v-model:value="formState.outStatus" name="radioGroup">
                            <a-radio :value="1">启用链提币</a-radio>
                            <a-radio :value="0">禁用链提币</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </div>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';
import { filterXss } from '@/utils/common';

import api from '@/api/asset/index';

const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<PromiseReturnType<typeof api.fetchCoinInfo>>,
        default: () => Object.create(null),
    },
});
/***
 *
 * 输入限制
     BTC：0.0000001-100000
     ETH：0.0000001-100000
     USDT：0.0001-100000000
 *
 *
 */
const userSymbolList = [
    { id: 'BTC', min: '0.00000001', max: '10000' },
    { id: 'ETH', min: '0.00000001', max: '100000' },
    { id: 'USDT', min: '0.0001', max: '100000000' },
    { id: 'USDC', min: '0.0001', max: '100000000' },
];
const emit = defineEmits(['onClose', 'onSuccess']);
const userSymbol = ref('');
const formState = ref<any>({
    internalOutMinAmount: undefined,
    internalOutMaxAmount: undefined,
});
const totalFeeValidator = (rule: any, value: any, callback: any) => {
    if (!value && value !== 0) return Promise.reject('请输入平台提币手续费');

    if (value < formState.value.walletFee) {
        return Promise.reject('平台提币手续费必须>=钱包提币手续费');
    }
    return Promise.resolve();
};
const inAccountAmountValidator = (rule: any, value: any, callback: any) => {
    if (!value && value !== 0) return Promise.reject('请输入平台最小充币金额');
    if (value < formState.value.inMinAmount) {
        return Promise.reject('最小充币金额必须>=钱包最小上账金额');
    }
    return Promise.resolve();
};
const getMinMax = () => {
    const item = userSymbolList.find((item) => item.id === userSymbol.value);
    if (!item) {
        return {
            min: '0.00000001',
            max: '100000000',
        };
    }
    return {
        min: item.min,
        max: item.max,
    };
};
const internalOutMinAmountValidator = (rule: any) => {
    const value = formState.value[rule.field];
    if (!value && value !== 0) return Promise.reject('请输入内部提币最小限额');
    if (value == 0) return Promise.reject('内部提币最小限额不能为0');
    const { min } = getMinMax();

    if (Number(value) < Number(min)) {
        return Promise.reject(`内部提币最小限额必须>=${userSymbol.value}最小限额:${min}`);
    }

    const minPrecision = min.split('.')[1]?.length || 0; // 最大精度
    const regex = new RegExp(`^\\d+(\\.\\d{1,${minPrecision}})?$`);
    if (!regex.test(String(value))) {
        return Promise.reject(`小数位不能超过${minPrecision}位`);
    }

    const internalOutMaxAmount = formState.value.internalOutMaxAmount;
    if (internalOutMaxAmount && Number(value) > Number(internalOutMaxAmount)) {
        return Promise.reject(`内部提币最小限额必须<内部提币最大限额`);
    }
    return Promise.resolve();
};
const internalOutMaxAmountValidator = (rule: any) => {
    const value = formState.value[rule.field];
    if (!value && value !== 0) return Promise.reject('请输入内部提币最大限额');
    if (value == 0) return Promise.reject('内部提币最大限额不能为0');
    const { max, min } = getMinMax();
    const minPrecision = min.split('.')[1]?.length || 0; // 最大精度
    const regex = new RegExp(`^\\d+(\\.\\d{1,${minPrecision}})?$`);
    if (!regex.test(String(value))) {
        return Promise.reject(`小数位不能超过${minPrecision}位`);
    }
    if (Number(value) > Number(max)) {
        return Promise.reject(`内部提币最大限额必须<=${userSymbol.value}最大限额:${max}`);
    }
    const internalOutMinAmount = formState.value.internalOutMinAmount;
    if (internalOutMinAmount && Number(value) < Number(internalOutMinAmount)) {
        return Promise.reject(`内部提币最大限额必须>内部提币最小限额`);
    }
    return Promise.resolve();
};
const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    totalFee: [{ required: true, validator: totalFeeValidator, trigger: 'blur' }],
    inAccountAmount: [{ required: true, validator: inAccountAmountValidator, trigger: 'blur' }],
    internalOutMinAmount: [{ required: true, validator: internalOutMinAmountValidator, trigger: 'blur' }],
    internalOutMaxAmount: [{ required: true, validator: internalOutMaxAmountValidator, trigger: 'blur' }],
}));

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}币种${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);
const actuallyFee = computed(() => {
    if (!formState.value.totalFee) return 0;

    if (formState.value.totalFee < formState.value.walletFee) {
        formRef.value.validateFields(['totalFee']);
        return 0;
    }
    if (formState.value.totalFee > formState.value.walletFee) {
        const fee = Number(1 + '0'.repeat(formState.value.decimals));
        const num = ((formState.value.totalFee * fee - formState.value.walletFee * fee) / fee).toFixed(formState.value.decimals);
        if (Number(num) - Math.floor(Number(num)) !== 0) {
            return Number(num).toFixed(formState.value.decimals);
        } else {
            return Number(num);
        }
    }
});

const spinning = ref<boolean>(false);

const coinInfo = ref<PromiseReturnType<typeof api.fetchCoinInfo>>({});
const handleInfo = () => {
    if (spinning.value) return;
    formState.value = {};
    spinning.value = true;
    api.fetchCoinInfo({
        coinId: props?.activeData?.id as string,
        chainId: props?.activeData?.chainId as string,
    })
        .then((data: PromiseReturnType<typeof api.fetchCoinInfo>) => {
            formState.value = {
                ...data,
                enUs: data?.rechargeText?.['en-US'] || '',
                zhCn: data?.rechargeText?.['zh-CN'] || '',
                ruRu: data?.rechargeText?.['ru-RU'] || '',
                arAe: data?.rechargeText?.['ar-AE'] || '',
                zhTw: data?.rechargeText?.['zh-TW'] || '',
            };
            coinInfo.value = { ...data };
            userSymbol.value = data.symbol;
        })
        .finally(() => {
            spinning.value = false;
        });
};

watch(
    () => props.visible,
    (n, o) => {
        if (n !== o && n) {
            handleInfo();
            // form.state = 1;
        }
    }
);
watch(
    () => [formState.value.internalOutMinAmount, formState.value.internalOutMaxAmount],
    ([internalOutMinAmount, internalOutMaxAmount]) => {
        if (internalOutMinAmount && internalOutMaxAmount) {
            formRef.value.validateFields(['internalOutMinAmount', 'internalOutMaxAmount']);
        }
    },
    {
        immediate: true,
    }
);

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    const isApi = props.type === 'add' ? 'coinUpdate' : 'coinUpdate';
    formState.value.withdrawFee = actuallyFee.value;
    const { ...params } = formState.value;

    // @ts-ignore
    return api[isApi]({
        coinId: props.type === 'add' ? undefined : props.activeData?.id,
        ...params,
        rechargeText: {
            'en-US': formState.value?.enUs || '',
            'zh-CN': formState.value?.zhCn || '',
            'zh-TW': formState.value?.zhTw || '',
            'ru-RU': formState.value?.ruRu || '',
            'ar-AE': formState.value?.arAe || '',
        },
        inAccountAmount: String(formState.value.inAccountAmount),
    })
        .then(() => {
            emit('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
};
</script>

<style scoped lang="scss">
.width-600 {
    width: 600px;
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
        }
    }
}
</style>
