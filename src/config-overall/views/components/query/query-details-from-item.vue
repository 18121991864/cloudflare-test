<template>
    <a-descriptions bordered :column="column || 2">
        <template v-for="(item, index) in fieldNames" :key="index">
            <a-descriptions-item v-if="item.label" :span="item.span || 1">
                <template #label>
                    <slot name="lable" v-if="lableSlots.includes(item.value)" :data="{ ...formState }" :dataIndex="item.value"> </slot>
                    <div v-else>{{ item.label }}</div>
                </template>
                <template v-if="customSlots.includes(item.value)">
                    <slot name="customSlots" :data="{ ...formState }" :dataIndex="item.value"></slot>
                </template>
                <span v-else-if="formState[item.value]">{{ formState[item.value] }}</span>
                <span v-else-if="formState[item.value] === 0">0</span>
                <span v-else>--</span>
            </a-descriptions-item>
        </template>
    </a-descriptions>
</template>

<script lang="ts" setup>
import type { InfoDataeConstructionItem } from '@/config-overall/interface/info';
import { template } from 'lodash-es';

withDefaults(
    defineProps<{
        formState: any;
        fieldNames: InfoDataeConstructionItem[];
        customSlots: string[];
        lableSlots: string[];
        column: number;
    }>(),
    {
        fieldNames: () => [],
        formState: () => ({}),
        customSlots: () => [],
        column: 2,
        lableSlots: () => [],
    }
);
</script>

<style lang="less" scoped></style>
