<template>
    <a-tabs :activeKey="activeKey" centered @tabClick="tabClick">
        <a-tab-pane :tab="showTable(buttonPermissions, item)" v-for="item in activeData" :key="item.key"></a-tab-pane>
    </a-tabs>
</template>

<script lang="ts" setup>
import type { activeDataType } from '@/config-overall/interface';

const props = withDefaults(
    defineProps<{
        activeData: activeDataType[];
        activeKey: string;
        handleOnSubmit: () => void;
    }>(),
    {
        activeData: () => [],
        activeKey: '1',
        handleOnSubmit: () => {
            return Promise.resolve();
        },
    }
);

const emits = defineEmits<{
    'update:activeKey': [value: string];
}>();
const tabClick = (item: any) => {
    emits('update:activeKey', String(item));
};
const showTable = computed(() => {
    return (buttonPermissions: (permission: string, spa?: boolean) => boolean, item: activeDataType) => {
        if (!item.role) return item.tab;
        return buttonPermissions(item.role) ? item.tab : '';
    };
});
</script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
    margin-bottom: 20px !important;
    &::before {
        border-bottom: 0 !important;
    }
}
</style>
