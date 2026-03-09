<template>
    <a-modal v-model:open="open" :width="width" :mask-closable="false" @cancel="handleCancel" v-if="timeOpen">
        <template #title>
            <div class="text-center">{{ $t(`${title}`) }}</div>
        </template>
        <a-spin v-if="typeStuts !== 'info'" :spinning="updateData.spinning">
            <a-form
                ref="formReset"
                :model="formState" :label-col="{ span: 8 }" 
                :rules="Object.keys(constructionItem.formRules || {}).reduce((acc, key) => {
                    acc[key] = constructionItem?.formRules[key].map((rule) => ({ ...rule, message: t(rule.message as string || '') }));
                    return acc;
                }, {} as Record<string, rulesType[]>)">
                <template v-for="(item, index) in constructionItem.fieldNames" :key="index">
                    <template v-if="showSlots(item as UpdateConstructionItem)">
                        <slot name="itemUpdata" :data="item" :formState="formState"></slot>
                    </template>

                    <div v-else-if="item.type === 'span'" class="w-[22%] text-center text-sm font-semibold mb-[15px]">{{ item.label }}</div>
                    <!-- 输入框 -->
                    <a-form-item
                        v-else-if="['input', 'input-number', 'input-password', 'input-button', 'textarea'].includes(item.type)"
                        :label="$t(`${item.label}`)"
                        :name="isRequire(item.value, item?.isRuqire)"
                        :class="[item.suffix ? 'suffix-num-item' : '']"
                    >
                        <template v-if="['input', 'input-password'].includes(item.type)">
                            <a-input
                                v-model:value="formState[item.value]"
                                :placeholder="t(item.placeholder)"
                                :disabled="item.disabled"
                                :suffix="item.suffix"
                                :type="item.type === 'input-password' ? 'password' : 'text'"
                            />
                            <div v-if="item.tips" class="my-2 text-xs text-gray-500">{{ item.tips }}</div>
                        </template>
                        <template v-else>
                            <update-input :item="item" :type="item.type" :formState="formState" />
                        </template>
                    </a-form-item>
                    <!-- 国际区号+电话 -->
                    <a-form-item
                        v-else-if="item.type === 'globalPhone'"
                        :label="item.label"
                        :name="isRequire(item.value, item?.isRuqire)"
                        class="user-from-global-phone"
                    >
                        <a-select
                            v-model:value="formState[item.value1 as string]"
                            class="user-select-option"
                            :mode="(item.selectAttribute?.mode as any)"
                            :show-search="item.selectAttribute?.showSearch || false"
                            :field-names="(item.selectAttribute?.fieldNames as any) "
                            :placeholder="item.placeholder1"
                            :option-filter-prop="item.selectAttribute?.optionFilterProp || 'label'"
                            :options="item.selectOptions"
                        >
                        </a-select>
                        <a-input v-model:value="formState[item.value]" :placeholder="item.placeholder" class="user-select-input" />
                    </a-form-item>
                    <!-- 时间 -->
                    <update-data-time
                        v-else-if="item.type === 'timePicker'"
                        :isRequire="isRequire"
                        :formState="formState"
                        :item="item"
                        :open="open"
                    />
                    <!-- 展示 -->
                    <template v-else-if="item.isForm || item.type == 'text'">
                        <a-form-item v-if="!item.isFormItem" :name="isRequire(item.value, item?.isRuqire)" :label="item.label">
                            <slot name="textFrom" :data="{ formState, item }">
                                <div>{{ formState[item.value1 || item.value] }}</div>
                            </slot>
                        </a-form-item>
                        <slot v-else name="textFrom" :data="{ formState, item }">
                            <div>{{ formState[item.value1 || item.value] }}</div>
                        </slot>
                    </template>

                    <!-- 上传文件 -->
                    <template v-else-if="item.type === 'upload-img'">
                        <a-form-item :label="item.label" :name="isRequire(item.value, item?.isRuqire)">
                            <div class="display-flex flex-align-items-center item-upload">
                                <template v-if="item.uploadList && item.uploadList.length">
                                    <Upload
                                        v-for="(list, index) in item.uploadList"
                                        :key="index"
                                        v-model:fullUrl="formState[list.value1 as string]"
                                        v-model:suffixUrl="formState[list.value]"
                                        class="use-upload"
                                        v-bind="item.uploadOptions"
                                        :max-file-size="item.uploadOptions?.maxFileSize || 5"
                                        :isdelete-btn="item.uploadOptions?.isdeleteBtn || false"
                                    >
                                        <template #upload-text>
                                            <div v-if="list.descText">{{ list.descText }}</div>
                                        </template>
                                    </Upload>
                                </template>
                                <Upload
                                    v-else
                                    class="use-upload"
                                    v-model:fullUrl="formState[item.value1 as string]"
                                    v-model:suffixUrl="formState[item.value]"
                                    v-bind="item.uploadOptions"
                                    :max-file-size="item.uploadOptions?.maxFileSize || 5"
                                    :isdelete-btn="item.uploadOptions?.isdeleteBtn || false"
                                >
                                    <template #upload-text>
                                        <div v-if="item.descText">{{ item.descText }}</div>
                                    </template>
                                </Upload>
                            </div>
                        </a-form-item>
                    </template>
                    <!--tabs  -->
                    <update-data-tabs
                        v-else-if="['tabs', 'tabs-input'].includes(item.type)"
                        :is-require="isRequire"
                        :item="item"
                        :open="open"
                        :formState="formState"
                    />
                    <!-- 币种筛选 -->
                    <a-form-item v-else-if="item.type === 'coinId'" :label="item.label" :name="isRequire(item.value, item?.isRuqire)">
                        <SCoin v-model="formState[item.value]" :pure="true" :placeholder="item.placeholder" :disabled="item.disabled" />
                    </a-form-item>
                    <!--  -->
                    <a-form-item v-else-if="item.type === 'cardId'" :label="item.label" :name="isRequire(item.value, item?.isRuqire)">
                        <SDitchCard
                            v-model="formState[item.value]"
                            :pure="true"
                            :placeholder="item.placeholder"
                            :disabled="item.disabled"
                            :ditchCode="item.ditchCode"
                        />
                    </a-form-item>
                    <!-- switch -->
                    <a-form-item v-else-if="item.type === 'switch'" :label="item.label" :name="isRequire(item.value, item?.isRuqire)">
                        <update-switch :item="item" :formState="formState" />
                    </a-form-item>
                    <!-- 选项 -->
                    <a-form-item v-else :label="$t(`${item.label}`)" :name="isRequire(item.value, item?.isRuqire)">
                        <a-select
                            v-if="item.type === 'select'"
                            :disabled="item.disabled"
                            v-model:value="formState[item.value]"
                            :placeholder="$t(item.placeholder)"
                            @change="item.change && item.change(formState[item.value])"
                        >
                            <a-select-option
                                v-for="optionsItem in item.selectOptions"
                                :disabled="optionsItem.disabled"
                                :key="optionsItem.value"
                                :value="optionsItem.value"
                                >{{ $t(`${optionsItem.label}`) }}</a-select-option
                            >
                        </a-select>
                        <a-select
                            v-else-if="item.type === 'select-options'"
                            v-model:value="formState[item.value]"
                            :disabled="item.disabled"
                            :mode="(item.selectAttribute?.mode as any)"
                            :show-search="item.selectAttribute?.showSearch || false"
                            :field-names="(item.selectAttribute?.fieldNames as any) "
                            :placeholder="item.placeholder"
                            :option-filter-prop="item.selectAttribute?.optionFilterProp || 'label'"
                            :options="item.selectOptions"
                        />

                        <a-radio-group
                            v-else-if="item.type === 'radio'"
                            :disabled="item.disabled"
                            v-model:value="formState[item.value]"
                            :name="`radioGroup${index}`"
                        >
                            <a-radio v-for="list in item.selectOptions" :key="list.value" :value="list.value">{{ list.label }}</a-radio>
                        </a-radio-group>
                        <template v-else-if="['radio-button', 'radio-input'].includes(item.type)">
                            <update-data-radio :item="item" :form-state="formState" :constructionItem="constructionItem" />
                        </template>
                    </a-form-item>
                </template>
            </a-form>
        </a-spin>
        <query-details v-else ref="queryDetailRef">
            <template #lable="{ dataIndex, data }">
                <slot name="lable" :dataIndex="dataIndex" :data="{ ...data }"></slot>
            </template>
            <template #customSlots="{ data, dataIndex }">
                <slot name="infoSlots" :data="{ ...data }" :data-index="dataIndex"></slot>
            </template>
        </query-details>
        <template #footer>
            <slot name="footer" :operate="{ handleCancel, slothandleOk, tipsMessageCallback }">
                <a-button @click="handleCancel">{{ constructionItem.cancelText || '取消' }}</a-button>
                <a-button type="primary" @click="handleOk" :loading="updateData.spinning">{{ constructionItem.okText || '确定' }}</a-button>
            </slot>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import type { CallbackInfo, detailLabel, queryDetailConfig } from '@/config-overall/interface/detail';
