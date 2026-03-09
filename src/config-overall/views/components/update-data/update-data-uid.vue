<template>
    <a-form-item :label="item.label" :name="isRequire(item.value, item?.isRuqire)">
        <a-spin :spinning="loading">
            <a-input
                :disabled="item.disabled"
                v-if="item.type == 'tabs-input'"
                @blur="handleChange"
                v-model:value="formState[item.value]"
                :placeholder="item.placeholder"
            />
            <a-select
                v-else-if="item.type == 'uid'"
                v-model:value="formState[item.value1]"
                mode="multiple"
                :disabled="item.disabled"
                :auto-clear-search-value="autoClearSearchValue"
                :placeholder="item.placeholder"
                :max-tag-count="4"
                :filter-option="filterOption"
                :options="labelArr"
                :field-names="{
                    label: 'id',
                    value: 'id',
                }"
                :allow-clear="true"
                @change="handleChange"
            >
                <template #option="{ id, email, phone }">
                    <div>
                        <span>UID: {{ id }}</span>
                        <span class="ml-10">{{ email || phone }}</span>
                    </div>
                </template>
            </a-select>
        </a-spin>
    </a-form-item>
</template>

<script lang="ts" setup>
import type { TypeTagList } from '@/api/tag/types.d';
import { UpdateConstructionItem } from '@/config-overall/interface/update';
import { useRequest } from "vue-request";
import api from '@/api/disCount';

const props = withDefaults(
    defineProps<{
        item: UpdateConstructionItem;
        open: boolean;
        formState: any;
        isRequire: (value: string, require?: boolean) => string;
    }>(),
    {
        type: 'timePicker',
        format: 'timeStamp',
        open: false,
    }
);
const emits = defineEmits(['changeTabs']);
const autoClearSearchValue = ref(true);

const { data: labelArr, loading, runAsync: fetchAccountArr } = useRequest(() => api.accountList({ agents: props.formState.agents }), { manual: true });

const filterOption = (input: string, option: TypeTagList) => {
    const inputs = input.split(',');
    let isOptions = false;
    inputs.map((item) => {
        if ((option.id as string).includes(item.toLocaleUpperCase())) {
            isOptions = true;
        }
    });
    if (isOptions) {
        autoClearSearchValue.value = false;
    }
    return isOptions;
};

const handleChange = () => {
    if (props.item.tabsOptions) {
        props.item.tabsOptions?.callback(props.item, props.formState[props.item.value]);
    }
    emits('changeTabs');
};

watch(() => props.formState.agents, (value: string[]) => {
    if (value?.length && props.formState?.grantType !== 1) {
        fetchAccountArr();
    }
});

fetchAccountArr();
</script>

<style lang="scss" scoped>
.ant-input[disabled] {
    background-color: #f5f5f5;
}
</style>
