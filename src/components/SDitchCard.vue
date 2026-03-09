<!--渠道卡片下拉-->
<template>
    <a-select
        v-model:value="id"
        :disabled="readOnly || disabled"
        show-search
        placeholder="请选择卡片"
        :filter-option="filterOption"
        allow-clear
        @dropdownVisibleChange="handleList"
    >
        <a-select-option v-if="!pure && !loading" label="全部" value="">全部</a-select-option>
        <template v-for="x in getList" :key="x.id">
            <a-select-option :label="x.name" :value="x.id">{{ x.name }}</a-select-option>
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
import emitter from '@/plugins/eventBus';

export default defineComponent({
    name: 'SDitchCard',
    props: {
        modelValue: { type: String, default: '', required: true },
        pure: { type: Boolean, default: false },
        readOnly: { type: Boolean, default: false, required: false },
        disabled: { type: Boolean, default: false, required: false },
        ditchCode: { type: String, default: '', required: false },
        getDitchCardDate: { type: Function, default: () => {}, required: false },
        isGet: { type: Boolean, default: false, required: false },
        category: { type: Number, default: 0, required: true },
    },
    setup(props, context) {
        const id = computed({
            get: () => props.modelValue || (!props.pure ? '' : undefined),
            set: (val) => context.emit('update:modelValue', val),
        });

        const loading = ref(false);
        const getList = ref(Object.create(null));
        const handleList = (open: boolean = true) => {
            return new Promise((resolve) => {
                if (loading.value || !open) return;
                loading.value = true;
                getList.value = [];
                api.fetchDitchCardChoose({
                    agentId: props.agentId,
                    ditchCode: props.ditchCode,
                })
                    .then((data: PromiseReturnType<typeof api.fetchDitchCardChoose>) => {
                        if (props.category == 3) {
                            data = data.filter((x) => x.cardModel !== 2);
                        }

                        getList.value = data;
                        resolve(data);
                    })
                    .finally(() => {
                        loading.value = false;
                    });
            });
        };

        onMounted(handleList);

        const filterOption = (input: string, option: any) => option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;

        const handleChange = (newId: string) => {
            context.emit('onChange', getList.value.filter((x: any) => x.id === newId)[0]);

            context.emit('getType', getList.value.filter((x: any) => x.id === newId)[0]?.cardType);
            emitter.emit('onChangeSDitchCard', getList.value.filter((x: any) => x.id === newId)[0]);
        };

        watch(
            () => getList.value,
            () => {
                props?.getDitchCardDate(getList.value.filter((x: any) => x.id === id.value)[0]);
            }
        );
        watch(
            () => props.isGet,
            (newVal) => {
                if (newVal) {
                    handleList();
                }
            },
            {
                immediate: true,
            }
        );
        watch(
            () => id.value,
            async (newId) => {
                if (newId) {
                    if (!getList.value.length) {
                        await handleList();
                    }
                    handleChange(newId);
                    context.emit(
                        'onChangeItem',
                        getList.value.find((x: any) => x.id === newId)
                    );
                }
            },
            {
                immediate: true,
            }
        );

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
