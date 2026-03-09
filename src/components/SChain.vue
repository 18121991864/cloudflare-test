<!--链下拉-->
<template>
    <a-select
        v-model:value="id"
        :disabled="readOnly || disabled"
        show-search
        placeholder="请选择"
        :filter-option="filterOption"
        allow-clear
        @dropdownVisibleChange="handleList"
    >
        <a-select-option v-if="!pure && !loading" label="全部" value="">全部</a-select-option>
        <template v-for="x in getList" :key="x.chainId">
            <a-select-option :label="x.label" :value="x.value">{{ x.label }}</a-select-option>
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
import api from '@/newApi/digitAsset/coin/index';

export default defineComponent({
    name: 'SChain',
    props: {
        modelValue: { type: String, default: '', required: true },
        coinId: { type: String, default: '', required: false },
        pure: { type: Boolean, default: false },
        name: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
        norequest: { type: Boolean, default: false, required: false },
        collection: { type: String, default: '', required: false },
        status: { type: Number, default: undefined },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? '' : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const getList = ref<PromiseReturnType<typeof api.getChainSelect>>(Object.create(null));
        const handleList = () => {
            if (loading.value || getList.value.length) return;
            loading.value = true;
            getList.value = [];
            api.getChainSelect({ status: props.status })
                .then((data: PromiseReturnType<typeof api.getChainSelect>) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };
        const handelRequest = () => {
            if (loading.value || getList.value.length) return;
            loading.value = true;
            getList.value = [];
            api.getChainSelect({ status: props.status })
                .then((data: PromiseReturnType<typeof api.getChainSelect>) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };
        if (props.norequest) {
            handelRequest();
        }

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange', getList.value);
        watch(
            () => id.value,
            () => {
                handleChange();
            }
        );
        // watch(
        //     () => props.coinId,
        //     () => {
        //         handelRequest();
        //     }
        // );
        onMounted(() => {
            handleList();
        });
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
