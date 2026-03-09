<template>
  <span :class="[`${_status?.colorName ?? ''}`, getColorClass]">
    已{{ _status?.label }}
  </span>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue';
import { whitelistStateEnumMap } from '@/enums/whitelistEnum';

defineOptions({ name: 'WhitelistStateCell' });
const props = defineProps({
    status: {
        type: String,
        required: true
    }
});

const _status = computed(() => whitelistStateEnumMap.get(props.status as any));

const getColorClass = computed(() => unref(_status)?.colorName ?? '');
</script>

<style scoped></style>
