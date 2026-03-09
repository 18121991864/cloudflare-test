<!--通用下拉-->
<template>
    <a-select
        v-model:value="id"
        :disabled="readOnly || disabled"
        show-search
        :placeholder="t('common.PleaseSelect')"
        :filter-option="filterOption"
        allow-clear
        @dropdownVisibleChange="handleList"
    >
        <a-select-option v-if="!pure && !loading" :label="t('common.ALL')" value="">{{ t('common.ALL') }}</a-select-option>
        <template v-for="x in getList" :key="x.value">
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
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'SAPI',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
        api: { type: Function, default: () => {}, required: true },
    },
    setup(props, context) {
        const { t } = useI18n();
        const id = computed({
            get: () => props.modelValue || (!props.pure ? '' : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const getList = ref<PromiseReturnType<{ label: string; value: string }>[]>([]);
        const handleList = () => {
            if (loading.value || getList.value?.length) return;
            loading.value = true;
            getList.value = [];
            props.api()
                .then((data: PromiseReturnType<{ label: string; value: string }>[]) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        const filterOption = (input: string, option: { label: string; value: string }) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange', getList.value);
        watch(
            () => id.value,
            () => {
                handleChange();
            }
        );
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
            t,
        };
    },
});
</script>
