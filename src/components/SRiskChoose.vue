<!--风控类型下拉-->
<template>
    <a-select
        v-model:value="id"
        :disabled="readOnly || disabled"
        show-search
        placeholder="请选择"
        :filter-option="filterOption"
        allow-clear
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
    name: 'SRiskChoose',
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
        const getList = ref(Object.create(null));
        const getItemList = (_code: string) => {
            // 获取子项数据
            const { itemList = [], type } = getList.value.find(({ code }: PromiseReturnType<typeof api.fetchTypeChoose>) => code === _code) || {};
            context.emit('update:itemList', itemList || []);
            context.emit('update:type', type);
        };
        const handleList = () => {
            if (loading.value) return;
            loading.value = true;
            getList.value = [];
            api.fetchTypeChoose()
                .then((data: PromiseReturnType<typeof api.fetchTypeChoose>) => {
                    getList.value = data;
                    getItemList(id.value as string);
                })
                .finally(() => {
                    loading.value = false;
                });
        };
        onMounted(handleList);

        watch(
            () => id.value,
            (n, o) => {
                console.log(id.value);
                if (n !== o && n) getItemList(n);
            }
        );

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = () => context.emit('onChange');
        return {
            id,
            filterOption,
            handleChange,
            getList,
            loading,
        };
    },
});
</script>