import { InfoDataConstType } from '@/config-overall/interface/info';
import type { UpdateConstructionItem, UpdateConstructionType } from '@/config-overall/interface/update';
import { FormInstance, message } from 'ant-design-vue';
import useUpdateData from '@/store/config-overall/update-data';
import updateSwitch from './update-switch.vue';
import useUpdateStore from '@/config-overall/views/store/updateStore';
import _ from 'lodash';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();


const constructionItem = ref<UpdateConstructionType>({
    fieldNames: [],
    titleName: '',
    updateInterface: () => {
        return new Promise((resolve) => {
            // @ts-ignore
            resolve({});
        });
    },
});
const updateData = useUpdateData();
const { formReset, formState } = toRefs(useUpdateStore());
const open = ref(false);
const configInfoBnts = ref<InfoDataConstType>({
    show: true,
    titleName: '详情',
    fieldNames: [],
    handelInfoData: () => {
        return new Promise((resolve) => {
            // @ts-ignore
            resolve({});
        });
    },
    tabs: [],
    formState: {},
});
const typeStuts = ref<'add' | 'info' | 'edit'>('add');
const queryDetailRef = ref<ComponentInstance['QueryDetails']>();
const title = ref('新增');
const emits = defineEmits<{
    handleOk: [];
}>();
const timeOpen = ref(false);
watch(
    () => open.value,
    (val) => {
        updateData.open = val;
        if (!val) {
            width.value = 600;
            setTimeout(() => {
                timeOpen.value = false;
            }, 500);
            return;
        }
        timeOpen.value = true;
    }
);

