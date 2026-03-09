<!--币种下拉-->
<template>
    <div>
        <a-cascader
            v-if="getList"
            v-model:value="id"
            :disabled="readOnly || disabled"
            placeholder="请选择"
            :options="getList"
            allow-clear
            @change="handleChange"
            @select="handelSelect"
            @dropdownVisibleChange="handleList"
        >
        </a-cascader>
        {{ cardNumber }}
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import api from '@/api/asset/index';

export default defineComponent({
    name: 'SManualAdjustCardCoin',
    props: {
        modelValue: { type: String, default: [], required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
        accountId: { type: String, default: '' },
        selectCard: { type: Object },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? [] : []),
            set: (val) => context.emit('update:modelValue', val),
        });

        const cardNumber = computed(() => {
            return getList.value
                .filter((item) => {
                    return item.value == id.value[0];
                })?.[0]
                ?.children?.filter((i: any) => {
                    return i.value == id.value[1];
                })?.[0]?.extend?.cardNumber;
        });

        const loading = ref(false);
        const getList = ref<PromiseReturnType<typeof api.fetchManualAdjustCardGetCardInfo>>([]);
        const handleList = (open: boolean = true) => {
            if (loading.value || !open) return;
            loading.value = true;
            getList.value = [];
            api.fetchManualAdjustCardGetCardInfo({
                accountId: props.accountId,
            })
                .then((data: PromiseReturnType<typeof api.fetchManualAdjustCardGetCardInfo>) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = (val: string) => {
            context.emit('onChange');
            const item = getList.value.find((x) => x.value === val[0])?.children?.find((i: any) => i.value === val[1]);
            const ditchCode = item?.ditchCode;
            context.emit('update:selectCard', item);
            context.emit('setDitchCode', ditchCode);
        };
        const handelSelect = (value: string) => {
            const item = getList.value.find((x) => x.value === value);

            context.emit('handelSelect', item);
        };

        const getDitchCode = computed(() => getList.value.find((item) => item.value === id.value[0])?.ditchCode);

        function resetState() {
            id.value = [];
            context.emit('update:selectCard', void 0);
            context.emit('setDitchCode', void 0);
            context.emit('handelSelect', void 0);
        }

        onUnmounted(resetState);

        watch(() => props.accountId, resetState);

        return {
            id,
            filterOption,
            handleList,
            handleChange,
            handelSelect,
            getList,
            loading,
            cardNumber,
        };
    },
});
</script>
