<!--渠道卡片下拉-->
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
        <template v-for="x in getList" :key="x.id">
            <a-select-option :label="x.cardName" :value="x.id">{{ x.cardName }}</a-select-option>
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
    name: 'SAgentCardList',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
        agentId: { type: String, default: '', required: true },
        ditchCode: { type: String, default: '', required: false },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? '' : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const getList = ref(Object.create(null));
        const handleList = (open: boolean = true) => {
            if (loading.value || !open) return;
            loading.value = true;
            getList.value = [];
            api.fetchAgentCardList({
                pageNo: 1,
                pageSize: 1000,
                ditchCode: props.ditchCode,
                agentId: props.agentId,
            })
                .then((data: PromiseReturnType<typeof api.fetchAgentCardList>) => {
                    getList.value = data.list || [];
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = (newId: string) => {
            context.emit('onChange');
            context.emit('getType', getList.value.filter((x: any) => x.id === newId)[0]?.cardType);
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
