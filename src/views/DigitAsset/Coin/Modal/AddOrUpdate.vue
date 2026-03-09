<script setup lang="ts">
import { computed, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';
import api from '@/api/coin';

const emits = defineEmits(['onClose', 'onSuccess']);

const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<{ id: string; chainId: string }>,
        default: () => Object.create(null),
    },
});

const formRef = ref();
const formState = ref(Object.create(null));
const isSubmitLoading = ref<boolean>(false); // 是否处于提交中

const spinning = ref<boolean>(false);

const handleInfo = () => {
    if (spinning.value) return;
    formState.value = {};
    spinning.value = true;
    api.fetchCoinInfo({
        coinId: String(props?.activeData?.id),
        chainId: String(props?.activeData?.chainId),
    })
        .then((r) => {
            formState.value = {
                ...r,
                enUs: r?.rechargeText?.['en-US'] || '',
                zhCn: r?.rechargeText?.['zh-CN'] || '',
                ruRu: r?.rechargeText?.['ru-RU'] || '',
                arEG: r?.rechargeText?.['ar-EG'] || '',
            };
        })
        .finally(() => {
            spinning.value = false;
        });
};

const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    const isApi = props.type === 'add' ? 'coinUpdate' : 'coinUpdate';
    const { ...params } = formState.value;
    return api[isApi]({
        coinId: props.type === 'add' ? undefined : props.activeData?.id,
        ...params,
        rechargeText: {
            'en-US': formState.value?.enUs || '',
            'zh-CN': formState.value?.zhCn || '',
            'ru-RU': formState.value?.ruRu || '',
            'ar-EG': formState.value?.arEG || '',
        },
    })
        .then(() => {
            emits('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emits('onSuccess')));
};

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}币种${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);

watch(
    () => props.visible,
    (v, o) => {
        if (v !== o && v) handleInfo();
    }
);
</script>

<template>
    <a-modal
        :open="props.visible"
        :confirm-loading="isSubmitLoading"
        :width="900"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-spin :spinning="spinning">
            <a-form ref="formRef" layout="horizontal" class="form-list" :hide-required-mark="true" :model="formState">
                <div class="flex-wrap-wrap">
                    <div class="width-400 mr-20">
                        <div class="flex" style="justify-content: space-between">
                            <a-form-item class="width-190 mr-20" name="name" label="币种">
                                <a-input v-model:value="formState.name" disabled size="small" />
                            </a-form-item>
                            <a-form-item class="width-190 mr-20" name="chainTag" label="区块链">
                                <a-input v-model:value="formState.chainTag" disabled size="small" />
                            </a-form-item>
                        </div>
                    </div>
                    <a-form-item class="width-400 mr-20" name="decimals" label="币种精度">
                        <a-input v-model:value="formState.decimals" disabled size="small" />
                    </a-form-item>
                    <a-form-item disabled class="width-400 mr-20" name="inMinAmount" label="最小充值金额">
                        <a-input-number v-model:value="formState.inMinAmount" disabled size="small" :min="0" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item class="width-400 mr-20" name="explain2" label="最小上账金额">
                        <a-input v-model:value="formState.inAccountAmount" disabled size="small" />
                    </a-form-item>
                    <a-form-item class="width-400 mr-20" name="minOutAmount" label="最小提币金额">
                        <a-input-number v-model:value="formState.minOutAmount" disabled size="small" :min="0" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item class="width-400 mr-20" name="withdrawFee" label="手续费">
                        <a-input-number v-model:value="formState.withdrawFee" size="small" :min="0" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item class="width-400 mr-20" name="walletFee" label="优易手续费">
                        <a-input-number v-model:value="formState.walletFee" size="small" :min="0" placeholder="请输入" />
                    </a-form-item>
                    <a-form-item class="width-400 mr-20" name="explain3" label="总提币手续费">
                        <a-input v-model:value="formState.totalFee" disabled size="small" />
                    </a-form-item>
                    <a-form-item class="width-820 mr-20" name="zhCn" label="充值文案(中文)">
                        <a-textarea v-model:value="formState.zhCn" placeholder="充值文案(中文)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="width-820 mr-20" name="enUs" label="充值文案(英文)">
                        <a-textarea v-model:value="formState.enUs" placeholder="充值文案(英文)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="width-820 mr-20" name="ruRu" label="充值文案(俄文)">
                        <a-textarea v-model:value="formState.ruRu" placeholder="充值文案(俄文)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="width-820 mr-20" name="arEG" label="充值文案(阿拉伯)">
                        <a-textarea v-model:value="formState.arEG" placeholder="充值文案(阿拉伯)" show-count :rows="4" />
                    </a-form-item>
                    <a-form-item class="width-820 mr-20" name="status" label="币种开关">
                        <a-radio-group v-model:value="formState.status" name="radioGroup">
                            <a-radio :value="1">启用币种</a-radio>
                            <a-radio :value="0">禁用币种</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item class="width-820 mr-20" name="inStatus" label="充币开关">
                        <a-radio-group v-model:value="formState.inStatus" name="radioGroup">
                            <a-radio :value="1">启用充币</a-radio>
                            <a-radio :value="0">禁用充币</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item class="width-820 mr-20" name="outStatus" label="提币开关">
                        <a-radio-group v-model:value="formState.outStatus" name="radioGroup">
                            <a-radio :value="1">启用提币</a-radio>
                            <a-radio :value="0">禁用提币</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </div>
            </a-form>
        </a-spin>
    </a-modal>
</template>
