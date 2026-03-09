<!--代理商下拉-->
<template>
    <a-select
        v-model:value="id"
        :disabled="readOnly || disabled"
        show-search
        placeholder="请选择"
        :filter-option="filterOption"
        allow-clear
        @change="handleChange"
        @dropdownVisibleChange="handleList"
    >
        <template v-for="x in getList" :key="x.businessType">
            <a-select-option :label="x.msg" :value="x.businessType">{{ x.msg }}</a-select-option>
        </template>
        <template v-if="loading" #notFoundContent>
            <div class="text-align-center">
                <a-spin size="small" />
            </div>
        </template>
    </a-select>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import api from '@/api/agent/index';

export default defineComponent({
    name: 'SBusiness',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? undefined : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const getList = ref(Object.create(null));
        const handleList = (open: boolean = true) => {
            if (loading.value || !open) return;
            loading.value = true;
            getList.value = [];
            api.fetchMsgTemplateBusinessTypeChoose()
                .then((data: PromiseReturnType<typeof api.fetchMsgTemplateBusinessTypeChoose>) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => {
            console.log(53);
            context.emit('onChange');
        };
        return {
            id,
            filterOption,
            handleList,
            handleChange,
            getList,
            loading,
        };
    },
});
</script>
