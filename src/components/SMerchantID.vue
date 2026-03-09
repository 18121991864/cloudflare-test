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
        <a-select-option v-if="!pure && !loading" label="全部" value="">全部</a-select-option>
        <template v-for="x in getList" :key="x.no">
            <a-select-option :label="x.no" :value="x.no" :disabled="x.state === 0 || x.state === 2"
                >{{ x.no }} ({{ stateArr?.[x.state] }})</a-select-option
            >
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
    name: 'SMerchantID',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? '' : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const stateArr = ['未启用', '启用', '禁用'];
        const loading = ref(false);
        const getList = ref(Object.create(null));
        const handleList = (open: boolean = true) => {
            if (loading.value || !open) return;
            loading.value = true;
            getList.value = [];
            api.fetchMerchantList()
                .then((data: PromiseReturnType<typeof api.fetchMerchantList>) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange');
        return {
            id,
            filterOption,
            handleList,
            handleChange,
            getList,
            loading,
            stateArr,
        };
    },
});
</script>
