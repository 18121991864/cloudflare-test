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
                <template v-if="dataIndex === 'cancelReason'">
                    <!-- <a-tooltip v-if="record.cancelReason">
                        <template #title>{{ record.cancelReason }}</template>
                        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                            {{ record.cancelReason }}
                        </div>
                    </a-tooltip>
                    <div v-else>--</div> -->
                    {{ record.cancelReason || '--' }}
                </template>
            </template>
        </config-index>
    </div>
</template>

<script lang="ts" setup>
import { ConstructionFrom } from '@/config-overall/interface';
import queryConfig from './config/query-item';
const configRef = ref<ComponentInstance['ConfigIndex']>();

const reasonText = computed(() => {
    return (text: string, state: number) => {
        if (state == 6) {
            let parts = text.split('/N');
            return parts;
        }
        return text;
    };
});

const configQuery = ref<ConstructionFrom>();


onActivated(() => {
    configQuery.value = queryConfig().value as ConstructionFrom;
    configRef.value?.SetConfigFrom(configQuery.value);
});
</script>

<style lang="scss" scoped></style>
