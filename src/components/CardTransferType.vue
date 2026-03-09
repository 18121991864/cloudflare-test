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
        @dropdownVisibleChange="refreshData"
    >
        <a-select-option v-if="!pure && !loading" label="全部" value="">全部</a-select-option>
        <template v-for="x in getList" :key="x.itemId">
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
import api from '@/api/asset/index';
import { useRequest } from 'vue-request';

export default defineComponent({
    name: 'SEntryType',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
        card: { type: Object },
        isRequestDitch: { type: String, default: 2, required: false },
        formState: {
            type: Object,
            default: {
                ditchCode: '', // 渠道
                businessType: '', // 调账业务
            },
            required: true,
        },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? '' : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const { data, loading, refresh: refresh } = useRequest(() => api.fetchManualAdjustCardGetEntryType());

        function refreshData() {
            if (unref(data)) return;
            refresh();
        }

        const ditchCodeOptionMap = new Map<string, (option: string, businessType: string, ditchChildCode?: string) => boolean>([
            ['passto', getFilterByPasstoOption],
            ['oe', getFilterByOeOption],
            ['reap', getFilterByReapOption],
            ['ptr', getFilterByPaytradesOption],
        ]);

        const getList = computed(() => {
            const _data = unref(data) || [];
            if (props.formState.isRequestDitch === '1' && props.formState.ditchCode !== 'passto') {
                // 调用渠道
                const filterFn = ditchCodeOptionMap.get(props.formState.ditchCode);
                if (filterFn) {
                    return _data.filter((item: any) => filterFn(item.value, props.formState.businessType, props.card?.extend?.cardMode));
                }
                return [];
            }
            return _data;
        });

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange');
        const handelSelect = (value: string) => {
            const item = getList.value.find((x) => x.value === value);

            context.emit('handelSelect', item);
        };

        // 调用渠道时过滤Passto冲正和补入账选项
        function getFilterByPasstoOption(option: string, businessType: string, ditchChildCode?: string) {
            if (option === '1') {
                // 补入账只是支持充值类型
                return ['1'].includes(businessType);
            }
            return false;
        }

        // 调用渠道时过滤paytrades冲正和补入账选项
        function getFilterByPaytradesOption(_option: string, businessType: string, ditchChildCode?: string) {
            // 充值类型支持补入账和冲正
            return ['1'].includes(businessType);
        }

        // 调用渠道时过滤reap冲正和补入账选项
        function getFilterByReapOption(option: string, businessType: string, ditchChildCode?: string) {
            if (option === '1') {
                // 补入账只是支持充值类型
                return ['1'].includes(businessType);
            }
            return false;
        }

        // 调用渠道时过滤oe冲正和补入账选项
        function getFilterByOeOption(option: string, businessType: string, ditchChildCode?: string) {
            if (option === '1') {
                // 补入账只是支持充值类型 且 卡片类型为PT卡
                if (ditchChildCode === 'PT') return ['1'].includes(businessType);
            }
            return false;
        }

        watch(getList, (v) => {
            if (!(id.value && v.some((item) => item.value === id.value))) {
                id.value = void 0;
                context.emit('handelSelect', void 0);
                context.emit('change', void 0);
            }
        });

        return {
            id,
            filterOption,
            refreshData,
            handleChange,
            handelSelect,
            getList,
            loading,
        };
    },
});
</script>
