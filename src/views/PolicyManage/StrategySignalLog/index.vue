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
                <span v-if="dataIndex === 'direction'">{{ $t(['policy.Hold', 'policy.Buy', 'policy.Sell'][record.direction]) }}</span>
            </template>
        </config-index>
    </div>
</template>

<script lang="ts" setup>
import { ConstructionFrom } from '@/config-overall/interface';
import queryConfig from './config/query-item';
const configRef = ref<ComponentInstance['ConfigIndex']>();
const configQuery = ref<ConstructionFrom>();


onActivated(() => {
    configQuery.value = queryConfig().value as ConstructionFrom;
    configRef.value?.SetConfigFrom(configQuery.value);
});
</script>

<style lang="scss" scoped></style>
