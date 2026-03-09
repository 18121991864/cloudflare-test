<template>
    <a-form-item :label="item.label" :name="isRequire(item.value, item?.isRuqire)">
        <a-input
            :disabled="item.disabled"
            v-if="item.type == 'tabs-input'"
            @blur="handleChange"
            v-model:value="formState[item.value]"
            :placeholder="item.placeholder"
        />
        <a-select
            v-else-if="item.type == 'label'"
            v-model:value="formState[item.value]"
            mode="multiple"
            :disabled="item.disabled"
            :auto-clear-search-value="autoClearSearchValue"
            :placeholder="item.placeholder"
            :max-tag-count="4"
            :filter-option="filterOption"
            :options="labelArr"
            :field-names="{
                label: 'name',
                value: 'id',
            }"
            :allow-clear="true"
            @change="handleChange"
        >
            <template #option="{ name, color }">
                <a-tag :color="color">{{ name }}</a-tag>
            </template>

            <template #tagRender="props">
                <a-tag v-if="props.option" :color="props.option.color" :closable="item.disabled ? false : true" @close="props.onClose">{{
                    props.option.name
                }}</a-tag>
            </template>
        </a-select>
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

const { data: labelArr, runAsync: fetchLabelArr } = useRequest(() => api.labelList({ agents: props.formState.agents }), { manual: true });

const filterOption = (input: string, option: TypeTagList) => {
    const inputs = input.split(',');
    let isOptions = false;
    inputs.map((item) => {
        if ((option.name as string).includes(item.toLocaleUpperCase())) {
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
    if (value.length && props.formState.grantType === 1) {
        fetchLabelArr();
    }
});

fetchLabelArr();
</script>

<style lang="scss" scoped>
.ant-input[disabled] {
    background-color: #f5f5f5;
}
</style>
