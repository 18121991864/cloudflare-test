<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="handleAfterClose"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="emit('onClose')"
        @ok="handelSubmit"
        width="700px"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 0 }" hide-required-mark :rules="formRules" :model="formState">
            <!-- 规则名称 -->
            <a-form-item name="name" label="规则名称">
                <a-input v-model:value="formState.name" size="small" placeholder="请输入" :disabled="disabledForm" />
            </a-form-item>

            <!-- 权重设置 -->
            <div class="text-14px color-[#4E5969]">权重设置:</div>
            <div v-for="(weight, index) in formState.weightInfo" :key="weight.key" class="mt-2 mb-2">
                <div class="flex gap-8">
                    <span class="w-[60px] mt-[6px]">渠道{{ index + 1 }}：</span>
                    <a-form-item
                        :name="['weightInfo', index, 'ditchCode']"
                        :rules="[{ required: true, message: '请选择渠道' }]"
                        required
                        class="mb-0"
                    >
                        <a-select
                            v-model:value="formState.weightInfo[index].ditchCode"
                            placeholder="请选择渠道"
                            size="small"
                            style="width: 150px"
                            suffix-icon=">"
                            :disabled="disabledForm"
                        >
                            <a-select-option v-for="option of channelOptions" :key="option.value" :value="option.value">{{
                                option.label
                            }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        :name="['weightInfo', index, 'weight']"
                        :rules="[
                            { required: true, message: '请输入权重值' },
                            { pattern: /^[1-9]\d*$/, message: '权重值必须为正整数' },
                            { validator: validateWeightSum },
                        ]"
                        class="mb-0 w-120"
                    >
                        <a-input
                            v-model:value="formState.weightInfo[index].weight"
                            placeholder="请输入权重值"
                            :disabled="disabledForm"
                            size="small"
                            style="width: 100%"
                        />
                    </a-form-item>
                    <a-button
                        v-if="index === formState.weightInfo.length - 1 && !disabledForm"
                        type="text"
                        style="width: 24px; height: 24px; padding: 0; display: flex; align-items: center; justify-content: center"
                        @click="addWeight"
                        >+</a-button
                    >
                    <a-button
                        v-if="formState.weightInfo.length > 1 && index > 0 && !disabledForm"
                        type="text"
                        style="width: 24px; height: 24px; padding: 0; display: flex; align-items: center; justify-content: center"
                        @click="() => removeWeight(weight)"
                        >-</a-button
                    >
                </div>
            </div>
            <!-- 后续可能要用 -->
            <!-- 风险等级设置  -->
            <!-- <div style="margin: 16px 0 8px 0; font-weight: bold">风险等级设置</div>
            <template v-if="formState.levelInfo.length > 0">
                <div
                    v-for="(risk, index) in formState.levelInfo"
                    :key="`risk-${risk.level}-${index}`"
                    style="background: #f9f2f2; padding: 12px 8px; margin-bottom: 8px; border-radius: 4px"
                >
                    <div style="margin-bottom: 8px">
                        风险等级：<span style="font-weight: bold">{{ getRiskLeve(risk.level)?.label }}</span>
                    </div>
                    <div style="display: flex; gap: 8px">
                        <span class="mt-1">AML系数：</span>
                        <a-form-item
                            :name="['levelInfo', `${index}`, 'minScore']"
                            style="width: 160px"
                            :rules="[
                                { required: true, message: '请输入最小值' },
                                { pattern: /^[1-9]\d*$/, message: '最小值必须为正整数' },
                                { validator: (rule: any, value: string) => validateMinScore(rule, value, index) }
                            ]"
                            class="mb-0"
                        >
                            <a-input v-model:value="formState.levelInfo[index].minScore" :disabled="disabledForm" size="small" placeholder="请输入" />
                        </a-form-item>
                        <span>-</span>
                        <a-form-item
                            :name="['levelInfo', `${index}`, 'maxScore']"
                            style="width: 160px"
                            :rules="[
                                { required: true, message: '请输入最大值' },
                                { pattern: /^[1-9]\d*$/, message: '最大值必须为正整数' },
                                { validator: (rule: any, value: string) => validateMaxScore(rule, value, index) }
                            ]"
                            class="mb-0"
                        >
                            <a-input v-model:value="formState.levelInfo[index].maxScore" :disabled="disabledForm" size="small" placeholder="请输入" />
                        </a-form-item>
                    </div>
                </div>
            </template> -->

            <!-- 应用范围 -->
            <a-form-item name="range" label="应用范围">
                <a-radio-group v-model:value="formState.range" :disabled="disabledForm">
                    <a-radio v-for="option of rangeOptions" :key="option.value" :value="+option.value">{{ option.label }}</a-radio>
                </a-radio-group>
            </a-form-item>

            <!-- 状态 -->
            <!-- <a-form-item name="state" label="状态">
                <a-radio-group v-model:value="formState.state" name="state">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">禁用</a-radio>
                </a-radio-group>
            </a-form-item> -->
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { defineProps, defineEmits } from 'vue';
import { useRequest } from 'vue-request';
import api from '@/newApi/amlManagement/index';

interface WeightInfo {
    key?: string;
    ditchCode: string | null;
    weight: string;
}

interface LevelInfo {
    level: string;
    maxScore: string;
    minScore: string;
}

// 权重设置 渠道选择
const { data: channelOptions } = useRequest(() => api.fetchDitchSelect());

