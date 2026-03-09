<template>
    <a-switch v-model:checked="formState[item.value]" v-bind="item.switchConfig" />
</template>
<script setup lang="ts">
import type { UpdateConstructionItem } from '@/config-overall/interface/update';

const props = withDefaults(
    defineProps<{
        item: UpdateConstructionItem;
        formState: any;
    }>(),
    {
        formState: () => ({}),
    }
);
</script>
