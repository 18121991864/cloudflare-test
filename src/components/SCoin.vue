<!--币种下拉-->
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
        <a-select-option v-if="!pure && !loading" label="全部" :value="allValue">全部</a-select-option>
        <template v-for="x in getList" :key="x.itemId">
            <a-select-option :label="x.value" :value="x.value">{{ x.label }}</a-select-option>
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
    name: 'SCoin',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
        allValue: { type: String, default: '' },
        defalutSelect: { type: String, default: '' },
        status: { type: Number, default: undefined },
        chainId: { type: String, default: undefined },
        isCoinId: { type: Boolean, default: false },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? props.allValue : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const isDefalutSelect = ref(false);
        const preChainId = ref<undefined | string>();
        const getList = ref<PromiseReturnType<typeof api.getSymbolSelect>>(Object.create(null));
        const handleList = (open: boolean = true) => {
            return new Promise((resolve, reject) => {
                if (getList.value.length) {
                    if (preChainId.value === props.chainId) return;
                }
                if (loading.value || !open) return;
                loading.value = true;
                getList.value = [];
                preChainId.value = props.chainId;
                const isCoinId = props.chainId || props.isCoinId;

                const getSelectCoin = !isCoinId
                    ? api.getSymbolSelect.bind(api, { status: props.status })
                    : api.getCoinSelect.bind(api, {
                          status: props.status,
                          chainId: props.chainId || undefined,
                      });
                getSelectCoin()
                    .then((data: PromiseReturnType<typeof api.getSymbolSelect>) => {
                        getList.value = data;
                        if (props.defalutSelect && !isDefalutSelect.value) {
                            isDefalutSelect.value = true;
                            const item = getList.value.find((x) => x.value === props.defalutSelect);
                            if (item) {
                                id.value = item.value;
                                context.emit('chnageCoinSelect', item.value);
                            }
                        }
                        resolve(data);
                    })
                    .finally(() => {
                        loading.value = false;
                    });
            });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange');
        const handelSelect = async (value: string) => {
            if (!getList.value.length) {
                await handleList();
            }
            const item = getList.value.find((x) => x.value === value);
            context.emit('handelSelect', item);
        };
        watch(
            () => id.value,
            (value) => {
                if (!value) return false;
                handelSelect(value as string);
            },
            {
                immediate: true,
            }
        );
        watch(
            () => props.chainId,
            (val) => {
                if (!val) return;
                handleList();
            }
        );
        return {
            id,
            filterOption,
            handleList,
            handleChange,
            handelSelect,
            getList,
            loading,
        };
    },
});
</script>
