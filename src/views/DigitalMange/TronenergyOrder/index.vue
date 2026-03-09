<template>
    <div class="table-container">
        <config-index ref="configRef" />
    </div>
</template>

<script lang="ts" setup>
import queryConfig from './config/query-item';
const configRef = ref<ComponentInstance['ConfigIndex']>();
onActivated(() => {
    configRef.value?.SetConfigFrom(queryConfig.value);
});
</script>

<style lang="scss" scoped></style>
