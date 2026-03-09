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
        @select="handelSelect"
        @dropdownVisibleChange="handleList"
    >
        <a-select-option v-if="!pure && !loading" label="全部" value="">全部</a-select-option>
        <template v-for="x in getList" :key="x.cardTypeId">
            <a-select-option :label="x.cardTypeName" :value="x.cardTypeId">{{ x.cardTypeName }}</a-select-option>
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
import api from '@/api/ditchAPI/ditchFinanceOe';

export default defineComponent({
    name: 'SEntryTypeCard',
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

        const loading = ref(false);
        const getList = ref<PromiseReturnType<typeof api.getCardTypeIdList>>(Object.create(null));
        const handleList = (open: boolean = true) => {
            if (loading.value || !open) return;
            loading.value = true;
            getList.value = [];
            api.getCardTypeIdList()
                .then((data: PromiseReturnType<typeof api.getCardTypeIdList>) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange');
        const handelSelect = (value: string) => {
            const item = getList.value.find((x) => x.value === value);

            context.emit('handelSelect', item);
        };
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