// 应用范围
const { data: rangeOptions } = useRequest(() => api.fetchRangeSelect());

// 风险等级
const { data: riskLevelOptions } = useRequest(() => api.fetchRiskLevelSelect());

const FormParams = reactive({
    id: '',
    name: '', // 规则名称
    weightInfo: [{ key: Date.now().toString(), ditchCode: null, weight: '' }] as WeightInfo[],
    levelInfo: [] as LevelInfo[],
    range: 1,
});

const formState = reactive<any>({ ...FormParams });

watch(
    () => riskLevelOptions.value,
    () => {
        if (riskLevelOptions.value && Array.isArray(riskLevelOptions.value)) {
            FormParams.levelInfo = riskLevelOptions.value.map((item: any) => ({
                level: `${item.value}`,
                maxScore: '',
                minScore: '',
            }));
            formState.levelInfo = [...FormParams.levelInfo];
        }
    }
);

// props
const props = defineProps<{
    visible: boolean;
    type: 'add' | 'edit' | 'info';
    activeData: PromiseReturnType<typeof api.fetchAMLRuleList>['list'];
}>();

// emits
const emit = defineEmits<{
    (e: 'onClose'): void;
    (e: 'onSuccess'): void;
}>();

// 权重设置动态增减
const addWeight = () => {
    formState.weightInfo.push({
        key: Date.now().toString(),
        ditchCode: '',
        weight: '',
    });
};

const removeWeight = (item: WeightInfo) => {
    const index = formState.weightInfo.indexOf(item);
    if (index !== -1) {
        formState.weightInfo.splice(index, 1);
    }
};

// 获取风险等级标签
const getRiskLeve = (value: string) => {
    if (!riskLevelOptions.value || !Array.isArray(riskLevelOptions.value)) return '';
    const option = riskLevelOptions.value.find((item: any) => item.value === value);
    return option || '';
};

// 权重总和校验
const validateWeightSum = (rule: any, value: string) => {
    if (!value) return Promise.resolve();

    const totalWeight = formState.weightInfo.reduce((sum: number, item: WeightInfo) => {
        const weight = parseFloat(item.weight) || 0;
        return sum + weight;
    }, 0);

    if (totalWeight !== 100) {
        return Promise.reject(new Error('所有权重值的总和必须等于100'));
    }

    return Promise.resolve();
};

// 最小值校验
const validateMinScore = (rule: any, value: string, index: number) => {
    if (!value) return Promise.resolve();

    const minScore = parseFloat(value);
    const maxScore = parseFloat(formState.levelInfo[index].maxScore);

    // 检查最小值是否小于最大值
    if (!isNaN(maxScore) && minScore >= maxScore) {
        return Promise.reject(new Error('最小值必须小于最大值'));
    }

    // 检查是否大于前一个等级的最大值
    if (index > 0) {
        const prevMaxScore = parseFloat(formState.levelInfo[index - 1].maxScore);
        if (!isNaN(prevMaxScore) && minScore <= prevMaxScore) {
            return Promise.reject(new Error('最小值必须大于上一等级的最大值'));
        }
    }

    return Promise.resolve();
};

// 最大值校验
const validateMaxScore = (rule: any, value: string, index: number) => {
    if (!value) return Promise.resolve();

    const maxScore = parseFloat(value);
    const minScore = parseFloat(formState.levelInfo[index].minScore);

    // 检查最大值是否大于最小值
    if (!isNaN(minScore) && maxScore <= minScore) {
        return Promise.reject(new Error('最大值必须大于最小值'));
    }

    // 检查下一个等级的最小值是否大于当前最大值
    if (index < formState.levelInfo.length - 1) {
        const nextMinScore = parseFloat(formState.levelInfo[index + 1].minScore);
        if (!isNaN(nextMinScore) && nextMinScore <= maxScore) {
            return Promise.reject(new Error('下一等级的最小值必须大于当前最大值'));
        }
    }

    return Promise.resolve();
};

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    name: [{ required: true, trigger: 'blur', message: '请输入' }],
    state: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const title = computed(
    () =>
        `${props.type === 'add' ? '新增' : props.type === 'info' ? '查看' : '编辑'}AML规则配置${
            props.activeData?.id ? `-${props.activeData?.id}` : ''
        }`
);

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    // @ts-ignore
    return api
        .fetchAddAMLRule({ ...formState })
        .then(() => {
            emit('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const formRef = ref<FormInstance>();
const handelSubmit = async () => {
    // 提交
    if (!props.visible || !formRef.value) return;
    try {
        await formRef.value.validate();
        const result = handleAddOrUpdate();
        if (result) {
            await result;
            emit('onSuccess');
        }
    } catch (error) {
        console.error('Form validation failed:', error);
    }
};

const handleAfterClose = () => {
    if (formRef.value) {
        nextTick(() => {
            formRef.value?.resetFields();
        });
    }
};
const disabledForm = computed(() => {
    return props.type === 'info';
});
watch(
    () => props.visible,
    (n, o) => {
        // 用于填充modal数据
        if (n !== o && n) {
            Object.entries(FormParams).forEach(([key]: any) => {
                // @ts-ignore 回填填充formState数据
                formState[key] = props.type === 'add' ? FormParams?.[key] : props.activeData?.[key] || FormParams?.[key];
            });
            console.log('activeData', props.activeData);
        }
    },
    { immediate: true }
);
</script>
