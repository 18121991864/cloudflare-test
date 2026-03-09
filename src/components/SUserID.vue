<!--币种下拉-->
<template>
    <a-select
        v-model:value="userId"
        :disabled="readOnly || disabled"
        show-search
        placeholder="请选择"
        :filter-option="filterOption"
        allow-clear
        @change="handleChange"
        @dropdownVisibleChange="handleList"
    >
        <a-select-option v-if="!pure && !loading" label="全部" value="">全部</a-select-option>
        <template v-for="x in getList" :key="x.userId">
            <a-select-option :label="x.realName" :value="x.userId">{{ x.realName }}</a-select-option>
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

export default defineComponent({
    name: 'SUserID',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
    },
    setup(props, context) {
        const userId = computed({
            get: () => props.modelValue || (!props.pure ? '' : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const getList = ref(Object.create(null));
        const handleList = (open: boolean = true) => {
            if (loading.value || !open) return;
            loading.value = true;
            getList.value = [];
            api.fetchSysUserListChoose({
                pageNo: 1,
                pageSize: 500,
            })
                .then((data: PromiseReturnType<typeof api.fetchSysUserListChoose>) => {
                    getList.value = data?.list;
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange');
        return {
            userId,
            filterOption,
            handleList,
            handleChange,
            getList,
            loading,
        };
    },
});
</script>