const deepFormState = ref({});
const handleOk = async () => {
    if (typeStuts.value !== 'info') {
        await formReset.value?.validate();
        updateData.Setspinning(true);
        await constructionItem.value
            .updateInterface({
                ...formState.value,
            })
            .then((res) => {
                console.log(res);

                if (res !== undefined) {
                    tipsMessageCallback();
                }

                handleCancel();
            })
            .finally(() => {
                updateData.Setspinning(false);
            });
    } else {
        handleCancel();
    }
};
const tipsMessageCallback = () => {
    emits('handleOk');
    message.success(`${constructionItem.value.titleName}成功`);
};
const slothandleOk = async () => {
    if (typeStuts.value !== 'info') {
        await formReset.value?.validate();

        updateData.Setspinning(true);
        return new Promise(async (resolve) => {
            constructionItem.value
                .updateInterface({
                    ...formState.value,
                })
                .then((res) => {
                    resolve(res);
                })
                .finally(() => {
                    updateData.Setspinning(false);
                });
        });
    }
};
const handleCancel = () => {
    formReset.value?.resetFields();
    formState.value = _.cloneDeep(deepFormState.value);
    if (queryDetailRef.value) {
        queryDetailRef.value?.setActiveKey();
    }
    open.value = false;
};
const width = ref(600);
const footer = ref(null);
const openCallback = async (config: UpdateConstructionType | InfoDataConstType, type: 'add' | 'info' | 'edit' = 'add', data?: any) => {
    if (config.callback && type !== 'info') {
        await config.callback(config, data);
    }

    formReset.value?.clearValidate();

    open.value = true;
    title.value = config.titleName || title.value;
    width.value = config.width || width.value;
    typeStuts.value = type;

    if (type === 'info') {
        configInfoBnts.value = config as InfoDataConstType;
        nextTick(() => {
            queryDetailRef.value?.initConfigInfo(configInfoBnts.value, data);
        });
    } else {
        constructionItem.value = config as UpdateConstructionType;
    }

    if (type === 'add') {
        const dataState = isRef(config.formState) ? config.formState.value : config.formState;
        deepFormState.value = _.cloneDeep(dataState);

        Object.keys(dataState).forEach((key) => {
            formState.value[key] = dataState[key];
        });
    }

    if (type !== 'add') {
        Object.keys(data).forEach((key) => {
            formState.value[key] = data[key];
        });
    }

    if (type !== 'info') {
        constructionItem.value.formState = formState;
        constructionItem.value.formReset = formReset;
    }
};
const isRequire = computed(() => {
    return (value: string, require?: boolean) => {
        return require === false ? '' : value;
    };
});
const showSlots = computed(() => {
    return (item: UpdateConstructionItem) => {
        if (item.type !== 'slot') return false;
        const fieldSlots = constructionItem.value.fieldSlots;

        if (!fieldSlots) {
            throw new Error('fieldSlots 必须有值');
        }

        return fieldSlots && fieldSlots.includes(item.value);
    };
});
defineExpose({
    openCallback,
    handleCancel,
});
</script>

<style lang="scss" scoped>
.suffix-num-item {
    position: relative;
    .suffix {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
    }
}
.ant-input[disabled] {
    background-color: #f5f5f5;
}
.item-upload {
    div {
        &:nth-child(1) {
            text-align: left;
        }
    }
    .use-upload {
        margin-right: 15%;
        &:last-child {
            margin-right: 0;
        }
    }
}

.user-from-global-phone {
    :deep(.ant-form-item-control-input-content) {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }

    .user-select-option {
        width: 80px;
        margin-right: 20px;
    }

    .user-select-input {
        flex: 1;
    }
}
</style>
