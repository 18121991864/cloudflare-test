<template>
  <span :class="[`${_status?.colorName ?? ''}`, getColorClass]">
    {{ _status?.label }}
  </span>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue';
import { commonLevelEnumMap } from '@/enums/whitelistEnum';

defineOptions({ name: 'WhitelistLevelCell' });
const props = defineProps({
    status: {
        type: String,
        required: true
    }
});

const _status = computed(() => commonLevelEnumMap.get(props.status as any));

const getColorClass = computed(() => unref(_status)?.colorName ?? '');
</script>

<style scoped></style>
