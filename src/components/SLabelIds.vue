<!--用户标签下拉-->
<template>
    <a-select
        v-model:value="id"
        :disabled="readOnly || disabled"
        size="small"
        mode="multiple"
        show-search
        placeholder="请选择"
        allow-clear
        :filter-option="filterOption"
        @change="handleChange"
        :options="userStore.getTagSelectOptions.map(item => ({
            value: item.value,
            label: item.label
        }))"
    >
    </a-select>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useUser from '@/store/user';

export default defineComponent({
    name: 'SLabelIds',
    props: {
        modelValue: { type: String, default: '', required: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
    },
    setup(props, context) {
        const userStore = useUser();

        userStore.fetchTagList();

        const id = computed({
            get: () => props.modelValue ? props.modelValue.split(',') : [],
            set: (val) => context.emit('update:modelValue', val.join(',')),
        });

        const filterOption = (input: string, option: any) => {
            return `${option.label.toLowerCase()}`.includes(input.toLowerCase());
        };

        const handleChange = () => {
            context.emit('onChange');
        };

        return {
            id,
            handleChange,
            filterOption,
            userStore
        };
    },
});
</script>
