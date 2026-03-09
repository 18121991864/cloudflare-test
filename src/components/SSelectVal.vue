<!--下拉框类型-->
<template>
    <a-select
        v-model:value="id"
        :disabled="readOnly || disabled"
        show-search
        placeholder="请选择"
        :filter-option="filterOption"
        allow-clear
        mode="multiple"
        option-label-prop="children"
        @change="handleChange"
    >
        <a-select-option v-if="!pure && !loading" label="全部" value="">全部</a-select-option>
        <template v-for="x in getList" :key="x.code">
            <a-select-option :label="x.name" :value="x.code">{{ x.name }}</a-select-option>
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
import api from '@/api/channel/index';

export default defineComponent({
    name: 'SSelectVal',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        code: { type: String, default: '' },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || [],
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const getList = ref(Object.create(null));
        const handleList = () => {
            if (loading.value) return;
            loading.value = true;
            getList.value = [];
            api.fetchSelectValChoose({ code: props?.code })
                .then((data: PromiseReturnType<typeof api.fetchSelectValChoose>) => {
                    getList.value = data;
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        watch(
            () => props.code,
            (n, o) => {
                if (n !== o && n) handleList();
            }
        );

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange');
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
