<template>
    <div class="table-container">
        <config-index ref="configRef">
            <template
                #customDataIndex="{
                    data: {
                        record,
                        column: { dataIndex },
                    },
                }"
            >
                <span :class="[record.direction === 1 ? 'text-green-500' : 'text-red-500']" v-if="dataIndex === 'direction'">{{
                    record.direction === 1 ? '买入' : '买出'
                }}</span>
            </template>
        </config-index>
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
